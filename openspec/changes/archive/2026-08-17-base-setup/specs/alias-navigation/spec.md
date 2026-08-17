## Purpose

Lets the user jump straight to a saved page by typing a short alias in the address bar, without opening any extension UI.

## ADDED Requirements

### Requirement: Keyword activation
The system SHALL register `aa` as an address-bar keyword so that typing `aa` followed by a space arms alias-suggestion mode in the address bar.

#### Scenario: User arms alias mode
- **WHEN** the user types `aa ` in the address bar
- **THEN** the address bar switches into the extension's suggestion mode and awaits alias text

### Requirement: Live suggestion matching
While alias mode is armed, the system SHALL show a live, updating list of suggestions matching the text typed after the keyword. Matching SHALL be case-insensitive and based on the alias starting with the typed text.

#### Scenario: Typing a prefix shows matches
- **WHEN** the user has saved an alias `gh` for `https://github.com` and types `aa g` in the address bar
- **THEN** the suggestion list includes an entry for `gh` showing its destination

#### Scenario: Matching ignores case
- **WHEN** the user has saved an alias `GH` and types `aa gh`
- **THEN** the suggestion list includes the `GH` alias

### Requirement: Navigate on Enter
The system SHALL navigate to the URL of the matching alias when the user presses Enter. If the typed text exactly matches a saved alias, that exact match SHALL take priority over other prefix matches.

#### Scenario: Exact match navigates directly
- **WHEN** the user types `aa gh` and presses Enter, and both `gh` and `ghost` aliases exist
- **THEN** the browser navigates to the URL saved for the `gh` alias

#### Scenario: Selecting a suggestion navigates to it
- **WHEN** the user types `aa g`, sees `gh` and `git` as suggestions, and selects `git` before pressing Enter
- **THEN** the browser navigates to the URL saved for the `git` alias

### Requirement: Suggestion disposition is respected
The system SHALL open the resolved URL in the current tab, a new foreground tab, or a new background tab according to the disposition Firefox reports for the triggering action (e.g. Enter vs. Alt/Shift+Enter vs. middle-click on a suggestion).

#### Scenario: Plain Enter navigates current tab
- **WHEN** the user presses Enter on a matched alias with the default disposition
- **THEN** the current tab navigates to the alias's URL

#### Scenario: Modified Enter opens a new tab
- **WHEN** the user presses the modifier combination that Firefox reports as a "new foreground tab" disposition on a matched alias
- **THEN** the alias's URL opens in a new foreground tab instead of replacing the current tab

### Requirement: No-match handling
When the typed text after the keyword matches no saved alias, the system SHALL show a suggestion offering to create a new alias for that text instead of navigating anywhere. Pressing Enter without selecting that suggestion SHALL NOT navigate or fall back to a web search.

#### Scenario: Unmatched text offers to add an alias
- **WHEN** the user types `aa newthing` and no alias named `newthing` exists
- **THEN** the suggestion list shows an option to add `newthing` as a new alias, and no navigation suggestion is shown

#### Scenario: Enter with no match does nothing
- **WHEN** the user types `aa newthing`, no alias matches, and the user presses Enter without selecting the "add alias" suggestion
- **THEN** the browser does not navigate and does not perform a web search
