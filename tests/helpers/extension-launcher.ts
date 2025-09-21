import { chromium, firefox, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Launch Chrome with extension loaded
 */
export async function launchExtensionContext(browserName: 'chrome' | 'firefox' = 'chrome'): Promise<BrowserContext> {
  if (browserName === 'firefox') {
    return await launchFirefoxExtensionContext();
  }
  
  const extensionPath = path.resolve('.output/chrome-mv3');

  if (!fs.existsSync(extensionPath)) {
    throw new Error(`Chrome extension not built. Run: npm run build`);
  }

  console.log(`📁 Chrome extension path: ${extensionPath}`);

  return await chromium.launchPersistentContext('', {
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      '--no-sandbox'
    ]
  });
}

/**
 * Launch Firefox with extension loaded
 */
export async function launchFirefoxExtensionContext(): Promise<BrowserContext> {
  const extensionPath = path.resolve('.output/firefox-mv2');

  if (!fs.existsSync(extensionPath)) {
    throw new Error(`Firefox extension not built. Run: npm run build:firefox`);
  }

  console.log(`📁 Firefox extension path: ${extensionPath}`);

  // Firefox needs the extension as a temporary add-on
  const context = await firefox.launchPersistentContext('', {
    headless: false,
    args: ['--no-sandbox']
  });

  // Install extension in Firefox
  const manifestPath = path.join(extensionPath, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    console.log(`🦊 Installing Firefox extension...`);
    // Firefox extension installation is handled differently
    // We'll inject the content script manually like Chrome
  }

  return context;
}

/**
 * Inject content script to trigger extension
 */
export async function triggerExtension(page: any, browserName: 'chrome' | 'firefox' = 'chrome'): Promise<void> {
  console.log(`🎯 Activating ${browserName} extension...`);
  
  const extensionPath = browserName === 'firefox' 
    ? path.resolve('.output/firefox-mv2')
    : path.resolve('.output/chrome-mv3');
  
  // Execute content script directly (what background.ts does)
  const contentScriptPath = path.join(extensionPath, 'content-scripts', 'content.js');
  
  if (!fs.existsSync(contentScriptPath)) {
    throw new Error(`Content script not found at ${contentScriptPath}`);
  }
  
  await page.addScriptTag({
    path: contentScriptPath
  });
}