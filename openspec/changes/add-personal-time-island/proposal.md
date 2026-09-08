# Change: Add a personal time journal and floating time island

## Why

Pomodoroz records Pomodoro cycles, but it does not provide an open-ended,
manual stopwatch for describing how the day was actually spent. A lightweight
floating timer and a daily journal make it possible to start an activity,
leave the timer visible above other windows, and review the resulting time
allocation later.

## What Changes

- Add a manual time-journal session that can be started, paused, resumed, and
  ended by the user.
- Persist the active session and completed records locally so an app restart
  does not lose the running timer.
- Add a Chinese-first daily management screen with totals, category
  distribution, a chronological timeline, and editable activity metadata.
- Redesign compact mode as a narrow, translucent, Dynamic Island-inspired
  surface while retaining access to the original Pomodoro controls.
- Keep the existing Pomodoro timer, task management, and statistics features.

## Impact

- Affected specs: `personal-time-journal`, `floating-time-island`
- Affected code: renderer routes, Redux persistence, translations, compact
  timer presentation, and Tauri compact-window sizing/positioning
- Dependencies: no new runtime or development dependencies
