import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
    testDir: './tests/specs',
    fullyParallel: false, // Run tests sequentially to avoid conflicts
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Single worker to avoid extension conflicts
    reporter: 'html',

    use: {
        baseURL: 'https://chub.ai',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    projects: [
        {
            name: 'chrome-extension',
            testMatch: '**/extension.spec.ts',
            testIgnore: '**/*firefox*',
            use: {
                ...devices['Desktop Chrome'],
                acceptDownloads: true,
            },
        },
        {
            name: 'firefox-extension', 
            testMatch: '**/extension.spec.ts',
            testIgnore: '**/*chrome*',
            use: {
                ...devices['Desktop Firefox'],
                acceptDownloads: true,
            },
        },
    ],

    // Global setup and teardown
    globalSetup: './tests/config/global-setup.ts',
    globalTeardown: './tests/config/global-teardown.ts',

    // Test timeout settings
    timeout: 120000, // 2 minutes per test
    expect: {
        timeout: 10000, // 10 seconds for assertions
    },
});