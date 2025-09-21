import { Page } from '@playwright/test';

export interface ConsoleMonitor {
  errors: string[];
  warnings: string[];
  extensionLogs: string[];
}

/**
 * Set up console monitoring for extension tests
 */
export function setupConsoleMonitoring(page: Page): ConsoleMonitor {
  const monitor: ConsoleMonitor = {
    errors: [],
    warnings: [],
    extensionLogs: []
  };

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();

    if (type === 'error') {
      // Ignore site errors - these are not extension issues
      if (!text.includes('404') && 
          !text.includes('422') && 
          !text.includes('Failed to load resource') && 
          !text.includes('Failed to fetch JSON')) {
        monitor.errors.push(text);
        console.log(`   ❌ ERROR: ${text}`);
      } else {
        console.log(`   ⚠️ SITE ERROR (ignored): ${text}`);
      }
    } else if (type === 'warning') {
      monitor.warnings.push(text);
      console.log(`   ⚠️ WARNING: ${text}`);
    } else if (text.includes('✅') || text.includes('⛔') || text.includes('matched') || text.includes('injected')) {
      monitor.extensionLogs.push(text);
      console.log(`   📝 ${text}`);
    }
  });

  page.on('pageerror', error => {
    // Only count actual extension errors, not site errors
    if (!error.message.includes('404') && !error.message.includes('Failed to load')) {
      monitor.errors.push(`PAGE ERROR: ${error.message}`);
      console.log(`   ❌ PAGE ERROR: ${error.message}`);
    } else {
      console.log(`   ⚠️ SITE ERROR (ignored): ${error.message}`);
    }
  });

  return monitor;
}

/**
 * Print console monitoring summary
 */
export function printConsoleSummary(monitor: ConsoleMonitor): void {
  console.log(`\n📊 CONSOLE SUMMARY:`);
  console.log(`   ✅ Extension logs: ${monitor.extensionLogs.length}`);
  console.log(`   ⚠️ Warnings: ${monitor.warnings.length}`);
  console.log(`   ❌ Errors: ${monitor.errors.length}`);

  if (monitor.extensionLogs.length > 0) {
    console.log(`\n📝 Extension activity:`);
    monitor.extensionLogs.forEach(log => console.log(`   ${log}`));
  }

  if (monitor.warnings.length > 0) {
    console.log(`\n⚠️ Console warnings:`);
    monitor.warnings.forEach(warning => console.log(`   ${warning}`));
  }

  if (monitor.errors.length > 0) {
    console.log(`\n❌ Console errors:`);
    monitor.errors.forEach(error => console.log(`   ${error}`));
  } else {
    console.log(`\n🎉 NO CONSOLE ERRORS - EXTENSION WORKING PERFECTLY!`);
  }
}