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

  browser.runtime.onMessage.addListener(async (msg, _sender, sendResponse) => {
    if (msg.action === "downloadFile") {
      try {
        const blob = new Blob([msg.data], { type: msg.mimeType || 'application/octet-stream' });
        const objectUrl = URL.createObjectURL(blob);

        if (!browser.downloads?.download) {
          URL.revokeObjectURL(objectUrl);
          sendResponse({ status: "fallback" });
          return;
        }

        await browser.downloads.download({
          url: objectUrl,
          filename: msg.filename,
          saveAs: true,
        });
        
        URL.revokeObjectURL(objectUrl);
        sendResponse({ status: "ok" });

        return true;
      } catch (error) {
        console.error('Error in background download:', error);
        sendResponse({ status: "fallback" });
      }
      
      return true;
    }
  });
});
