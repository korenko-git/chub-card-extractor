export const NOTIFICATION_TYPE = {
  SUCCESS: { key: "SUCCESS", color: "#4CAF50", badge: "✓" },
  ERROR: { key: "ERROR", color: "#FF4444", badge: "✗" },
  WARNING: { key: "WARNING", color: "#FFD700", badge: "❌" },
  INFO: { key: "INFO", color: "#2196F3", badge: "ℹ" },
  LOADING: { key: "LOADING", color: "#FFA500", badge: "⚙️" },
  CLEAR: { key: "CLEAR", color: "#FFF", badge: "" },
} as const;

export type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];

// Show notification on invalid site
export const showSiteNotification = async (tabId: number, text: string, type: NotificationType = NOTIFICATION_TYPE.INFO) => {
  try {
    await browser.scripting.executeScript({
      target: { tabId },
      func: (msg: string, color: string) => {
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: ${color};
          color: white;
          padding: 12px 20px;
          border-radius: 6px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        notification.textContent = msg;
        document.body.appendChild(notification);

        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 4000);
      },
      args: [text, type.color],
    });
  } catch (error) {
    console.error('Notification:', text);
  }
};

export const updateBadge = (tabId: number | undefined, type: NotificationType, customText?: string) => {
  if (tabId) {
    const text = customText || type.badge;
    getAction().setBadgeText({ tabId, text });
    getAction().setBadgeBackgroundColor({ tabId, color: type.color });
  }
};

// Clear all badges across tabs
export const clearAllBadges = async () => {
  const tabs = await browser.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      updateBadge(tab.id, NOTIFICATION_TYPE.CLEAR);
    }
  }
};

// Update icon based on URL validity
export const updateIcon = async (tabId: number, isValid: boolean) => {
  const iconSuffix = isValid ? '-active' : '';

  try {
    await getAction().setIcon({
      tabId: tabId,
      path: {
        '16': `/icon/16${iconSuffix}.png`,
        '32': `/icon/32${iconSuffix}.png`,
        '48': `/icon/48${iconSuffix}.png`,
        '128': `/icon/128${iconSuffix}.png`
      }
    });
  } catch (error) {
    console.error('Error setting icon:', error);
  }
};

export const getAction = () => {
  return (browser.action ?? browser.browserAction);
};