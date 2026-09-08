## ADDED Requirements

### Requirement: Compact floating timer surface

The application SHALL provide a compact, translucent timer surface optimized
for placement near the top center of a display.

#### Scenario: Enter compact mode

- **WHEN** the user enables compact mode
- **THEN** the native window becomes a wide, short surface
- **AND** the window is positioned near the horizontal center and top of the
  current monitor when platform APIs allow it

### Requirement: Essential activity controls

The compact surface SHALL show the active activity, elapsed duration, and
manual pause/resume and end controls when a journal session is active.

#### Scenario: Control a journal session from the island

- **WHEN** a journal session is active in compact mode
- **THEN** the user can pause, resume, or end it without restoring the full
  management window

#### Scenario: No journal session is active

- **WHEN** compact mode is enabled without an active journal session
- **THEN** the existing Pomodoro countdown and its core controls remain
  available
