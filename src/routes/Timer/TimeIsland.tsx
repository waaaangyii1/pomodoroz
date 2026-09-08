import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { ConnectorContext } from "contexts";
import { SVG } from "components";
import { useAppDispatch, useAppSelector } from "hooks/storeHooks";
import {
  endTimeJournalSession,
  formatJournalDuration,
  getActiveSessionElapsedSeconds,
  pauseTimeJournalSession,
  resumeTimeJournalSession,
  setEnableCompactMode,
} from "store";
import {
  StyledTimeIsland,
  StyledTimeIslandActions,
  StyledTimeIslandButton,
  StyledTimeIslandClock,
  StyledTimeIslandDragRegion,
  StyledTimeIslandMeta,
  StyledTimeIslandPulse,
  StyledTimeIslandStage,
  StyledTimeIslandStop,
} from "styles";

const TimeIsland: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const activeSession = useAppSelector(
    (state) => state.timeJournal.activeSession
  );
  const { onTitlebarDragStart } = useContext(ConnectorContext);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!activeSession || activeSession.resumedAt === null) {
      return;
    }

    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [activeSession]);

  const onDragStart = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.button === 0) {
        onTitlebarDragStart?.();
      }
    },
    [onTitlebarDragStart]
  );

  if (!activeSession) {
    return null;
  }

  const paused = activeSession.resumedAt === null;
  const elapsed = getActiveSessionElapsedSeconds(activeSession, now);

  const onPauseResume = () => {
    const timestamp = Date.now();
    dispatch(
      paused
        ? resumeTimeJournalSession(timestamp)
        : pauseTimeJournalSession(timestamp)
    );
    setNow(timestamp);
  };

  const restoreJournal = () => {
    dispatch(setEnableCompactMode(false));
    navigate("/journal");
  };

  const onEnd = () => {
    dispatch(endTimeJournalSession(Date.now()));
    restoreJournal();
  };

  return (
    <StyledTimeIslandStage>
      <StyledTimeIsland aria-label={t("journal.islandLabel")}>
        <StyledTimeIslandDragRegion
          data-tauri-drag-region
          onMouseDown={onDragStart}
        >
          <StyledTimeIslandPulse
            $category={activeSession.category}
            $paused={paused}
          />
          <StyledTimeIslandMeta>
            <span>
              {t(`journal.categories.${activeSession.category}`)} ·{" "}
              {paused ? t("journal.paused") : t("journal.tracking")}
            </span>
            <strong>{activeSession.title}</strong>
          </StyledTimeIslandMeta>
        </StyledTimeIslandDragRegion>

        <StyledTimeIslandClock>
          {formatJournalDuration(elapsed)}
        </StyledTimeIslandClock>

        <StyledTimeIslandActions>
          <StyledTimeIslandButton
            onClick={onPauseResume}
            title={paused ? t("journal.resume") : t("journal.pause")}
            aria-label={
              paused ? t("journal.resume") : t("journal.pause")
            }
          >
            <SVG name={paused ? "play" : "pause"} />
          </StyledTimeIslandButton>
          <StyledTimeIslandButton
            $primary
            onClick={onEnd}
            title={t("journal.end")}
            aria-label={t("journal.end")}
          >
            <StyledTimeIslandStop />
          </StyledTimeIslandButton>
          <StyledTimeIslandButton
            onClick={restoreJournal}
            title={t("journal.restore")}
            aria-label={t("journal.restore")}
          >
            <SVG
              name="expand"
              style={{ transform: "rotate(180deg)" }}
            />
          </StyledTimeIslandButton>
        </StyledTimeIslandActions>
      </StyledTimeIsland>
    </StyledTimeIslandStage>
  );
};

export default React.memo(TimeIsland);
