## MODIFIED Requirements

### Requirement: Options page listing and search
The system SHALL provide an options page, opened in a browser tab, that lists all saved aliases and lets the user filter the list by typing a search term matched against alias or title. The system SHALL provide a way to open the options page from the popup.

#### Scenario: Options page lists all aliases
- **WHEN** the user opens the options page
- **THEN** every saved alias is shown with its alias key, title, and destination URL

#### Scenario: Search filters the list
- **WHEN** the user types part of an alias or title into the options page search field
- **THEN** only aliases whose key or title match the typed text remain visible

#### Scenario: User opens the options page from the popup
- **WHEN** the user opens the popup and clicks the button that links to the alias list
- **THEN** the options page opens in a new browser tab showing all saved aliases
