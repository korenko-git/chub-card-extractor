# Test Downloads

This directory contains downloaded files from extension tests.

## Structure

```
test-downloads/
├── chrome/
│   ├── character_2025-09-21T16-30-45-123Z.zip
│   ├── lorebook_2025-09-21T16-30-50-456Z.zip
│   └── preset_2025-09-21T16-30-55-789Z.zip
└── firefox/
    └── (future Firefox test downloads)
```

## Cleanup

- Only the last 5 downloads per card type are kept
- Old files are automatically cleaned before each test run
- Files are named with timestamps for easy identification

## Usage

These files can be used for:
- Manual verification of extraction results
- Debugging test failures
- Regression testing by comparing file sizes
- CI/CD artifacts for test evidence