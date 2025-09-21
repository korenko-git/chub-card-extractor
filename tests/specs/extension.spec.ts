import { test, expect } from '@playwright/test';
import { testUrls, timeouts } from '../config/test-data';
import { getFileHash, getFileSizeKB } from '../helpers/file-utils';
import { setupConsoleMonitoring, printConsoleSummary } from '../helpers/console-monitor';
import { launchExtensionContext, triggerExtension } from '../helpers/extension-launcher';
import { saveDownloadedFile, cleanOldDownloads } from '../helpers/download-manager';

/**
 * Test extension extraction functionality
 */
async function testExtraction(cardType: 'character' | 'lorebook' | 'preset', browserName: 'chrome' | 'firefox' = 'chrome') {
    console.log(`🚀 Testing ${cardType} extraction on ${browserName}`);

    // Launch browser with extension
    const context = await launchExtensionContext(browserName);
    const page = await context.newPage();

    // Set up console monitoring
    const consoleMonitor = setupConsoleMonitoring(page);

    try {
        // Navigate to test URL
        const url = testUrls[cardType];
        console.log(`🌐 Loading: ${url}`);

        await page.goto(url, { waitUntil: 'networkidle', timeout: timeouts.pageLoad });
        await page.waitForTimeout(3000);

        // Set up download listener
        const downloadPromise = page.waitForEvent('download', { timeout: timeouts.download });

        // Trigger extension
        await triggerExtension(page, browserName);

        console.log(`⏳ Waiting for download...`);

        // Wait for download
        const download = await downloadPromise;
        const downloadPath = await download.path();

        if (!downloadPath) {
            throw new Error('No download received');
        }

        console.log(`📥 Downloaded: ${downloadPath}`);

        // Save to test artifacts directory
        const savedPath = await saveDownloadedFile(downloadPath, cardType, browserName);

        // Analyze downloaded file
        const sizeKB = getFileSizeKB(savedPath);
        const fileHash = getFileHash(savedPath);

        console.log(`\n✅ ${cardType.toUpperCase()} EXTRACTION SUCCESS!`);
        console.log(`📦 Archive size: ${sizeKB} KB`);
        console.log(`�  File hash: ${fileHash}`);
        console.log(`�  Temp path: ${downloadPath}`);
        console.log(`�  Saved path: ${savedPath}`);

        // Print console summary
        printConsoleSummary(consoleMonitor);

        // Verify download success
        expect(sizeKB).toBeGreaterThan(0);
        expect(fileHash).toBeTruthy();

        // Main goal: no console errors
        expect(consoleMonitor.errors.length).toBe(0);

    } finally {
        await context.close();
    }
}

/**
 * Test that extension does nothing on non-chub sites
 */
async function testExtensionOnWrongSite(browserName: 'chrome' | 'firefox' = 'chrome') {
    console.log(`🚀 Testing extension on wrong site (${browserName})`);

    const context = await launchExtensionContext(browserName);
    const page = await context.newPage();
    const consoleMonitor = setupConsoleMonitoring(page);

    try {
        // Navigate to non-chub site
        const wrongUrl = 'https://example.com';
        console.log(`🌐 Loading wrong site: ${wrongUrl}`);

        await page.goto(wrongUrl, { waitUntil: 'networkidle', timeout: timeouts.pageLoad });
        await page.waitForTimeout(3000);

        // Set up download listener with short timeout
        const downloadPromise = page.waitForEvent('download', { timeout: 5000 });

        // Try to trigger extension
        await triggerExtension(page, browserName);

        console.log(`⏳ Waiting for download (should timeout)...`);

        try {
            await downloadPromise;
            throw new Error('Extension should not download on wrong site!');
        } catch (error) {
            if (error instanceof Error && error.message.includes('Timeout')) {
                console.log(`✅ Correctly no download on wrong site`);
            } else {
                throw error;
            }
        }

        printConsoleSummary(consoleMonitor);

        // Should have no console errors
        expect(consoleMonitor.errors.length).toBe(0);

    } finally {
        await context.close();
    }
}

/**
 * Test that extension does nothing on wrong chub URLs
 */
async function testExtensionOnWrongChubUrl(browserName: 'chrome' | 'firefox' = 'chrome') {
    console.log(`🚀 Testing extension on wrong chub URL (${browserName})`);

    const context = await launchExtensionContext(browserName);
    const page = await context.newPage();
    const consoleMonitor = setupConsoleMonitoring(page);

    try {
        // Navigate to chub.ai but wrong page (not a card/lorebook/preset)
        const wrongChubUrl = 'https://chub.ai/browse';
        console.log(`🌐 Loading wrong chub URL: ${wrongChubUrl}`);

        await page.goto(wrongChubUrl, { waitUntil: 'networkidle', timeout: timeouts.pageLoad });
        await page.waitForTimeout(3000);

        // Set up download listener with short timeout
        const downloadPromise = page.waitForEvent('download', { timeout: 5000 });

        // Try to trigger extension
        await triggerExtension(page, browserName);

        console.log(`⏳ Waiting for download (should timeout)...`);

        try {
            await downloadPromise;
            throw new Error('Extension should not download on wrong chub URL!');
        } catch (error) {
            if (error instanceof Error && error.message.includes('Timeout')) {
                console.log(`✅ Correctly no download on wrong chub URL`);
            } else {
                throw error;
            }
        }

        printConsoleSummary(consoleMonitor);

        // Should have no console errors
        expect(consoleMonitor.errors.length).toBe(0);

    } finally {
        await context.close();
    }
}

// Chrome Tests
test.describe('Chrome Extension Tests', () => {
    test.beforeAll(async () => {
        cleanOldDownloads('chrome');
    });

    test('extract character card (Chrome)', async () => {
        await testExtraction('character', 'chrome');
    });

    test('extract lorebook (Chrome)', async () => {
        await testExtraction('lorebook', 'chrome');
    });

    test('extract preset (Chrome)', async () => {
        await testExtraction('preset', 'chrome');
    });

    test('should do nothing on non-chub site (Chrome)', async () => {
        await testExtensionOnWrongSite('chrome');
    });

    test('should do nothing on wrong chub URL (Chrome)', async () => {
        await testExtensionOnWrongChubUrl('chrome');
    });
});

// Firefox Tests
test.describe('Firefox Extension Tests', () => {
    test.beforeAll(async () => {
        cleanOldDownloads('firefox');
    });

    test('extract character card (Firefox)', async () => {
        await testExtraction('character', 'firefox');
    });

    test('extract lorebook (Firefox)', async () => {
        await testExtraction('lorebook', 'firefox');
    });

    test('extract preset (Firefox)', async () => {
        await testExtraction('preset', 'firefox');
    });

    test('should do nothing on non-chub site (Firefox)', async () => {
        await testExtensionOnWrongSite('firefox');
    });

    test('should do nothing on wrong chub URL (Firefox)', async () => {
        await testExtensionOnWrongChubUrl('firefox');
    });
});