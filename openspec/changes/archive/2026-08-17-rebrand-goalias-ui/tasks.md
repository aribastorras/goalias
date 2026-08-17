## 1. Icon asset generation

- [x] 1.1 Generate resized PNGs from `/Users/aleixribas/Downloads/logo_goalias.png` at 16, 32, 48, 96, and 128px and save them under a new `icons/` directory (`icons/icon-16.png`, `icons/icon-32.png`, `icons/icon-48.png`, `icons/icon-96.png`, `icons/icon-128.png`).
- [x] 1.2 Visually check the 16px and 32px icons for legibility; adjust crop/contrast and regenerate if the mark is illegible at toolbar scale.

## 2. Manifest wiring

- [x] 2.1 Add an `icons` map to `manifest.json` pointing at the generated files (16/32/48/96/128).
- [x] 2.2 Add `action.default_icon` (using the 48px icon, or a size map) alongside the existing `action.default_title`.
- [x] 2.3 Update `manifest.json` `name` from "Goalias" to "GoAlias" and `action.default_title` from "Goalias" to "GoAlias".

## 3. Popup restyle and rename

- [x] 3.1 Update `popup/popup.html` `<title>` from "Goalias" to "GoAlias".
- [x] 3.2 Add a small header to the popup showing the icon and the "GoAlias" wordmark, above the existing quick-capture button and form.
- [x] 3.3 Rework the popup's inline `<style>` block to use the new palette (navy/copper/light-blue custom properties from design.md) for background, buttons, labels, and the duplicate-warning banner, without changing any element `id`/`class` that `popup.js` relies on.

## 4. Options/list page restyle and rename

- [x] 4.1 Update `options/options.html` `<title>` from "Goalias Options" to "GoAlias" (or an equivalent GoAlias-branded title) and the `<h1>` from "Goalias" to "GoAlias".
- [x] 4.2 Add the icon next to the `<h1>` heading.
- [x] 4.3 Rework the options page's inline `<style>` block to use the same palette as the popup for section headers, the add-alias form, the saved-aliases table, search input, duplicate/import-collision warning banners, and buttons, without changing any element `id`/`class` that `options.js` relies on.

## 5. Verification

- [x] 5.1 Load the extension unpacked in Firefox (`about:debugging` → Load Temporary Add-on) and confirm the toolbar shows the new icon and "GoAlias" tooltip instead of the placeholder.
- [x] 5.2 Confirm the popup opens with the new styling and header, and that quick-capture, manual add, and duplicate-warning flows still work end to end.
- [x] 5.3 Confirm the options page opens with the new styling, and that add, edit, delete, search, export, and import (including the import-collision warning) still work end to end.
- [x] 5.4 Confirm about:addons shows the "GoAlias" name and the new icon at full resolution.
