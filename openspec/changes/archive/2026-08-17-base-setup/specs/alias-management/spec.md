## Purpose

Lets the user create, review, edit, delete, and back up their saved aliases, either quickly from the toolbar or in bulk from a dedicated management page.

## ADDED Requirements

### Requirement: Alias storage
The system SHALL persist each alias as a record containing a unique alias key, a destination URL, and a title, stored locally on the device via the browser's local extension storage. Alias keys SHALL be treated as case-insensitive for uniqueness and lookup purposes.

#### Scenario: Saved alias persists across browser restarts
- **WHEN** the user saves an alias and later restarts the browser
- **THEN** the alias is still available for lookup and appears in the options page list

#### Scenario: Alias keys are case-insensitive
- **WHEN** an alias `GH` already exists and the user attempts to save a new alias `gh`
- **THEN** the system treats it as the same alias key, not a distinct one

### Requirement: Manual alias creation from the popup
The system SHALL provide a toolbar popup with a form to manually enter an alias and a destination URL and save it.

#### Scenario: User adds an alias manually
- **WHEN** the user opens the popup, enters alias `docs` and URL `https://example.com/docs`, and saves
- **THEN** the alias `docs` becomes resolvable to that URL from the address bar

### Requirement: Quick-capture current tab
The system SHALL provide a one-click action in the popup that pre-fills the URL and title fields from the currently active tab, requiring the user to supply only the alias.

#### Scenario: User quick-captures the active tab
- **WHEN** the user is on `https://example.com/pricing` titled "Pricing", opens the popup, and triggers quick-capture
- **THEN** the URL field is pre-filled with `https://example.com/pricing` and the title field with "Pricing", leaving only the alias field for the user to fill in

### Requirement: Duplicate alias confirmation
When the user attempts to save an alias whose key already exists, the system SHALL warn the user and require explicit confirmation before overwriting the existing record.

#### Scenario: Saving over an existing alias asks for confirmation
- **WHEN** the user saves an alias `gh` while an alias `gh` already exists pointing to a different URL
- **THEN** the system shows a warning that `gh` already exists and does not overwrite it until the user confirms

#### Scenario: Cancelling the confirmation preserves the original
- **WHEN** the duplicate-alias warning is shown and the user declines to overwrite
- **THEN** the existing alias `gh` keeps its original URL unchanged

### Requirement: Options page listing and search
The system SHALL provide an options page, opened in a browser tab, that lists all saved aliases and lets the user filter the list by typing a search term matched against alias or title.

#### Scenario: Options page lists all aliases
- **WHEN** the user opens the options page
- **THEN** every saved alias is shown with its alias key, title, and destination URL

#### Scenario: Search filters the list
- **WHEN** the user types part of an alias or title into the options page search field
- **THEN** only aliases whose key or title match the typed text remain visible

### Requirement: Options page edit and delete
The system SHALL let the user edit the URL or title of an existing alias and delete an alias from the options page.

#### Scenario: User edits an alias's URL
- **WHEN** the user edits the URL of alias `gh` on the options page and saves
- **THEN** subsequent lookups of `gh` from the address bar resolve to the updated URL

#### Scenario: User deletes an alias
- **WHEN** the user deletes alias `gh` from the options page
- **THEN** `gh` is no longer resolvable from the address bar and no longer appears in the options page list

### Requirement: Import and export
The system SHALL let the user export all saved aliases as a JSON file and import aliases from a previously exported JSON file, applying the same duplicate-confirmation behavior for any imported alias that collides with an existing one.

#### Scenario: Export produces a JSON file of all aliases
- **WHEN** the user triggers export on the options page
- **THEN** the system produces a JSON file containing every saved alias's key, URL, and title

#### Scenario: Import adds new aliases
- **WHEN** the user imports a JSON file containing aliases not already present
- **THEN** those aliases are added and become resolvable from the address bar

#### Scenario: Import collides with an existing alias
- **WHEN** the user imports a JSON file containing an alias key that already exists locally
- **THEN** the system applies the same duplicate confirmation behavior as manual creation before overwriting it
