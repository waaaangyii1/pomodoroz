import styled, { css } from "styled-components";
import type { TimeJournalCategory } from "store";
import { StyledScrollbar } from "styles/mixins";

const TIMELINE_HOURS = 18;

const categoryColor = (category: TimeJournalCategory) => {
  switch (category) {
    case "focus":
      return "#8b7cff";
    case "learning":
      return "#58c8ff";
    case "communication":
      return "#ff8fa3";
    case "planning":
      return "#f6bd60";
    case "life":
      return "#5dd39e";
    default:
      return "#9297a3";
  }
};

const fieldStyle = css`
  width: 100%;
  min-width: 0;
  height: 4rem;
  padding: 0 1.2rem;
  color: var(--color-heading-text);
  border: 1px solid rgba(127, 127, 127, 0.18);
  border-radius: 1rem;
  background: rgba(var(--color-bg-primary-rgb), 0.68);
  outline: none;

  &:focus {
    border-color: rgba(var(--color-primary-rgb), 0.7);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
  }
`;

const buttonStyle = css`
  min-height: 3.6rem;
  padding: 0 1.4rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    transform 140ms ease,
    opacity 140ms ease,
    background 140ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.42;
    cursor: default;
  }
`;

export const StyledJournal = styled.main`
  width: 100%;
  min-height: 0;
  flex: 1 1;
  padding: clamp(1.6rem, 3vw, 3.2rem);
  overflow: hidden auto;
  background:
    radial-gradient(
      circle at 15% 0%,
      rgba(125, 100, 255, 0.09),
      transparent 30rem
    ),
    var(--color-bg-primary);
  ${StyledScrollbar};
`;

export const StyledJournalHeader = styled.header`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2.4rem;

  h2 {
    margin-top: 0.3rem;
    color: var(--color-heading-text);
    font-size: clamp(2.4rem, 4vw, 4rem);
    font-weight: 500;
    letter-spacing: -0.06em;
  }

  p {
    margin-top: 0.7rem;
    color: var(--color-body-text);
    line-height: 1.6;
  }

  @media (max-width: 620px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const StyledJournalKicker = styled.span`
  color: #8b7cff;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

export const StyledJournalDateControl = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 4.4rem;
  padding: 0.5rem 0.7rem 0.5rem 1.4rem;
  border: 1px solid rgba(127, 127, 127, 0.16);
  border-radius: 999px;
  background: rgba(var(--color-bg-primary-rgb), 0.62);

  span {
    color: var(--color-heading-text);
    font-weight: 500;
    white-space: nowrap;
  }

  input {
    max-width: 13.5rem;
    height: 3.2rem;
    padding: 0 0.8rem;
    color: var(--color-body-text);
    border: none;
    border-radius: 999px;
    background: var(--color-bg-secondary);
    outline: none;
  }
