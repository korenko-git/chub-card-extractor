import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('Cleaning up Playwright tests...');
  
  // Keep test downloads for debugging - don't clean them up
  console.log('Test downloads preserved in ./test-downloads/ for debugging.');
  
  console.log('Global teardown complete.');
}

export default globalTeardown;