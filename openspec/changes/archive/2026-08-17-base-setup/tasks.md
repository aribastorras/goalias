## 1. Extension scaffold

- [x] 1.1 Create `manifest.json` (Manifest V3): name, version, `omnibox.keyword: "aa"`, `permissions: ["storage", "activeTab"]`, background script entry, `browser_action` with popup, `options_page`
- [x] 1.2 Create project file layout: `background.js`, `popup/popup.html`+`popup.js`, `options/options.html`+`options.js`, shared `storage.js`
- [x] 1.3 Load the extension temporarily in Firefox (`about:debugging`) and confirm it installs with no manifest errors

## 2. Shared storage module

- [x] 2.1 Implement `storage.js` with `getAllAliases()`, `getAlias(normalizedKey)`, `saveAlias({alias, url, title})`, `deleteAlias(normalizedKey)` wrapping `browser.storage.local` under the single `aliases` key
- [x] 2.2 Implement alias-key normalization (lowercase, trim) used consistently by storage, background, popup, and options
- [x] 2.3 Implement JSON export (`exportAliases()`) and import (`importAliases(json)`) helpers, with import returning which keys collided with existing aliases

## 3. Address-bar navigation (background script)

- [x] 3.1 Implement `omnibox.onInputChanged`: normalize typed text, read all aliases from storage, filter by prefix match, sort exact match first then alphabetical, cap at 8, call `suggest()`
- [x] 3.2 Implement the no-match case in `onInputChanged`: when no alias matches, call `suggest()` with a single "add `<text>` as a new alias" entry instead of page suggestions
- [x] 3.3 Implement `omnibox.onInputEntered`: re-resolve the entered text against storage (exact match wins); if it matches the "add alias" suggestion, call `browser.runtime.openOptionsPage()` with the typed text passed as a query parameter
- [x] 3.4 Implement disposition handling in `onInputEntered`: `currentTab` → `browser.tabs.update({url})`, `newForegroundTab`/`newBackgroundTab` → `browser.tabs.create({url, active: disposition === "newForegroundTab"})`
- [x] 3.5 Implement the "Enter with no match and nothing selected" case as a no-op (no navigation, no web search fallback)
- [x] 3.6 Set a default omnibox suggestion (`setDefaultSuggestion`) with hint text shown when the alias box is empty

## 4. Toolbar popup

- [x] 4.1 Build popup form: alias input, URL input, save button
- [x] 4.2 Implement "save current tab" quick-capture button using `browser.tabs.query({active: true, currentWindow: true})` to pre-fill URL and title
- [x] 4.3 Implement duplicate-alias check on save: if the normalized key already exists, show inline overwrite confirm/cancel before writing
- [x] 4.4 Wire save action to `storage.js`, clear/close the form on success

## 5. Options page

- [x] 5.1 Build options page layout: search input, alias list table (alias, title, URL, edit, delete)
- [x] 5.2 Implement list rendering from `getAllAliases()` and live filtering by the search input against alias key and title
- [x] 5.3 Implement inline edit of an alias's URL/title with save, using the same duplicate-confirmation UI pattern as the popup where applicable
- [x] 5.4 Implement delete with a confirm step
- [x] 5.5 Implement export button (downloads JSON via `exportAliases()`)
- [x] 5.6 Implement import button (file picker → `importAliases()`), surfacing any key collisions through the duplicate-confirmation UI
- [x] 5.7 On page load, read the alias-prefill query parameter (set by the background script's "add alias" suggestion) and pre-fill the add form with it

## 6. Manual verification

- [x] 6.1 Verify: typing `aa ` then a saved alias's prefix shows it in suggestions, case-insensitively
- [x] 6.2 Verify: Enter on an exact alias match navigates the current tab; modified Enter opens a new tab
- [x] 6.3 Verify: typing an unmatched alias offers "add alias" and plain Enter does nothing
- [x] 6.4 Verify: quick-capture in the popup correctly pre-fills the active tab's URL and title
- [x] 6.5 Verify: saving a duplicate alias (via popup, options edit, and import) prompts for overwrite confirmation in each surface
- [x] 6.6 Verify: export then import on a clean profile restores the full alias list
