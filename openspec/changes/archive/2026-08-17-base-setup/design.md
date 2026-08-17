## Context

Greenfield Firefox WebExtension — no existing code or specs in this repo. See proposal.md - Why for motivation. This document covers the extension's file layout, data model, and the key API-level decisions needed to implement the `alias-navigation` and `alias-management` capabilities.

## Goals / Non-Goals

**Goals:**
- A minimal, single-purpose extension: one storage schema shared by the omnibox trigger and the two management surfaces (popup, options page).
- Keep runtime permissions as narrow as the `omnibox`/`tabs`/`storage` APIs allow.

**Non-Goals:**
- Cross-device sync (explicitly deferred — local storage only, per proposal).
- Fuzzy/typo-tolerant alias matching — prefix match only in this change.
- Packaging/publishing to addons.mozilla.org — this change covers a working local extension, not a store listing.

## Decisions

**Manifest V3, non-persistent background script.**
Firefox's currently recommended manifest version. The `omnibox` API is available to MV3 background scripts. Firefox runs MV3 backgrounds as event pages (not true Chrome-style service workers), meaning the script can be unloaded between events. Because of this, the background script treats `browser.storage.local` as the single source of truth and never caches alias data in module-level variables across calls — every `omnibox.onInputChanged`/`onInputEntered` call re-reads storage. The dataset (expected: tens to low hundreds of aliases) is small enough that this has no meaningful performance cost.

**Single storage object, not one key per alias.**
All aliases live under one `browser.storage.local` key (`aliases`), as a map of `normalizedAlias -> { alias, url, title }` (`normalizedAlias` is the lowercased key used for lookup/uniqueness; `alias` preserves the user's original casing for display). Rationale: import/export needs the whole set atomically anyway, the expected scale is small, and a single read/write avoids partial-update races between the popup and options page. Alternative considered — one storage key per alias — would let `storage.onChanged` diff more precisely, but adds complexity (key naming/collision with reserved keys) for no benefit at this scale.

**Permissions: `storage` and `activeTab`, not the broader `tabs` permission.**
This refines the proposal's Impact section, which listed `tabs` — investigating the concrete API calls shows it isn't needed:
- Omnibox navigation (`browser.tabs.update(...)` / `browser.tabs.create(...)`) does not require the `tabs` permission when called without reading another tab's `url`/`title` first; calling `tabs.update` with no `tabId` targets the active tab.
- The popup's quick-capture reads the active tab's `url`/`title` via `browser.tabs.query({active: true, currentWindow: true})`. This only requires `activeTab`, which is granted automatically when the user invokes the extension (clicking the toolbar icon to open the popup counts as invocation), and is a less sensitive permission than blanket `tabs` access.
This keeps the install-time permission prompt minimal (no "access your tabs" warning).

**No-match suggestion opens the options page, not the popup.**
`onInputEntered`'s background-script context cannot reliably open the toolbar popup programmatically. The "no alias found — add one?" suggestion instead calls `browser.runtime.openOptionsPage()` and passes the typed text via a query parameter, which the options page reads on load to pre-fill its add-alias form. This works uniformly regardless of how the options page is configured to open.

**Duplicate-alias confirmation is a custom inline UI, not `window.confirm`.**
Both the popup and options page check for an existing key before writing and, on collision, show an inline "`<alias>` already points to `<url>` — overwrite?" affordance with explicit confirm/cancel controls, rather than a native `confirm()` dialog. Slightly more markup, but keeps styling consistent between the two surfaces and avoids native-dialog quirks inside an extension popup (which closes if it loses focus, including to its own confirm dialog in some cases).

**Suggestion matching and ranking.**
On `onInputChanged`, the background script normalizes the typed text (lowercase, trim) and filters stored aliases whose normalized key starts with it, capped at 8 suggestions, exact match (if any) sorted first, remainder alphabetical. `onInputEntered` re-resolves the entered text against storage rather than trusting suggestion `content` blindly, so plain-Enter-with-exact-match works even if the suggestion list hasn't rendered yet.

## Risks / Trade-offs

- **Event page unload mid-interaction** → Mitigated by treating storage as the sole state (see above); no in-memory cache to go stale.
- **`aa` keyword could collide with another installed extension's chosen keyword** → Firefox's `omnibox` API does not prevent two extensions from registering the same keyword; behavior in that case is a platform-level ambiguity outside this extension's control. Not mitigated in this change; acceptable for a personal-use extension.
- **Prefix-only matching misses typos** → Accepted for v1 per Goals/Non-Goals; revisit if it proves limiting in practice.
- **Local-only storage means aliases don't follow the user across machines** → Explicit product decision (see proposal); export/import from `alias-management` is the manual workaround.

## Migration Plan

N/A — first change in the repo, no existing users or data to migrate. Initial install is via `about:debugging` → "Load Temporary Add-on" (or packaged install) pointed at `manifest.json`.
