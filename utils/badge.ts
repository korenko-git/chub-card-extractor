export const updateBadge = (tabId: number, text: string, color = "#FFD700") => {
  browser.action?.setBadgeText({ tabId, text });
  browser.action?.setBadgeBackgroundColor({ tabId, color });
};

// Clear all badges across tabs
export const clearAllBadges = async () => {
  const tabs = await browser.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      updateBadge(tab.id, "");
    }
  }
};

// Set default colored icon
export const setDefaultIcon = async () => {
  try {
    await browser.action.setIcon({
      path: {
        '16': '/icon-16.png',
        '48': '/icon-48.png',
        '128': '/icon-128.png'
      }
    });
  } catch (error) {
    console.error('Error setting default icon:', error);
  }
};