import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "Chub Card Extractor",
    permissions: ["activeTab", "scripting", "tabs", "storage", "downloads"],
    host_permissions: [
      "*://*.chub.ai/*",
      "*://*.charhub.io/*"
    ],
    action: {
      "default_icon": {
        "16": "icon/16.png",
        "32": "icon/32.png",
        "48": "icon/48.png",
        "128": "icon/128.png"
      },
      "default_title": "Chub Card Extractor"
    },
    browser_specific_settings: {
      gecko: {
        strict_min_version: "109.0"
      }
    }
  }
});
