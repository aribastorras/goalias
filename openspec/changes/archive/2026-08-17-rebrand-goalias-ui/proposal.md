## Why

The extension currently ships with no icon (Firefox falls back to a generic puzzle-piece placeholder in the toolbar and about:addons), a plain unstyled popup and options page, and an internal name ("Goalias") that doesn't match the product's intended brand ("GoAlias"). This makes the extension harder to recognize in the toolbar and gives a first impression inconsistent with the brand.

## What Changes

- Add the extension icon (sourced from `logo_goalias.png`) at the icon sizes Firefox expects (16/32/48/96/128), wired into `manifest.json` and referenced from the popup/options pages.
- Rename the extension from "Goalias" to "GoAlias" everywhere it is user-visible: `manifest.json` `name`/`default_title`, popup `<title>`, options `<title>` and heading.
- Restyle the popup (`popup/popup.html`) with a visual identity derived from the new icon (color palette, spacing, typography) while preserving all existing form fields, buttons, and behavior.
- Restyle the options/list page (`options/options.html`) with the same visual identity, preserving the existing sections (add form, saved-aliases table with search, import/export) and behavior.
- No changes to `background.js`, `storage.js`, `popup.js`, `options.js` logic, alias storage format, or omnibox behavior.

## Capabilities

### New Capabilities
- `branding`: Establishes the extension's visible identity — its display name ("GoAlias") and icon — across the browser toolbar, about:addons, popup, and options page.

### Modified Capabilities
(none — the popup and options page's functional requirements in `alias-management` are unchanged; only their visual presentation and the extension's name/icon change)

## Impact

- `manifest.json`: `name`, `default_title`, new `icons` map.
- New icon asset files (derived from `logo_goalias.png`) added under an `icons/` directory.
- `popup/popup.html`: inline `<style>` reworked for new visual identity; `<title>` updated.
- `options/options.html`: inline `<style>` reworked for new visual identity; `<title>` and `<h1>` updated.
- No JavaScript logic, storage schema, or permissions changes.
