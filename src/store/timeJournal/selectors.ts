import type { ActiveTimeJournalSession } from "./types";

export const getActiveSessionElapsedSeconds = (
  session: ActiveTimeJournalSession | null,
  now: number
): number => {
  if (!session) {
    return 0;
  }

  const liveSeconds =
    session.resumedAt === null
      ? 0
      : Math.max(0, (now - session.resumedAt) / 1000);

  return Math.max(
    0,
    Math.floor(session.accumulatedSeconds + liveSeconds)
  );
};

export const formatJournalDuration = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
};
