# Extension Tests

Tests for the Chub Card Extractor extension. Checks that it works in both Chrome and Firefox.

## What we test

Tests open a browser with the extension installed, navigate to chub.ai pages and verify:
- Files download correctly (characters, lorebooks, presets)
- Extension doesn't crash or throw console errors
- Nothing happens on wrong sites

## Test cases

**Positive tests:**
- Character cards
- Lorebooks  
- Presets

**Negative tests:**
- Extension does nothing on other sites
- Extension does nothing on wrong chub.ai pages

## Browsers

- Chrome (MV3)
- Firefox (MV2)

## Running tests

Build extensions first:
```bash
npm run build && npm run build:firefox
```

Then run tests:
```bash
# All tests
npm test

# Chrome only
npm run test:chrome

# Firefox only  
npm run test:firefox

# With visible browser (for debugging)
npm run test:headed
```

## Output

When everything works:
```
✅ CHARACTER EXTRACTION SUCCESS!
📦 Archive size: 202 KB
💾 Saved path: test-downloads/chrome/character_2025-09-21T16-46-15-602Z.zip
🎉 NO CONSOLE ERRORS - EXTENSION WORKING PERFECTLY!
```

When something breaks:
```
❌ Console errors:
   - TypeError: Cannot read property 'data' of null
```

## Structure

```
tests/
├── specs/extension.spec.ts   # Main tests
├── helpers/                  # Helper functions
├── config/                   # Settings and URLs
└── test-downloads/           # Downloaded files
    ├── chrome/
    └── firefox/
```

## Features

- Tests real extension, not mocks
- Tracks browser console errors
- Saves downloaded files for debugging
- Auto-cleans old files
- Verifies extension doesn't work where it shouldn't