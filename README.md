# GoAlias

A browser extension that lets you jump straight to your favorite pages by typing a short alias in the address bar.

Type `aa <alias>` in the address bar, hit Enter, and you're there — no bookmarks menu, no search.

## Features

- **Address bar navigation** — type the `aa` keyword followed by an alias (e.g. `aa gh`) to navigate directly to the saved URL. Partial matches show suggestions as you type.
- **Quick capture** — the toolbar popup lets you save the current tab as an alias in one click.
- **Alias manager** — a full options page to add, edit, search, and delete aliases.
- **Import / export** — back up your aliases to a JSON file or restore them on another machine/profile.
- **Duplicate protection** — saving an alias that already exists asks for confirmation before overwriting.

## Installation (temporary / development)

This extension is built against the WebExtensions API (`browser.*`) and targets Firefox.

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Click **Load Temporary Add-on…**.
3. Select the `manifest.json` file in this repository.

The extension will remain installed until Firefox is restarted.

## Usage

### Save an alias

- Click the GoAlias toolbar icon, then either:
  - Click **Save current tab as alias** to prefill the URL and title, or
  - Fill in the Alias, URL, and Title fields manually.
- Click **Save**.

### Navigate to an alias

1. Click the address bar and type `aa` followed by a space.
2. Start typing your alias — matching suggestions appear, showing each alias and the URL it points to.
3. Press Enter to go to the highlighted/typed alias, or select a suggestion.

If no alias matches what you typed, GoAlias offers to add it as a new alias, which opens the options page with the alias field pre-filled.

### Manage aliases

Open the options page (via the popup's **Manage aliases** button, or the extension's settings) to:

- Search aliases by name or title.
- Edit the title/URL of an existing alias inline and save.
- Delete an alias.
- Export all aliases as a JSON file.
- Import aliases from a JSON file — non-conflicting entries are added immediately, and any alias that collides with an existing one prompts you to overwrite or skip it.

## Project structure

```
manifest.json       Extension manifest (Manifest V3, browser.* / Gecko target)
background.js        Omnibox ("aa") keyword handling and navigation
storage.js            Shared alias storage helpers (browser.storage.local)
popup/                Toolbar popup: quick capture and alias save form
options/              Options page: alias manager, import/export
icons/                Extension icons
```

Data model: aliases are stored under a single `browser.storage.local` key (`aliases`), keyed by the lowercased, trimmed alias, with each entry holding `{ alias, url, title }`.

## Development notes

This project uses [OpenSpec](https://github.com/Fission-AI/OpenSpec) to track specs and change proposals — see the `openspec/` directory for current specs (`openspec/specs/`) and past changes (`openspec/changes/archive/`).
