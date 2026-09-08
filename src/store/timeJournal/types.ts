import type { PayloadAction } from "@reduxjs/toolkit";

export const TIME_JOURNAL_CATEGORIES = [
  "focus",
  "learning",
  "communication",
  "planning",
  "life",
  "other",
] as const;

export type TimeJournalCategory =
  (typeof TIME_JOURNAL_CATEGORIES)[number];

export type ActiveTimeJournalSession = {
  id: string;
  title: string;
  category: TimeJournalCategory;
  note: string;
  startedAt: number;
  accumulatedSeconds: number;
  resumedAt: number | null;
};

export type TimeJournalRecord = {
  id: string;
  title: string;
  category: TimeJournalCategory;
  note: string;
  startedAt: number;
  endedAt: number;
  durationSeconds: number;
};

export type TimeJournalState = {
  activeSession: ActiveTimeJournalSession | null;
  records: TimeJournalRecord[];
};

export type StartTimeJournalPayload = Pick<
  ActiveTimeJournalSession,
  "id" | "title" | "category" | "note" | "startedAt"
>;

export type EditTimeJournalRecordPayload = {
  id: TimeJournalRecord["id"];
  title: TimeJournalRecord["title"];
  category: TimeJournalRecord["category"];
  note: TimeJournalRecord["note"];
};

export type TimeJournalPayload<T extends keyof TimeJournalState> =
  PayloadAction<TimeJournalState[T]>;