`;

export const StyledJournalForm = styled.form`
  display: grid;
  grid-template-columns:
    minmax(16rem, 2fr) minmax(12rem, 1fr) minmax(16rem, 1.4fr)
    auto;
  gap: 1rem;
  align-items: end;
  padding: 1.4rem;
  border: 1px solid rgba(139, 124, 255, 0.2);
  border-radius: 1.6rem;
  background: rgba(var(--color-bg-primary-rgb), 0.72);
  box-shadow: 0 1.8rem 5rem -4rem rgba(44, 33, 116, 0.5);

  label {
    min-width: 0;
    display: grid;
    gap: 0.6rem;
  }

  label > span {
    padding-left: 0.2rem;
    color: var(--color-disabled-text);
    font-size: 1rem;
    font-weight: 500;
  }

  @media (max-width: 840px) {
    grid-template-columns: 1fr 1fr;

    .note-field {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 460px) {
    grid-template-columns: 1fr;

    .note-field {
      grid-column: auto;
    }
  }
`;

export const StyledJournalInput = styled.input`
  ${fieldStyle};
`;

export const StyledJournalSelect = styled.select`
  ${fieldStyle};
  appearance: auto;
`;

export const StyledJournalPrimaryButton = styled.button`
  ${buttonStyle};
  color: #fff;
  background: #7567ef;

  &:hover:not(:disabled) {
    background: #6557df;
  }
`;

export const StyledJournalSecondaryButton = styled.button`
  ${buttonStyle};
  color: var(--color-heading-text);
  border-color: rgba(127, 127, 127, 0.18);
  background: rgba(var(--color-bg-primary-rgb), 0.54);

  &:hover:not(:disabled) {
    background: var(--color-bg-secondary);
  }
`;

export const StyledJournalActive = styled.section`
  display: grid;
  grid-template-columns: auto minmax(12rem, 1fr) auto auto;
  align-items: center;
  gap: 1.4rem;
  min-height: 8.4rem;
  padding: 1.4rem 1.6rem;
  border: 1px solid rgba(139, 124, 255, 0.26);
  border-radius: 1.8rem;
  background: rgba(93, 77, 186, 0.09);

  @media (max-width: 720px) {
    grid-template-columns: auto 1fr auto;
  }

  @media (max-width: 520px) {
    grid-template-columns: auto 1fr;
  }
`;

export const StyledJournalCategoryDot = styled.i<{
  $category: TimeJournalCategory;
}>`
  display: inline-block;
  flex: 0 0 auto;
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  background: ${(props) => categoryColor(props.$category)};
  box-shadow: 0 0 0 0.4rem
    ${(props) => `${categoryColor(props.$category)}20`};
`;

export const StyledJournalActiveMeta = styled.div`
  min-width: 0;
  display: grid;
  gap: 0.25rem;

  span,
  small {
    color: var(--color-disabled-text);
    font-size: 1.05rem;
  }

  strong {
    overflow: hidden;
    color: var(--color-heading-text);
    font-size: 1.5rem;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const StyledJournalActiveTime = styled.strong`
  color: var(--color-heading-text);
  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
`;

export const StyledJournalActiveActions = styled.div`
  display: flex;
  gap: 0.7rem;

  @media (max-width: 720px) {
    grid-column: 1 / -1;
    justify-content: end;
  }

  @media (max-width: 520px) {
    justify-content: stretch;

    > button {
      flex: 1;
    }
  }
`;

export const StyledJournalSummary = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin: 1.4rem 0;

  @media (max-width: 460px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledJournalSummaryCard = styled.article`
  min-height: 8rem;
  padding: 1.3rem 1.5rem;
  border-left: 2px solid rgba(139, 124, 255, 0.52);
  background: rgba(var(--color-bg-primary-rgb), 0.46);
`;

export const StyledJournalSummaryLabel = styled.span`
  color: var(--color-disabled-text);
  font-size: 1rem;
`;

export const StyledJournalSummaryValue = styled.strong`
  display: block;
  margin-top: 0.7rem;
  color: var(--color-heading-text);
  font-size: clamp(2rem, 3vw, 2.8rem);
  font-weight: 400;
  font-variant-numeric: tabular-nums;
`;

export const StyledJournalWorkspace = styled.section`
  display: grid;
  grid-template-columns: minmax(26rem, 1fr) minmax(30rem, 1.35fr);
  gap: 1.4rem;
  align-items: start;

  > div {
    min-width: 0;
    display: grid;
    gap: 1.4rem;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledJournalPanel = styled.section`
  min-width: 0;
  padding: 1.4rem;
  border: 1px solid rgba(127, 127, 127, 0.14);
  border-radius: 1.4rem;
  background: rgba(var(--color-bg-primary-rgb), 0.46);
`;

export const StyledJournalPanelHeading = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3.2rem;
  margin-bottom: 1rem;
  color: var(--color-heading-text);
  font-weight: 500;

  div {
    display: grid;
    gap: 0.15rem;
  }

  small {
    color: var(--color-disabled-text);
    font-size: 0.95rem;
    font-weight: 400;
  }
`;

export const StyledJournalAllocationList = styled.div`
  display: grid;
  gap: 1.5rem;
`;

export const StyledJournalAllocation = styled.div`
  position: relative;
  padding-bottom: 0.8rem;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.3rem;
    border-radius: 99px;
    background: rgba(127, 127, 127, 0.12);
  }
`;

export const StyledJournalAllocationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    color: var(--color-body-text);
  }

  strong {
    color: var(--color-heading-text);
    font-size: 1.1rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
`;

export const StyledJournalAllocationBar = styled.i<{
  $category: TimeJournalCategory;
}>`
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
  display: block;
  height: 0.3rem;
  border-radius: 99px;
  background: ${(props) => categoryColor(props.$category)};
`;

export const StyledJournalTimeline = styled.div`
  position: relative;
  height: ${TIMELINE_HOURS * 5.2}rem;
  min-height: 36rem;
`;

export const StyledJournalTimelineGrid = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: repeat(${TIMELINE_HOURS}, 5.2rem);
`;

export const StyledJournalTimelineHour = styled.div`
  display: grid;
  grid-template-columns: 4.4rem 1fr;
  align-items: start;

  span {
    color: var(--color-disabled-text);
    font-size: 0.9rem;
    transform: translateY(-0.55rem);
  }

  i {
    height: 1px;
    background: rgba(127, 127, 127, 0.12);
  }
`;

export const StyledJournalTimelineLane = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 4.7rem;
`;

export const StyledJournalTimelineBlock = styled.article<{
  $category: TimeJournalCategory;
  $active?: boolean;
}>`
  position: absolute;
  left: 0;
  right: 0;
  min-height: 2.8rem;
  max-height: 20rem;
  padding: 0.55rem 0.9rem;
  overflow: hidden;
  border-left: 3px solid ${(props) => categoryColor(props.$category)};
  border-radius: 0 0.8rem 0.8rem 0;
  background: ${(props) => `${categoryColor(props.$category)}18`};

  ${(props) =>
    props.$active &&
    css`
      outline: 1px dashed ${categoryColor(props.$category)};
      outline-offset: -1px;
    `}

  strong,
  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: var(--color-heading-text);
    font-size: 1.05rem;
    font-weight: 500;
  }

  span {
    margin-top: 0.15rem;
    color: var(--color-body-text);
    font-size: 0.9rem;
  }
`;

export const StyledJournalRecordList = styled.div`
  display: grid;
  gap: 0.4rem;
`;

export const StyledJournalRecord = styled.article`
  display: grid;
  grid-template-columns: auto minmax(10rem, 1fr) auto auto;
  align-items: center;
  gap: 1rem;
  min-height: 6rem;
  padding: 0.9rem 0.6rem;
  border-bottom: 1px solid rgba(127, 127, 127, 0.12);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    grid-template-columns: auto 1fr auto;
  }
`;

export const StyledJournalRecordMeta = styled.div`
  min-width: 0;

  strong,
  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: var(--color-heading-text);
    font-size: 1.2rem;
    font-weight: 500;
  }

  span {
    margin-top: 0.3rem;
    color: var(--color-disabled-text);
    font-size: 0.95rem;
  }
