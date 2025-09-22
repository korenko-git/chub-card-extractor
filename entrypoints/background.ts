import { urlMatches } from '@/utils/matches';
import { updateBadge } from '@/utils/badge';

// Track active operations to prevent multi-click
const activeOperations = new Set<number>();

// Update icon based on URL validity
const updateIcon = async (tabId: number, isValid: boolean) => {
  const iconSuffix = isValid ? '' : '-gray';
  
  try {
    await browser.action.setIcon({
      tabId: tabId,
      path: {
        '16': `/icon-16${iconSuffix}.png`,
        '48': `/icon-48${iconSuffix}.png`, 
        '128': `/icon-128${iconSuffix}.png`
      }
    });
  } catch (error) {
    console.error('Error setting icon:', error);
  }
};

// Show notification on invalid site
const showInvalidSiteNotification = async (tabId: number) => {
  try {
    await browser.scripting.executeScript({
      target: { tabId },
      func: () => {
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ff4444;
          color: white;
          padding: 12px 20px;
          border-radius: 6px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        notification.textContent = 'Chub Card Extractor works only on chub.ai';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 4000);
      }
    });
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
};

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

  // Clean up active operations when tab is closed
  browser.tabs.onRemoved.addListener((tabId) => {
    activeOperations.delete(tabId);
  });

  // Handle extension icon clicks
  (browser.action ?? browser.browserAction).onClicked.addListener(async (tab) => {
    if (!tab.id || !tab.url) return;

    // Prevent multiple simultaneous operations
    if (activeOperations.has(tab.id)) {
      console.log("⏳ Operation already in progress for tab:", tab.id);
      return;
    }

    if (urlMatches(tab.url)) {
      console.log("✅ URL matched:", tab.url);
      
      // Mark operation as active
      activeOperations.add(tab.id);
      
      // Show loading indicator
      updateBadge(tab.id, "⚙️", "#FFA500");
      
      try {
        const res = await browser.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["/content-scripts/content.js"],
        });
        console.log("Injection result:", res);
        
        // Show success indicator
        updateBadge(tab.id, "✓", "#00FF00");
        
        // Clear badge after 3 seconds
        setTimeout(() => {
          updateBadge(tab.id, "");
        }, 3000);
        
      } catch (error) {
        console.error("Extraction error:", error);
        updateBadge(tab.id, "✗", "#FF0000");
        
        // Clear error badge after 5 seconds
        setTimeout(() => {
          updateBadge(tab.id, "");
        }, 5000);
      } finally {
        // Remove operation from active set
        activeOperations.delete(tab.id);
      }
      
    } else {
      console.log("⛔ URL not matched:", tab.url);
      
      // Show warning indicator
      updateBadge(tab.id, "❌", "#FF0000");
      
      // Show notification to user
      await showInvalidSiteNotification(tab.id);
      
      setTimeout(() => {
        updateBadge(tab.id, "");
      }, 2000);
    }
  });

  // Handle download requests from content script
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