import { urlMatches } from "@/utils/matches";
import {
  NOTIFICATION_TYPE,
  showSiteNotification,
  updateBadge,
  updateIcon,
} from "@/utils/background";

export default defineBackground(() => {
  // Track active tab changes
  browser.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await browser.tabs.get(activeInfo.tabId);
    if (tab.url) {
      const isValid = urlMatches(tab.url);
      await updateIcon(activeInfo.tabId, isValid);
    }
  });

  // Track URL updates in tabs
  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.active) {
      const isValid = urlMatches(changeInfo.url);
      await updateIcon(tabId, isValid);
    }
  });

  // Handle extension icon clicks
  getAction().onClicked.addListener(async (tab) => {
    if (!tab.id || !tab.url) return;

    // Prevent multiple simultaneous operations
    const state = await getAction().getBadgeText({ tabId: tab.id });
    if (state) {
      console.log("⏳ Operation already in progress for tab:", tab.id);
      await showSiteNotification(
        tab.id,
          "Operation already in progress. Please wait...",
          NOTIFICATION_TYPE.WARNING
        );
        return;
      }

      if (urlMatches(tab.url)) {
        console.log("✅ URL matched:", tab.url);

        // Show loading indicator
        updateBadge(tab.id, NOTIFICATION_TYPE.LOADING);

        try {
          const res = await browser.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["/content-scripts/content.js"],
          });
          console.log("Injection result:", res);

          // Show success indicator
          updateBadge(tab.id, NOTIFICATION_TYPE.SUCCESS);

          // Clear badge after 3 seconds
          setTimeout(() => {
            updateBadge(tab.id, NOTIFICATION_TYPE.CLEAR);
          }, 3000);
        } catch (error) {
          console.error("Extraction error:", error);
          updateBadge(tab.id, NOTIFICATION_TYPE.ERROR);

          // Show error notification
          await showSiteNotification(
            tab.id,
            "Extraction failed",
            NOTIFICATION_TYPE.ERROR
          );

          // Clear error badge after 5 seconds
          setTimeout(() => {
            updateBadge(tab.id, NOTIFICATION_TYPE.CLEAR);
          }, 5000);
        }
      } else {
        console.log("⛔ URL not matched:", tab.url);

        // Show warning indicator
        updateBadge(tab.id, NOTIFICATION_TYPE.WARNING);

        // Show notification to user
        await showSiteNotification(
          tab.id,
          "Chub Card Extractor works only on chub.ai",
          NOTIFICATION_TYPE.ERROR
        );

        setTimeout(() => {
          updateBadge(tab.id, NOTIFICATION_TYPE.CLEAR);
        }, 2000);
      }
    }
  );

  // Handle download requests from content script
  browser.runtime.onMessage.addListener(async (msg, _sender, sendResponse) => {
    if (msg.action === "downloadFile") {
      try {
        const blob = new Blob([msg.data], {
          type: msg.mimeType || "application/octet-stream",
        });
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
        console.error("Error in background download:", error);
        sendResponse({ status: "fallback" });
      }

      return true;
    }
  });
});