`;

export const StyledJournalRecordTime = styled.div`
  text-align: right;
  font-variant-numeric: tabular-nums;

  strong,
  span {
    display: block;
  }

  strong {
    color: var(--color-heading-text);
    font-size: 1.1rem;
    font-weight: 500;
  }

  span {
    margin-top: 0.25rem;
    color: var(--color-disabled-text);
    font-size: 0.9rem;
  }
`;

export const StyledJournalRecordActions = styled.div`
  display: flex;
  gap: 0.4rem;

  button {
    min-height: 2.8rem;
    padding: 0 0.7rem;
    border: none;
    border-radius: 999px;
    color: var(--color-body-text);
    background: transparent;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      color: var(--color-heading-text);
      background: rgba(127, 127, 127, 0.1);
    }

    &.danger {
      color: #f06f7d;
      background: rgba(240, 111, 125, 0.1);
    }
  }

  @media (max-width: 480px) {
    grid-column: 2 / -1;
    justify-content: end;
  }
`;

export const StyledJournalRecordEdit = styled.form`
  display: grid;
  grid-template-columns: minmax(12rem, 1fr) minmax(10rem, 0.7fr);
  gap: 0.7rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(127, 127, 127, 0.12);

  > input:nth-of-type(2) {
    grid-column: 1 / -1;
  }

  ${StyledJournalRecordActions} {
    grid-column: 1 / -1;
    justify-content: end;
  }

  @media (max-width: 460px) {
    grid-template-columns: 1fr;

    > input:nth-of-type(2),
    ${StyledJournalRecordActions} {
      grid-column: auto;
    }
  }
`;

export const StyledJournalEmpty = styled.p`
  padding: 2.4rem 1rem;
  color: var(--color-disabled-text);
  text-align: center;
  line-height: 1.6;
`;
