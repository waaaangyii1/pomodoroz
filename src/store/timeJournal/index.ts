import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getFromStorage } from "../../utils/storage";
import {
  TIME_JOURNAL_CATEGORIES,
  type EditTimeJournalRecordPayload,
  type StartTimeJournalPayload,
  type TimeJournalCategory,
  type TimeJournalRecord,
  type TimeJournalState,
} from "./types";

export const TIME_JOURNAL_STORAGE_KEY = "time-journal";

const isCategory = (value: unknown): value is TimeJournalCategory =>
  typeof value === "string" &&
  TIME_JOURNAL_CATEGORIES.includes(value as TimeJournalCategory);

const isFiniteTimestamp = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

const normalizeRecord = (value: unknown): TimeJournalRecord | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Partial<TimeJournalRecord>;
  if (
    typeof record.id !== "string" ||
    typeof record.title !== "string" ||
    !isCategory(record.category) ||
    typeof record.note !== "string" ||
    !isFiniteTimestamp(record.startedAt) ||
    !isFiniteTimestamp(record.endedAt) ||
    !isFiniteTimestamp(record.durationSeconds)
  ) {
    return null;
  }

  return {
    id: record.id,
    title: record.title,
    category: record.category,
    note: record.note,
    startedAt: record.startedAt,
    endedAt: record.endedAt,
    durationSeconds: record.durationSeconds,
  };
};

const normalizeState = (value: unknown): TimeJournalState => {
  if (!value || typeof value !== "object") {
    return { activeSession: null, records: [] };
  }

  const candidate = value as Partial<TimeJournalState>;
  const active = candidate.activeSession;
  const activeSession =
    active &&
    typeof active === "object" &&
    typeof active.id === "string" &&
    typeof active.title === "string" &&
    isCategory(active.category) &&
    typeof active.note === "string" &&
    isFiniteTimestamp(active.startedAt) &&
    isFiniteTimestamp(active.accumulatedSeconds) &&
    (active.resumedAt === null || isFiniteTimestamp(active.resumedAt))
      ? active
      : null;

  return {
    activeSession,
    records: Array.isArray(candidate.records)
      ? candidate.records
          .map(normalizeRecord)
          .filter(
            (record): record is TimeJournalRecord => record !== null
          )
      : [],
  };
};

const storedState = getFromStorage<unknown>(TIME_JOURNAL_STORAGE_KEY);
const initialState = normalizeState(storedState);

const elapsedSince = (startedAt: number, endedAt: number): number =>
  Math.max(0, (endedAt - startedAt) / 1000);

const timeJournalSlice = createSlice({
  name: "timeJournal",
  initialState,
  reducers: {
    startTimeJournalSession(
      state,
      action: PayloadAction<StartTimeJournalPayload>
    ) {
      if (state.activeSession || !action.payload.title.trim()) {
        return;
      }

      state.activeSession = {
        ...action.payload,
        title: action.payload.title.trim(),
        note: action.payload.note.trim(),
        accumulatedSeconds: 0,
        resumedAt: action.payload.startedAt,
      };
    },

    pauseTimeJournalSession(state, action: PayloadAction<number>) {
      const active = state.activeSession;
      if (!active || active.resumedAt === null) {
        return;
      }

      active.accumulatedSeconds += elapsedSince(
        active.resumedAt,
        action.payload
      );
      active.resumedAt = null;
    },

    resumeTimeJournalSession(state, action: PayloadAction<number>) {
      const active = state.activeSession;
      if (!active || active.resumedAt !== null) {
        return;
      }

      active.resumedAt = action.payload;
    },

    endTimeJournalSession(state, action: PayloadAction<number>) {
      const active = state.activeSession;
      if (!active) {
        return;
      }

      const liveSeconds =
        active.resumedAt === null
          ? 0
          : elapsedSince(active.resumedAt, action.payload);

      state.records.push({
        id: active.id,
        title: active.title,
        category: active.category,
        note: active.note,
        startedAt: active.startedAt,
        endedAt: action.payload,
        durationSeconds: Math.max(
          0,
          Math.round(active.accumulatedSeconds + liveSeconds)
        ),
      });
      state.activeSession = null;
    },

    cancelTimeJournalSession(state) {
      state.activeSession = null;
    },

    editTimeJournalRecord(
      state,
      action: PayloadAction<EditTimeJournalRecordPayload>
    ) {
      const record = state.records.find(
        (item) => item.id === action.payload.id
      );
      if (!record || !action.payload.title.trim()) {
        return;
      }

      record.title = action.payload.title.trim();
      record.category = action.payload.category;
      record.note = action.payload.note.trim();
    },

    deleteTimeJournalRecord(state, action: PayloadAction<string>) {
      state.records = state.records.filter(
        (record) => record.id !== action.payload
      );
    },
  },
});

export const {
  startTimeJournalSession,
  pauseTimeJournalSession,
  resumeTimeJournalSession,
  endTimeJournalSession,
  cancelTimeJournalSession,
  editTimeJournalRecord,
  deleteTimeJournalRecord,
} = timeJournalSlice.actions;

export * from "./types";
export * from "./selectors";

export default timeJournalSlice.reducer;
