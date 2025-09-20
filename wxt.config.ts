import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["activeTab", "scripting", "tabs", "storage", "downloads"],
    host_permissions: [
      "*://*.chub.ai/*"
    ],
    action: {
      "default_icon": {
        "16": "icon/16.png",
        "32": "icon/32.png",
        "48": "icon/48.png",
        "128": "icon/128.png"
      },
      "default_title": "Chub Card Extractor"
    }
  }
});
