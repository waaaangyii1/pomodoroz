import styled, { css, keyframes } from "styled-components";
import type { TimeJournalCategory } from "store";

const categoryColor = (category: TimeJournalCategory) => {
  switch (category) {
    case "focus":
      return "#9185ff";
    case "learning":
      return "#62cfff";
    case "communication":
      return "#ff91a6";
    case "planning":
      return "#f4c66e";
    case "life":
      return "#66d8a5";
    default:
      return "#a2a7b2";
  }
};

const breathe = keyframes`
  0%, 100% { opacity: 0.58; transform: scale(0.82); }
  50% { opacity: 1; transform: scale(1); }
`;

export const StyledTimeIslandStage = styled.main`
  width: 100%;
  height: 100%;
  padding: 0.8rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: transparent;
`;

export const StyledTimeIsland = styled.section`
  width: min(62rem, calc(100vw - 1.6rem));
  height: 6.2rem;
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) auto auto;
  align-items: center;
  gap: 1.2rem;
  padding: 0.7rem 0.9rem 0.7rem 1.7rem;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 999px;
  background: rgba(8, 9, 13, 0.82);
  box-shadow:
    0 1.6rem 4rem rgba(0, 0, 0, 0.34),
    inset 0 1px rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(24px) saturate(135%);
  -webkit-backdrop-filter: blur(24px) saturate(135%);
`;

export const StyledTimeIslandDragRegion = styled.div`
  min-width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export const StyledTimeIslandPulse = styled.span<{
  $category: TimeJournalCategory;
  $paused: boolean;
}>`
  position: relative;
  flex: 0 0 auto;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: ${(props) =>
    props.$paused ? "#888d98" : categoryColor(props.$category)};
  box-shadow: 0 0 1.4rem
    ${(props) =>
      props.$paused
        ? "rgba(136, 141, 152, 0.4)"
        : categoryColor(props.$category)};

  &::after {
    content: "";
    position: absolute;
    inset: -0.5rem;
    border: 1px solid currentColor;
    border-radius: 50%;
    color: ${(props) => categoryColor(props.$category)};
    ${(props) =>
      !props.$paused &&
      css`
        animation: ${breathe} 2.2s ease-in-out infinite;
      `}
  }
`;

export const StyledTimeIslandMeta = styled.div`
  min-width: 0;
  pointer-events: none;

  span,
  strong {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    margin-bottom: 0.25rem;
    color: rgba(255, 255, 255, 0.46);
    font-size: 0.95rem;
    letter-spacing: 0.04em;
  }

  strong {
    color: rgba(255, 255, 255, 0.92);
    font-size: 1.25rem;
    font-weight: 500;
  }
`;

export const StyledTimeIslandClock = styled.strong`
  padding-left: 1.2rem;
  color: #fff;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  font-family: Noto-Sans, sans-serif;
  font-size: 2.2rem;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
`;

export const StyledTimeIslandActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StyledTimeIslandButton = styled.button<{
  $primary?: boolean;
}>`
  width: 4.2rem;
  height: 4.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: ${(props) =>
    props.$primary ? "#101116" : "rgba(255, 255, 255, 0.72)"};
  border: 1px solid
    ${(props) =>
      props.$primary
        ? "rgba(255, 255, 255, 0.86)"
        : "rgba(255, 255, 255, 0.1)"};
  border-radius: 50%;
  background: ${(props) =>
    props.$primary
      ? "rgba(255, 255, 255, 0.9)"
      : "rgba(255, 255, 255, 0.06)"};
  cursor: pointer;
  transition:
    background 140ms ease,
    color 140ms ease,
    transform 140ms ease;

  &:hover {
    color: ${(props) => (props.$primary ? "#000" : "#fff")};
    background: ${(props) =>
      props.$primary ? "#fff" : "rgba(255, 255, 255, 0.12)"};
    transform: scale(1.04);
  }

  svg {
    width: 1.65rem;
    height: 1.65rem;
    fill: currentColor;
  }
`;

export const StyledTimeIslandStop = styled.span`
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.3rem;
  background: currentColor;
`;
