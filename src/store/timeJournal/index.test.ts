import { afterEach, describe, expect, it, vi } from "vitest";

const setupLocalStorage = (stored: unknown = null) => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) =>
      key === "time-journal" && stored !== null
        ? JSON.stringify(stored)
        : null
    ),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  });
};

describe("time journal reducer", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("starts, pauses, resumes, and ends one manual session", async () => {
    setupLocalStorage();
    const {
      default: reducer,
      endTimeJournalSession,
      pauseTimeJournalSession,
      resumeTimeJournalSession,
      startTimeJournalSession,
    } = await import("./index");

    let state = reducer(undefined, { type: "@@INIT" });
    state = reducer(
      state,
      startTimeJournalSession({
        id: "session-1",
        title: "  Read paper  ",
        category: "learning",
        note: "  chapter 2  ",
        startedAt: 1_000,
      })
    );
    state = reducer(state, pauseTimeJournalSession(31_000));
    state = reducer(state, resumeTimeJournalSession(61_000));
    state = reducer(state, endTimeJournalSession(91_000));

    expect(state.activeSession).toBeNull();
    expect(state.records).toEqual([
      {
        id: "session-1",
        title: "Read paper",
        category: "learning",
        note: "chapter 2",
        startedAt: 1_000,
        endedAt: 91_000,
        durationSeconds: 60,
      },
    ]);
  });

  it("edits and deletes a completed record", async () => {
    setupLocalStorage({
      activeSession: null,
      records: [
        {
          id: "session-1",
          title: "Draft",
          category: "focus",
          note: "",
          startedAt: 1_000,
          endedAt: 61_000,
          durationSeconds: 60,
        },
      ],
    });
    const {
      default: reducer,
      deleteTimeJournalRecord,
      editTimeJournalRecord,
    } = await import("./index");

    let state = reducer(undefined, { type: "@@INIT" });
    state = reducer(
      state,
      editTimeJournalRecord({
        id: "session-1",
        title: "Final draft",
        category: "planning",
        note: "Ready",
      })
    );

    expect(state.records[0]).toMatchObject({
      title: "Final draft",
      category: "planning",
      note: "Ready",
    });

    state = reducer(state, deleteTimeJournalRecord("session-1"));
    expect(state.records).toEqual([]);
  });
});
