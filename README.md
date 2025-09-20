# Chub Scraper Extension

**Chub Scraper Extension** is a browser extension built with TypeScript and Vite, designed to extract card data from Chub.ai, including characters, lorebooks, and presets. The extension packages the data into a ZIP file containing JSON, Markdown/HTML, and associated images.

## Features

- Extract metadata and content for:
  - Characters
  - Lorebooks
  - Presets
- Generate HTML/Markdown readme for each card
- Download all data as a ZIP archive
- Automatic image fetching and inclusion
- Badge updates for status tracking
- Cross-browser support (Chrome, Edge, Firefox)
- Hot Module Replacement (HMR) for development with Vite

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/chub-scraper-extension.git
cd chub-scraper-extension
````

2. Install dependencies:

```bash
npm install
```

3. Start development server with HMR:

```bash
npm run dev
```

4. Load the extension in your browser:

   - Chrome/Edge: `chrome://extensions` → Enable **Developer mode** → **Load unpacked** → select the `dist` folder.
   - Firefox: `about:debugging` → Load Temporary Add-on → select `manifest.json`.

## Project Structure

```
chub-scraper-extension/
│
├── core/                # Core logic for API, card processing, zip generation
├── entrypoints/         # Extension entry points: background, content, popup
├── public/              # Public assets like icons
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── .wxt/                # WXT/Vite plugin config & type declarations
├── wxt.config.ts        # WXT/Vite build config
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

- Navigate to a card page on Chub.ai.
- Click the extension icon to extract the card immediately.
- Downloaded ZIP will include:
  - `metadata.json` with all card metadata
  - `readme.html` with a formatted card overview
  - JSON files for main content and nodes
  - Card images (if available)

## License

[MIT License](LICENSE)
