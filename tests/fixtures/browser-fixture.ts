import { test as base } from '@playwright/test';

const test = base.extend<{ myBrowser: 'chrome' | 'firefox' }>({
  myBrowser: async ({}, use, testInfo) => {
    const browser = testInfo.project.name.includes('firefox') ? 'firefox' : 'chrome';
    await use(browser as 'chrome' | 'firefox');
  },
});

export { test };
export const expect = base.expect;
