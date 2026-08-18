## Why

The popup can save aliases but has no link to the options page, where a user reviews, searches, edits, deletes, and imports/exports all saved aliases. The only way to reach that page today is through the browser's own extension-management UI, which is not discoverable.

## What Changes

- Add a button/link in the popup that opens the options page (in a new tab, via `browser.runtime.openOptionsPage()`), letting the user go from the popup to the full alias list without hunting through browser settings.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `alias-management`: adds a requirement that the popup provides a way to navigate to the options page.

## Impact

- `popup/popup.html`: new button/link element.
- `popup/popup.js`: click handler calling `browser.runtime.openOptionsPage()`.
- No manifest changes needed (`options_ui` already declared with `open_in_tab: true`).
