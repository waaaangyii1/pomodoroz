## Context

The existing application already has a compact desktop window, always-on-top
support, task selection, and local Redux persistence. The new journal should
reuse these foundations without coupling its open-ended stopwatch to the
Pomodoro countdown state machine.

## Goals / Non-Goals

- Goals:
  - Provide an explicit manual workflow for tracking arbitrary activities.
  - Make the active activity legible in a small, always-available surface.
  - Provide an immediately useful daily allocation view.
  - Preserve existing Pomodoro workflows and stored data.
- Non-Goals:
  - Automatic application/activity detection.
  - Automatic task switching or automatic session ending.
  - Cloud sync, collaboration, or account support.
  - System-wide click-through behavior in the first increment.

## Decisions

### Independent journal state

Journal state is stored in a dedicated Redux slice and localStorage key. The
active stopwatch stores timestamps and accumulated elapsed seconds instead of
updating Redux every second. The UI derives the live duration from the current
clock, which keeps persistence writes small.

### Manual commit boundary

A record is created only when the user explicitly ends the session. Pausing
updates the active session but does not create a completed record. This matches
the requested manual workflow and avoids implicit records on navigation.

### Progressive disclosure in compact mode

Compact mode presents only activity, elapsed time, and essential controls. The
full daily journal remains in the normal window. This keeps the island calm and
readable while leaving data management to a purpose-built screen.

### Styling without new dependencies

The island uses styled-components, CSS gradients, backdrop filtering, and the
existing icon system. The daily view uses CSS grid and semantic HTML rather
than a chart library.

## Risks / Trade-offs

- Browser preview cannot reproduce native window transparency exactly; Tauri
  runtime verification remains necessary for final polish.
- A wide compact window changes the proportions of existing compact task
  panels. Those panels remain functional and are allowed to use the same width.
- Paused sessions survive restart but do not accrue time while paused.

## Migration Plan

- Existing root state and statistics storage are left untouched.
- Missing or invalid journal data falls back to an empty journal.
- The feature can be removed by deleting the journal slice/route and reverting
  compact presentation changes without migrating existing Pomodoro data.
