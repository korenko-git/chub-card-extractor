import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('Setting up Playwright tests...');
  
  // Create test downloads directory
  const downloadDir = path.resolve('./test-downloads');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
  
  // Verify extension builds exist
  const chromeExtPath = path.resolve('.output/chrome-mv3');
  const firefoxExtPath = path.resolve('.output/firefox-mv2');
  
  if (!fs.existsSync(chromeExtPath)) {
    console.warn(`Chrome extension not found at ${chromeExtPath}. Run 'npm run build' first.`);
  }
  
  if (!fs.existsSync(firefoxExtPath)) {
    console.warn(`Firefox extension not found at ${firefoxExtPath}. Run 'npm run build:firefox' first.`);
  }
  
  console.log('Global setup complete.');
}

export default globalSetup;