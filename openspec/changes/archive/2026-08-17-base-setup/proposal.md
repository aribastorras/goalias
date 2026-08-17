## Why

Navigating to frequently-used pages currently takes multiple steps (open bookmarks, search history, or type a full URL). A Firefox extension that lets the user define short aliases for URLs and jump to them straight from the address bar removes that friction entirely.

## What Changes

- New Firefox WebExtension (Manifest V3) providing address-bar alias navigation and alias management.
- Register the `aa` keyword via the `omnibox` API: typing `aa <alias>` in the address bar shows live matching suggestions and navigates on Enter.
- Alias resolution is case-insensitive, prefix-matched for suggestions, with exact match taking priority on Enter.
- When no alias matches the typed text, show a "no alias found — add one?" suggestion instead of falling back to a web search; plain Enter does nothing.
- Respect suggestion disposition (`currentTab` / `newForegroundTab` / `newBackgroundTab`) so Shift/Ctrl+Enter behave like native address-bar navigation.
- Toolbar popup with a manual add form (alias + URL) and a one-click "save current tab as alias" quick-capture button that prefills URL and title from the active tab.
- Options page (opened in a tab) listing all aliases with search, inline edit, delete, and JSON import/export.
- Aliases are stored per-device via `browser.storage.local`; no cross-device sync in this change.
- Saving an alias that already exists prompts to confirm overwrite rather than silently replacing it.

## Capabilities

### New Capabilities
- `alias-navigation`: Address-bar `aa <alias>` keyword behavior — suggestion matching, navigation on Enter, disposition handling, and the no-match "add one?" affordance.
- `alias-management`: Alias storage schema and CRUD surfaces — toolbar popup (manual add + quick-capture), options page (list/search/edit/delete/import/export), and duplicate-alias overwrite confirmation.

### Modified Capabilities
(none — this is the first change in the project)

## Impact

- New repo contents: `manifest.json` (MV3), background/event script for the `omnibox` listeners, popup HTML/JS, options page HTML/JS, shared storage helper module.
- Permissions: `storage`, `tabs`, `activeTab` (for quick-capture of the current tab's URL/title).
- No external dependencies or backend services — purely local browser storage.
