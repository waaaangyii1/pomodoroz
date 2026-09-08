import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { v4 as uuid } from "uuid";
import { useAppDispatch, useAppSelector } from "hooks/storeHooks";
import {
  deleteTimeJournalRecord,
  editTimeJournalRecord,
  endTimeJournalSession,
  formatJournalDuration,
  getActiveSessionElapsedSeconds,
  pauseTimeJournalSession,
  resumeTimeJournalSession,
  startTimeJournalSession,
  TIME_JOURNAL_CATEGORIES,
  type TimeJournalCategory,
  type TimeJournalRecord,
} from "store";
import {
  StyledJournal,
  StyledJournalActive,
  StyledJournalActiveActions,
  StyledJournalActiveMeta,
  StyledJournalActiveTime,
  StyledJournalAllocation,
  StyledJournalAllocationBar,
  StyledJournalAllocationHeader,
  StyledJournalAllocationList,
  StyledJournalCategoryDot,
  StyledJournalDateControl,
  StyledJournalEmpty,
  StyledJournalForm,
  StyledJournalHeader,
  StyledJournalInput,
  StyledJournalKicker,
  StyledJournalPanel,
  StyledJournalPanelHeading,
  StyledJournalPrimaryButton,
  StyledJournalRecord,
  StyledJournalRecordActions,
  StyledJournalRecordEdit,
  StyledJournalRecordList,
  StyledJournalRecordMeta,
  StyledJournalRecordTime,
  StyledJournalSecondaryButton,
  StyledJournalSelect,
  StyledJournalSummary,
  StyledJournalSummaryCard,
  StyledJournalSummaryLabel,
  StyledJournalSummaryValue,
  StyledJournalTimeline,
  StyledJournalTimelineBlock,
  StyledJournalTimelineGrid,
  StyledJournalTimelineHour,
  StyledJournalTimelineLane,
  StyledJournalWorkspace,
} from "styles";

const DAY_MS = 24 * 60 * 60 * 1000;
const TIMELINE_START_HOUR = 6;
const TIMELINE_END_HOUR = 24;
const TIMELINE_HOURS = TIMELINE_END_HOUR - TIMELINE_START_HOUR;

type EditableRecord = Pick<
  TimeJournalRecord,
  "id" | "title" | "category" | "note"
>;

