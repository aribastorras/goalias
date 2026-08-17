## Context

Firefox (this is a `browser_specific_settings.gecko` extension) reads `manifest.json`'s `icons` map to render the toolbar action icon, the about:addons listing, and permission prompts, falling back to a puzzle-piece placeholder when absent. The popup (`popup/popup.html`) and options/list page (`options/options.html`) each carry their own inline `<style>` block with minimal, unbranded CSS today. See proposal.md - Why.

The source artwork is `/Users/aleixribas/Downloads/logo_goalias.png` (square, ~535x535, rounded-square badge with a stylized "G/arrow" mark on a navy-to-blue gradient background with copper/orange highlights).

## Goals / Non-Goals

**Goals:**
- Ship a proper multi-resolution icon set so Firefox never falls back to a placeholder.
- Derive a small, consistent color palette from the source artwork and apply it to both the popup and options page so they read as the same product.
- Rename all user-visible occurrences of "Goalias" to "GoAlias".

**Non-Goals:**
- No redesign of information architecture (fields, buttons, table columns, sections stay where they are).
- No new dependencies (no CSS framework, no build step) — extension stays plain HTML/CSS/JS with no bundler.
- No change to `background.js`, `storage.js`, `popup.js`, `options.js` logic or the storage schema.

## Decisions

**Icon generation**: Resize `logo_goalias.png` to the standard WebExtension sizes Firefox requests — 16, 32, 48, 96, 128 — and save as PNGs under a new top-level `icons/` directory (`icons/icon-16.png` ... `icons/icon-128.png`). Reference them from `manifest.json`'s `icons` map and reuse the 48px size as `action.default_icon` where Firefox wants a smaller action-specific icon. Alternative considered: ship only a single 128px icon and let the browser downscale — rejected because small downscaled toolbar icons (16/32px) render soft and lose the mark's line detail; providing dedicated small sizes keeps the toolbar icon crisp.

**Color palette**: Extract two anchor colors directly from the artwork rather than picking arbitrary brand colors — a deep navy (`#16324f`) from the badge background and a copper/orange (`#c9682f`) from the arrow mark, plus a lighter accent blue (`#4f7fab`) for secondary UI elements. Define these as CSS custom properties at the top of each page's `<style>` block (`--goalias-navy`, `--goalias-copper`, `--goalias-blue-light`, plus neutral `--goalias-bg`/`--goalias-text` tones) so both pages share one vocabulary without a shared stylesheet file (kept simple since there's no build step to bundle a shared CSS file, and each HTML file is already self-contained).

**Styling approach**: Keep each page's CSS inline in its own `<style>` block (matching the existing pattern — no shared stylesheet, no bundler), just replace the rule bodies with the new palette/spacing/typography. Popup gets a header row with the icon + "GoAlias" wordmark above the existing form. Options page gets a similarly styled header replacing the plain `<h1>Goalias</h1>`. Table, form, and warning-banner structure (element IDs, classes used by `popup.js`/`options.js`) stay untouched so no JS changes are needed.

**Naming**: Update the literal string "Goalias" → "GoAlias" in: `manifest.json` (`name`, `default_title`), `popup/popup.html` (`<title>`), `options/options.html` (`<title>`, `<h1>`). The manifest's `browser_specific_settings.gecko.id` (`goalias@local`) and the omnibox keyword (`aa`) are internal identifiers, not user-visible strings, and are left unchanged to avoid re-registering the extension ID or breaking muscle memory on the keyword.

## Risks / Trade-offs

- [Resizing a photographic/gradient-heavy 535x535 source down to 16px may lose legibility] → Accept for 16px (browsers only show it at toolbar-icon scale where the overall silhouette still reads); verify visually after generating the icon set and adjust crop/contrast if the mark is illegible at 16px.
- [Manually duplicating palette CSS variables in two files risks drift if colors change later] → Acceptable given only two small pages and no build step today; if a third styled page is added later, revisit extracting a shared `styles.css`.
