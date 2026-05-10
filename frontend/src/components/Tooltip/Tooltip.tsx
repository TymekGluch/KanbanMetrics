"use client";

import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.scss";

export const TOOLTIP_PLACEMENT = {
  TOP: "top",
  BOTTOM: "bottom",
  LEFT: "left",
  RIGHT: "right",
} as const;

export type TooltipPlacement = (typeof TOOLTIP_PLACEMENT)[keyof typeof TOOLTIP_PLACEMENT];

type TooltipProps = {
  children: React.ReactNode;
  description?: React.ReactNode;
  offset?: number;
  placement?: TooltipPlacement;
  title?: React.ReactNode;
};

const SHOW_DELAY_MS = 360;
const HIDE_DELAY_MS = 70;
const TOOLTIP_GAP_PX = 10;
const VIEWPORT_PADDING_PX = 8;

type TooltipPosition = {
  left: number;
  top: number;
};

type TooltipRect = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

function getOppositePlacement(placement: TooltipPlacement): TooltipPlacement {
  switch (placement) {
    case TOOLTIP_PLACEMENT.BOTTOM:
      return TOOLTIP_PLACEMENT.TOP;
    case TOOLTIP_PLACEMENT.LEFT:
      return TOOLTIP_PLACEMENT.RIGHT;
    case TOOLTIP_PLACEMENT.RIGHT:
      return TOOLTIP_PLACEMENT.LEFT;
    default:
      return TOOLTIP_PLACEMENT.BOTTOM;
  }
}

function getFallbackPlacements(placement: TooltipPlacement): TooltipPlacement[] {
  if (placement === TOOLTIP_PLACEMENT.TOP || placement === TOOLTIP_PLACEMENT.BOTTOM) {
    return [TOOLTIP_PLACEMENT.RIGHT, TOOLTIP_PLACEMENT.LEFT];
  }

  return [TOOLTIP_PLACEMENT.TOP, TOOLTIP_PLACEMENT.BOTTOM];
}

function getAnchorPosition(args: {
  gap: number;
  placement: TooltipPlacement;
  triggerRect: DOMRect;
}): TooltipPosition {
  const { triggerRect, placement, gap } = args;

  switch (placement) {
    case TOOLTIP_PLACEMENT.BOTTOM:
      return {
        left: triggerRect.left + triggerRect.width / 2,
        top: triggerRect.bottom + gap,
      };
    case TOOLTIP_PLACEMENT.LEFT:
      return {
        left: triggerRect.left - gap,
        top: triggerRect.top + triggerRect.height / 2,
      };
    case TOOLTIP_PLACEMENT.RIGHT:
      return {
        left: triggerRect.right + gap,
        top: triggerRect.top + triggerRect.height / 2,
      };
    default:
      return {
        left: triggerRect.left + triggerRect.width / 2,
        top: triggerRect.top - gap,
      };
  }
}

function getTooltipRect(args: {
  anchor: TooltipPosition;
  height: number;
  placement: TooltipPlacement;
  width: number;
}): TooltipRect {
  const { anchor, width, height, placement } = args;

  switch (placement) {
    case TOOLTIP_PLACEMENT.BOTTOM:
      return {
        left: anchor.left - width / 2,
        right: anchor.left + width / 2,
        top: anchor.top,
        bottom: anchor.top + height,
      };
    case TOOLTIP_PLACEMENT.LEFT:
      return {
        left: anchor.left - width,
        right: anchor.left,
        top: anchor.top - height / 2,
        bottom: anchor.top + height / 2,
      };
    case TOOLTIP_PLACEMENT.RIGHT:
      return {
        left: anchor.left,
        right: anchor.left + width,
        top: anchor.top - height / 2,
        bottom: anchor.top + height / 2,
      };
    default:
      return {
        left: anchor.left - width / 2,
        right: anchor.left + width / 2,
        top: anchor.top - height,
        bottom: anchor.top,
      };
  }
}

function getOverflowScore(args: {
  rect: TooltipRect;
  viewportHeight: number;
  viewportWidth: number;
}): number {
  const { rect, viewportWidth, viewportHeight } = args;
  const minX = VIEWPORT_PADDING_PX;
  const maxX = viewportWidth - VIEWPORT_PADDING_PX;
  const minY = VIEWPORT_PADDING_PX;
  const maxY = viewportHeight - VIEWPORT_PADDING_PX;

  const overflowLeft = Math.max(0, minX - rect.left);
  const overflowRight = Math.max(0, rect.right - maxX);
  const overflowTop = Math.max(0, minY - rect.top);
  const overflowBottom = Math.max(0, rect.bottom - maxY);

  return overflowLeft + overflowRight + overflowTop + overflowBottom;
}

function clampAnchor(args: {
  anchor: TooltipPosition;
  height: number;
  placement: TooltipPlacement;
  viewportHeight: number;
  viewportWidth: number;
  width: number;
}): TooltipPosition {
  const { anchor, width, height, placement, viewportWidth, viewportHeight } = args;
  const minX = VIEWPORT_PADDING_PX;
  const maxX = viewportWidth - VIEWPORT_PADDING_PX;
  const minY = VIEWPORT_PADDING_PX;
  const maxY = viewportHeight - VIEWPORT_PADDING_PX;

  const nextAnchor = { ...anchor };
  const rect = getTooltipRect({
    anchor: nextAnchor,
    placement,
    width,
    height,
  });

  if (rect.left < minX) {
    nextAnchor.left += minX - rect.left;
  }

  if (rect.right > maxX) {
    nextAnchor.left -= rect.right - maxX;
  }

  if (rect.top < minY) {
    nextAnchor.top += minY - rect.top;
  }

  if (rect.bottom > maxY) {
    nextAnchor.top -= rect.bottom - maxY;
  }

  return nextAnchor;
}

