export const updateBadge = (tabId: number, text: string, color = "#FFD700") => {
  browser.action?.setBadgeText({ tabId, text });
  browser.action?.setBadgeBackgroundColor({ tabId, color });
}