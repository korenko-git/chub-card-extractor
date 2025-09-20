import { urlMatches } from '@/utils/matches';

export default defineBackground(() => {
  (browser.action ?? browser.browserAction).onClicked.addListener(async (tab) => {
    if (!tab.id || !tab.url) return;
    
    if (urlMatches(tab.url)) {
      console.log("✅ URL matched:", tab.url);
      const res = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["/content-scripts/content.js"],
      });
      console.log("injected result", res);
    } else {
      console.log("⛔ URL not matched:", tab.url);
    }
  });

  browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "downloadFile") {
      const dl = browser.downloads?.download
        ? browser.downloads.download({
            url: msg.url,
            filename: msg.filename,
            saveAs: true,
          })
        : null;

      if (dl && typeof dl.then === "function") {
        dl.then(() => sendResponse({ status: "ok" })).catch(() => sendResponse({ status: "fail" }));

        return true;
      } else {
        sendResponse({ status: "fallback" });
      }
    }
  });
});