export function Tooltip(props: TooltipProps) {
  const {
    children,
    title,
    description,
    placement = TOOLTIP_PLACEMENT.TOP,
    offset = TOOLTIP_GAP_PX,
  } = props;

  const hasContent =
    (title !== null && title !== undefined) || (description !== null && description !== undefined);
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState<TooltipPosition | null>(null);
  const [resolvedPlacement, setResolvedPlacement] = React.useState<TooltipPlacement>(placement);

  const showTimeoutRef = React.useRef<number | null>(null);
  const hideTimeoutRef = React.useRef<number | null>(null);
  const rootRef = React.useRef<HTMLElement | null>(null);
  const tooltipRef = React.useRef<HTMLSpanElement | null>(null);

  const updateTooltipPosition = React.useCallback(() => {
    if (!rootRef.current || !tooltipRef.current) {
      return;
    }

    const triggerRect = rootRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const placementsToTry: TooltipPlacement[] = [
      placement,
      getOppositePlacement(placement),
      ...getFallbackPlacements(placement),
    ];

    let bestPlacement = placement;
    let bestScore = Number.POSITIVE_INFINITY;

    placementsToTry.forEach((candidatePlacement) => {
      const anchor = getAnchorPosition({
        triggerRect,
        placement: candidatePlacement,
        gap: offset,
      });
      const rect = getTooltipRect({
        anchor,
        placement: candidatePlacement,
        width: tooltipRect.width,
        height: tooltipRect.height,
      });
      const overflowScore = getOverflowScore({
        rect,
        viewportHeight,
        viewportWidth,
      });

      if (overflowScore < bestScore) {
        bestScore = overflowScore;
        bestPlacement = candidatePlacement;
      }
    });

    const bestAnchor = getAnchorPosition({
      triggerRect,
      placement: bestPlacement,
      gap: offset,
    });
    const clampedAnchor = clampAnchor({
      anchor: bestAnchor,
      placement: bestPlacement,
      width: tooltipRect.width,
      height: tooltipRect.height,
      viewportWidth,
      viewportHeight,
    });

    setResolvedPlacement(bestPlacement);
    setPosition(clampedAnchor);
  }, [placement, offset]);

  React.useEffect(() => {
    setResolvedPlacement(placement);
  }, [placement]);

  const clearTimers = React.useCallback(() => {
    if (showTimeoutRef.current) {
      window.clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const handleOpen = React.useCallback(
    (target?: HTMLElement | null) => {
      if (target) {
        rootRef.current = target;
      }

      clearTimers();

      showTimeoutRef.current = window.setTimeout(() => {
        setIsOpen(true);
        showTimeoutRef.current = null;
      }, SHOW_DELAY_MS);
    },
    [clearTimers]
  );

  const handleClose = React.useCallback(() => {
    clearTimers();

    hideTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      hideTimeoutRef.current = null;
    }, HIDE_DELAY_MS);
  }, [clearTimers]);

  React.useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  React.useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    updateTooltipPosition();

    const handleViewportChange = () => {
      updateTooltipPosition();
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen, updateTooltipPosition]);

  if (!hasContent) {
    return <>{children}</>;
  }

  return (
    <>
      <span
        className={styles.tooltipRoot}
        onMouseEnter={(event) => {
          const trigger = event.currentTarget.firstElementChild as HTMLElement | null;
          handleOpen(trigger);
        }}
        onMouseLeave={() => {
          handleClose();
        }}
        onFocusCapture={(event) => {
          const trigger = event.currentTarget.firstElementChild as HTMLElement | null;
          handleOpen(trigger);
        }}
        onBlurCapture={(event) => {
          const nextFocusedElement = event.relatedTarget as Node | null;

          if (!nextFocusedElement || !rootRef.current?.contains(nextFocusedElement)) {
            handleClose();
          }
        }}
        onKeyDownCapture={(event) => {
          if (event.key === "Escape") {
            handleClose();
          }
        }}
      >
        {children}
      </span>

      {createPortal(
        <span
          role="tooltip"
          ref={tooltipRef}
          className={clsx(styles.tooltip, {
            [styles.tooltip__open]: isOpen,
            [styles.tooltip__top]: resolvedPlacement === TOOLTIP_PLACEMENT.TOP,
            [styles.tooltip__bottom]: resolvedPlacement === TOOLTIP_PLACEMENT.BOTTOM,
            [styles.tooltip__left]: resolvedPlacement === TOOLTIP_PLACEMENT.LEFT,
            [styles.tooltip__right]: resolvedPlacement === TOOLTIP_PLACEMENT.RIGHT,
          })}
          style={
            position
              ? {
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                }
              : undefined
          }
        >
          {title !== null && title !== undefined ? (
            <span className={styles.tooltip_title}>{title}</span>
          ) : null}
          {description !== null && description !== undefined ? (
            <span className={styles.tooltip_description}>{description}</span>
          ) : null}
          <span className={styles.tooltip_arrow} />
        </span>,
        document.body
      )}
    </>
  );
}