const toDateKey = (timestamp: number): string => {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const getDateBounds = (dateKey: string) => {
  const start = new Date(`${dateKey}T00:00:00`).getTime();
  return { start, end: start + DAY_MS };
};

const getOverlapSeconds = (
  record: Pick<
    TimeJournalRecord,
    "startedAt" | "endedAt" | "durationSeconds"
  >,
  dayStart: number,
  dayEnd: number
): number => {
  const wallSeconds = Math.max(
    0,
    (record.endedAt - record.startedAt) / 1000
  );
  const overlapSeconds = Math.max(
    0,
    (Math.min(record.endedAt, dayEnd) -
      Math.max(record.startedAt, dayStart)) /
      1000
  );

  if (wallSeconds === 0) {
    return record.startedAt >= dayStart && record.startedAt < dayEnd
      ? record.durationSeconds
      : 0;
  }

  return record.durationSeconds * (overlapSeconds / wallSeconds);
};

const formatClock = (timestamp: number): string =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(timestamp);

const Journal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { activeSession, records } = useAppSelector(
    (state) => state.timeJournal
  );
  const [now, setNow] = useState(Date.now());
  const [selectedDate, setSelectedDate] = useState(() =>
    toDateKey(Date.now())
  );
  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<TimeJournalCategory>("focus");
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState<EditableRecord | null>(null);
  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!activeSession || activeSession.resumedAt === null) {
      return;
    }

    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [activeSession]);

  useEffect(() => {
    if (!armedDeleteId) {
      return;
    }

    const timeout = window.setTimeout(
      () => setArmedDeleteId(null),
      4000
    );
    return () => window.clearTimeout(timeout);
  }, [armedDeleteId]);

  const bounds = useMemo(
    () => getDateBounds(selectedDate),
    [selectedDate]
  );

  const dayRecords = useMemo(
    () =>
      records
        .filter(
          (record) =>
            record.startedAt < bounds.end &&
            record.endedAt > bounds.start
        )
        .sort((first, second) => second.startedAt - first.startedAt),
    [bounds.end, bounds.start, records]
  );

  const activeElapsed = getActiveSessionElapsedSeconds(
    activeSession,
    now
  );
  const activeDaySeconds = activeSession
    ? (activeSession.startedAt >= bounds.start &&
      activeSession.startedAt < bounds.end
        ? activeSession.accumulatedSeconds
        : 0) +
      (activeSession.resumedAt === null
        ? 0
        : Math.max(
            0,
            (Math.min(now, bounds.end) -
              Math.max(activeSession.resumedAt, bounds.start)) /
              1000
          ))
    : 0;
  const includeActive =
    activeSession !== null &&
    (activeDaySeconds > 0 ||
      (activeSession.startedAt >= bounds.start &&
        activeSession.startedAt < bounds.end));

  const categoryTotals = useMemo(() => {
    const totals = new Map<TimeJournalCategory, number>();
    TIME_JOURNAL_CATEGORIES.forEach((item) => totals.set(item, 0));

    dayRecords.forEach((record) => {
      totals.set(
        record.category,
        (totals.get(record.category) ?? 0) +
          getOverlapSeconds(record, bounds.start, bounds.end)
      );
    });

    if (includeActive && activeSession) {
      totals.set(
        activeSession.category,
        (totals.get(activeSession.category) ?? 0) + activeDaySeconds
      );
    }

    return Array.from(totals.entries())
      .map(([key, seconds]) => ({ key, seconds }))
      .filter((item) => item.seconds > 0)
      .sort((first, second) => second.seconds - first.seconds);
  }, [
    activeDaySeconds,
    activeSession,
    bounds.end,
    bounds.start,
    dayRecords,
    includeActive,
  ]);

  const totalSeconds = categoryTotals.reduce(
    (total, item) => total + item.seconds,
    0
  );
  const focusSeconds = categoryTotals.find(
    (item) => item.key === "focus"
  )?.seconds;
  const selectedDateLabel = new Intl.DateTimeFormat(i18n.language, {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(bounds.start);

  const onStart = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || activeSession) {
      return;
    }

    const startedAt = Date.now();
    dispatch(
      startTimeJournalSession({
        id: uuid(),
        title,
        category,
        note,
        startedAt,
      })
    );
    setNow(startedAt);
    setTitle("");
    setNote("");
    setSelectedDate(toDateKey(startedAt));
  };

  const onPauseResume = () => {
    const timestamp = Date.now();
    dispatch(
      activeSession?.resumedAt === null
        ? resumeTimeJournalSession(timestamp)
        : pauseTimeJournalSession(timestamp)
    );
    setNow(timestamp);
  };

  const onEnd = () => {
    const timestamp = Date.now();
    dispatch(endTimeJournalSession(timestamp));
    setNow(timestamp);
  };

  const onOpenIsland = () => {
    navigate("/", { state: { enableCompactMode: true } });
  };

  const onSaveEdit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing?.title.trim()) {
      return;
    }
    dispatch(editTimeJournalRecord(editing));
    setEditing(null);
  };

  const onDelete = (recordId: string) => {
    if (armedDeleteId !== recordId) {
      setArmedDeleteId(recordId);
      return;
    }
    dispatch(deleteTimeJournalRecord(recordId));
    setArmedDeleteId(null);
  };

  return (
    <StyledJournal aria-label={t("journal.title")}>
      <StyledJournalHeader>
        <div>
          <StyledJournalKicker>
            {t("journal.kicker")}
          </StyledJournalKicker>
          <h2>{t("journal.title")}</h2>
          <p>{t("journal.subtitle")}</p>
        </div>
        <StyledJournalDateControl>
          <span>{selectedDateLabel}</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            aria-label={t("journal.selectDate")}
          />
        </StyledJournalDateControl>
      </StyledJournalHeader>

      {activeSession ? (
        <StyledJournalActive>
          <StyledJournalCategoryDot
            $category={activeSession.category}
          />
          <StyledJournalActiveMeta>
            <span>
              {t(`journal.categories.${activeSession.category}`)} ·{" "}
              {activeSession.resumedAt === null
                ? t("journal.paused")
                : t("journal.tracking")}
            </span>
            <strong>{activeSession.title}</strong>
            {activeSession.note ? (
              <small>{activeSession.note}</small>
            ) : null}
          </StyledJournalActiveMeta>
          <StyledJournalActiveTime>
            {formatJournalDuration(activeElapsed)}
          </StyledJournalActiveTime>
          <StyledJournalActiveActions>
            <StyledJournalSecondaryButton onClick={onPauseResume}>
              {activeSession.resumedAt === null
                ? t("journal.resume")
                : t("journal.pause")}
            </StyledJournalSecondaryButton>
            <StyledJournalSecondaryButton onClick={onOpenIsland}>
              {t("journal.openIsland")}
            </StyledJournalSecondaryButton>
            <StyledJournalPrimaryButton onClick={onEnd}>
              {t("journal.end")}
            </StyledJournalPrimaryButton>
          </StyledJournalActiveActions>
        </StyledJournalActive>
      ) : (
        <StyledJournalForm onSubmit={onStart}>
          <label>
            <span>{t("journal.activity")}</span>
            <StyledJournalInput
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("journal.activityPlaceholder")}
              maxLength={120}
              autoFocus
            />
          </label>
          <label>
            <span>{t("journal.category")}</span>
            <StyledJournalSelect
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as TimeJournalCategory)
              }
            >
              {TIME_JOURNAL_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {t(`journal.categories.${item}`)}
                </option>
              ))}
            </StyledJournalSelect>
          </label>
          <label className="note-field">
            <span>{t("journal.note")}</span>
            <StyledJournalInput
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t("journal.notePlaceholder")}
              maxLength={240}
            />
          </label>
          <StyledJournalPrimaryButton
            type="submit"
            disabled={!title.trim()}
          >
            <span aria-hidden="true">●</span> {t("journal.start")}
          </StyledJournalPrimaryButton>
        </StyledJournalForm>
      )}

      <StyledJournalSummary>
        <StyledJournalSummaryCard>
          <StyledJournalSummaryLabel>
            {t("journal.total")}
          </StyledJournalSummaryLabel>
          <StyledJournalSummaryValue>
            {formatJournalDuration(totalSeconds)}
          </StyledJournalSummaryValue>
        </StyledJournalSummaryCard>
        <StyledJournalSummaryCard>
          <StyledJournalSummaryLabel>
            {t("journal.records")}
          </StyledJournalSummaryLabel>
          <StyledJournalSummaryValue>
            {dayRecords.length + (includeActive ? 1 : 0)}
          </StyledJournalSummaryValue>
        </StyledJournalSummaryCard>
        <StyledJournalSummaryCard>
          <StyledJournalSummaryLabel>
            {t("journal.focusShare")}
          </StyledJournalSummaryLabel>
          <StyledJournalSummaryValue>
            {totalSeconds > 0
              ? `${Math.round(((focusSeconds ?? 0) / totalSeconds) * 100)}%`
              : "—"}
          </StyledJournalSummaryValue>
        </StyledJournalSummaryCard>
      </StyledJournalSummary>

      <StyledJournalWorkspace>
        <StyledJournalPanel>
          <StyledJournalPanelHeading>
            <div>
              <span>{t("journal.timeline")}</span>
              <small>{t("journal.timelineHint")}</small>
            </div>
          </StyledJournalPanelHeading>
          <StyledJournalTimeline>
            <StyledJournalTimelineGrid>
              {Array.from(
                { length: TIMELINE_HOURS + 1 },
                (_, index) => (
                  <StyledJournalTimelineHour key={index}>
                    <span>
                      {String(TIMELINE_START_HOUR + index).padStart(
                        2,
                        "0"
                      )}
                      :00
                    </span>
                    <i />
                  </StyledJournalTimelineHour>
                )
              )}
            </StyledJournalTimelineGrid>
            <StyledJournalTimelineLane>
              {dayRecords.map((record) => {
                const clippedStart = Math.max(
                  record.startedAt,
                  bounds.start
                );
                const clippedEnd = Math.min(record.endedAt, bounds.end);
                const startMinutes =
                  (clippedStart - bounds.start) / 60_000 -
                  TIMELINE_START_HOUR * 60;
                const durationMinutes =
                  (clippedEnd - clippedStart) / 60_000;
                const top = Math.max(0, (startMinutes / 60) * 5.2);
                const height = Math.max(
                  2.8,
                  (durationMinutes / 60) * 5.2
                );

                return (
                  <StyledJournalTimelineBlock
                    key={record.id}
                    $category={record.category}
                    style={{ top: `${top}rem`, height: `${height}rem` }}
                    title={`${record.title} · ${formatJournalDuration(record.durationSeconds)}`}
                  >
                    <strong>{record.title}</strong>
                    <span>
                      {formatClock(record.startedAt)}–
                      {formatClock(record.endedAt)}
                    </span>
                  </StyledJournalTimelineBlock>
                );
              })}
              {includeActive && activeSession ? (
                <StyledJournalTimelineBlock
                  $category={activeSession.category}
                  $active
                  style={{
                    top: `${Math.max(
                      0,
                      (((Math.max(
                        activeSession.startedAt,
                        bounds.start
                      ) -
                        bounds.start) /
                        60_000 -
                        TIMELINE_START_HOUR * 60) /
                        60) *
                        5.2
                    )}rem`,
                    height: `${Math.max(
                      2.8,
                      (activeElapsed / 3600) * 5.2
                    )}rem`,
                  }}
                >
                  <strong>{activeSession.title}</strong>
                  <span>{t("journal.inProgress")}</span>
                </StyledJournalTimelineBlock>
              ) : null}
            </StyledJournalTimelineLane>
          </StyledJournalTimeline>
        </StyledJournalPanel>

        <div>
          <StyledJournalPanel>
            <StyledJournalPanelHeading>
              <span>{t("journal.allocation")}</span>
            </StyledJournalPanelHeading>
            {categoryTotals.length ? (
              <StyledJournalAllocationList>
                {categoryTotals.map((item) => {
                  const percentage = Math.round(
                    (item.seconds / totalSeconds) * 100
                  );
                  return (
                    <StyledJournalAllocation key={item.key}>
                      <StyledJournalAllocationHeader>
                        <span>
                          <StyledJournalCategoryDot
                            $category={item.key}
                          />
                          {t(`journal.categories.${item.key}`)}
                        </span>
                        <strong>
                          {formatJournalDuration(item.seconds)} ·{" "}
                          {percentage}%
                        </strong>
                      </StyledJournalAllocationHeader>
                      <StyledJournalAllocationBar
                        $category={item.key}
                        style={{ width: `${percentage}%` }}
                      />
                    </StyledJournalAllocation>
                  );
                })}
              </StyledJournalAllocationList>
            ) : (
              <StyledJournalEmpty>
                {t("journal.noData")}
              </StyledJournalEmpty>
            )}
          </StyledJournalPanel>

          <StyledJournalPanel>
            <StyledJournalPanelHeading>
              <div>
                <span>{t("journal.detail")}</span>
                <small>{t("journal.detailHint")}</small>
              </div>
            </StyledJournalPanelHeading>
            {dayRecords.length ? (
              <StyledJournalRecordList>
                {dayRecords.map((record) =>
                  editing?.id === record.id ? (
                    <StyledJournalRecordEdit
                      key={record.id}
                      onSubmit={onSaveEdit}
                    >
                      <StyledJournalInput
                        value={editing.title}
                        onChange={(event) =>
                          setEditing({
                            ...editing,
                            title: event.target.value,
                          })
                        }
                        maxLength={120}
                      />
                      <StyledJournalSelect
                        value={editing.category}
                        onChange={(event) =>
                          setEditing({
                            ...editing,
                            category: event.target
                              .value as TimeJournalCategory,
                          })
                        }
                      >
                        {TIME_JOURNAL_CATEGORIES.map((item) => (
                          <option key={item} value={item}>
                            {t(`journal.categories.${item}`)}
                          </option>
                        ))}
                      </StyledJournalSelect>
                      <StyledJournalInput
                        value={editing.note}
                        onChange={(event) =>
                          setEditing({
                            ...editing,
                            note: event.target.value,
                          })
                        }
                        placeholder={t("journal.notePlaceholder")}
                        maxLength={240}
                      />
                      <StyledJournalRecordActions>
                        <StyledJournalSecondaryButton
                          type="button"
                          onClick={() => setEditing(null)}
                        >
                          {t("journal.cancel")}
                        </StyledJournalSecondaryButton>
                        <StyledJournalPrimaryButton type="submit">
                          {t("journal.save")}
                        </StyledJournalPrimaryButton>
                      </StyledJournalRecordActions>
                    </StyledJournalRecordEdit>
                  ) : (
                    <StyledJournalRecord key={record.id}>
                      <StyledJournalCategoryDot
                        $category={record.category}
                      />
                      <StyledJournalRecordMeta>
                        <strong>{record.title}</strong>
                        <span>
                          {t(`journal.categories.${record.category}`)}
                          {record.note ? ` · ${record.note}` : ""}
                        </span>
                      </StyledJournalRecordMeta>
                      <StyledJournalRecordTime>
                        <strong>
                          {formatJournalDuration(
                            record.durationSeconds
                          )}
                        </strong>
                        <span>
                          {formatClock(record.startedAt)}–
                          {formatClock(record.endedAt)}
                        </span>
                      </StyledJournalRecordTime>
                      <StyledJournalRecordActions>
                        <button
                          onClick={() =>
                            setEditing({
                              id: record.id,
                              title: record.title,
                              category: record.category,
                              note: record.note,
                            })
                          }
                        >
                          {t("journal.edit")}
                        </button>
                        <button
                          className={
                            armedDeleteId === record.id ? "danger" : ""
                          }
                          onClick={() => onDelete(record.id)}
                        >
                          {armedDeleteId === record.id
                            ? t("journal.confirmDelete")
                            : t("journal.delete")}
                        </button>
                      </StyledJournalRecordActions>
                    </StyledJournalRecord>
                  )
                )}
              </StyledJournalRecordList>
            ) : (
              <StyledJournalEmpty>
                {t("journal.noRecords")}
              </StyledJournalEmpty>
            )}
          </StyledJournalPanel>
        </div>
      </StyledJournalWorkspace>
    </StyledJournal>
  );
};

export default Journal;
