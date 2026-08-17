## Purpose

Establishes GoAlias's visible identity — its display name and icon — so the extension is recognizable in the browser toolbar, extension manager, and its own UI surfaces.

## ADDED Requirements

### Requirement: Extension display name
The system SHALL present the extension's name as "GoAlias" in every user-visible surface: the browser toolbar/action tooltip, the browser's extension manager (e.g. about:addons), the popup document title, and the options page document title and heading.

#### Scenario: Toolbar tooltip shows the new name
- **WHEN** the user hovers the extension's toolbar icon
- **THEN** the tooltip reads "GoAlias"

#### Scenario: Extension manager shows the new name
- **WHEN** the user opens the browser's extension manager
- **THEN** the extension is listed as "GoAlias"

#### Scenario: Popup and options page titles show the new name
- **WHEN** the user opens the popup or the options page
- **THEN** each page's title/heading reads "GoAlias" (not "Goalias")

### Requirement: Extension icon
The system SHALL display a dedicated GoAlias icon (derived from the provided logo artwork) in the browser toolbar and the browser's extension manager, at each icon size the browser requests, instead of a generic placeholder icon.

#### Scenario: Toolbar shows the GoAlias icon
- **WHEN** the extension is installed and enabled
- **THEN** the browser toolbar shows the GoAlias icon rather than a default/placeholder icon

#### Scenario: Extension manager shows the GoAlias icon at large size
- **WHEN** the user opens the browser's extension manager
- **THEN** the GoAlias icon is shown at full resolution without pixelation or blurring
