## ADDED Requirements

### Requirement: Manual activity timing

The application SHALL let the user manually start, pause, resume, and end an
open-ended activity session with a title and category.

#### Scenario: Start an activity

- **WHEN** the user enters an activity title and starts timing
- **THEN** the application stores an active session with its start time
- **AND** the elapsed duration begins increasing

#### Scenario: Pause and resume an activity

- **WHEN** the user pauses an active session and later resumes it
- **THEN** time elapsed while paused is excluded from the session duration

#### Scenario: End an activity

- **WHEN** the user explicitly ends an active or paused session
- **THEN** the application creates one completed record with title, category,
  start time, end time, and elapsed duration
- **AND** clears the active session

### Requirement: Durable local journal

The application SHALL persist the active session and completed records locally.

#### Scenario: Restore after restart

- **WHEN** the application starts with a previously persisted journal
- **THEN** completed records are available
- **AND** a running active session continues from its stored timestamps
- **AND** a paused active session remains paused

### Requirement: Daily allocation view

The application SHALL show the selected day's total tracked time, category
allocation, chronological timeline, and individual records.

#### Scenario: Review today

- **WHEN** the user opens the daily journal
- **THEN** records for today are summarized and ordered chronologically
- **AND** empty sections present a useful empty state

#### Scenario: Correct a record

- **WHEN** the user edits a record's title or category
- **THEN** the persisted record and daily summary reflect the change

#### Scenario: Remove a record

- **WHEN** the user confirms deletion of a completed record
- **THEN** the record is removed from the journal and daily summary
