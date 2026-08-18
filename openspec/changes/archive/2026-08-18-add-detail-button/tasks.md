## 1. Popup UI

- [x] 1.1 Add a button/link in `popup/popup.html` (e.g. "Manage aliases") that opens the options page, styled consistently with the existing popup buttons
- [x] 1.2 In `popup/popup.js`, wire the button's click handler to `browser.runtime.openOptionsPage()`

## 2. Verification

- [x] 2.1 Load the unpacked extension, open the popup, click the new button, and confirm the options page opens in a new tab listing saved aliases
