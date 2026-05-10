"use client";

import { resolveProps } from "@/responsive/utils/resolveProps";
import { useResponsiveProp } from "@/responsive/hooks/useResponsive";
import styles from "./Button.module.scss";
import {
  type ButtonAsAnchorProps,
  type ButtonAsButtonProps,
  type ButtonAsNextLinkProps,
} from "./Button.types";
import { BUTTON_SIZES, BUTTON_VARIANTS } from "./button.constants";
import { Base } from "../Base/Base";
import Link from "next/link";
import clsx from "clsx";
import { Tooltip } from "../Tooltip";

function getButtonClassName(props: {
  size: (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES];
  variant: (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];
  disabled?: boolean;
}) {
  const { disabled, variant, size } = props;

  return clsx(styles.button, {
    [styles.button__disabled]: disabled,
    [styles.button__outlined]: variant === BUTTON_VARIANTS.OUTLINED,
    [styles.button__size_default]: size === BUTTON_SIZES.DEFAULT,
    [styles.button__size_large]: size === BUTTON_SIZES.LARGE,
  });
}

export function AsButtonComponent(props: ButtonAsButtonProps) {
  const { stylesProps, rest } = resolveProps(props);
  const {
    children,
    disabled,
    variant = BUTTON_VARIANTS.PRIMARY,
    size: sizeProp = BUTTON_SIZES.DEFAULT,
    StartIconSlot,
    EndIconSlot,
    tooltipTitle,
    tooltipDescription,
    tooltipPlacement,
    tooltipOffset,
    ...buttonProps
  } = rest;
  const size = useResponsiveProp(sizeProp);

  return (
    <Tooltip
      title={tooltipTitle}
      description={tooltipDescription}
      placement={tooltipPlacement}
      offset={tooltipOffset}
    >
      <Base {...stylesProps} asChild className={getButtonClassName({ disabled, variant, size })}>
        <button {...buttonProps} disabled={disabled}>
          {!!StartIconSlot && <span className={styles.button_icon}>{StartIconSlot}</span>}

          {children}
          {!!EndIconSlot && <span className={styles.button_icon}>{EndIconSlot}</span>}
        </button>
      </Base>
    </Tooltip>
  );
}

export function AsAnchorComponent(props: ButtonAsAnchorProps) {
  const { stylesProps, rest } = resolveProps(props);
  const {
    children,
    disabled,
    variant = BUTTON_VARIANTS.PRIMARY,
    size: sizeProp = BUTTON_SIZES.DEFAULT,
    StartIconSlot,
    EndIconSlot,
    tooltipTitle,
    tooltipDescription,
    tooltipPlacement,
    tooltipOffset,
    ...anchorProps
  } = rest;
  const size = useResponsiveProp(sizeProp);

  return (
    <Tooltip
      title={tooltipTitle}
      description={tooltipDescription}
      placement={tooltipPlacement}
      offset={tooltipOffset}
    >
      <Base {...stylesProps} asChild className={getButtonClassName({ disabled, variant, size })}>
        <a {...anchorProps}>
          {!!StartIconSlot && <span className={styles.button_icon}>{StartIconSlot}</span>}
          {children}
          {!!EndIconSlot && <span className={styles.button_icon}>{EndIconSlot}</span>}
        </a>
      </Base>
    </Tooltip>
  );
}

export function AsNextLinkComponent(props: ButtonAsNextLinkProps) {
  const { stylesProps, rest } = resolveProps(props);
  const {
    children,
    disabled,
    variant = BUTTON_VARIANTS.PRIMARY,
    size: sizeProp = BUTTON_SIZES.DEFAULT,
    StartIconSlot,
    EndIconSlot,
    tooltipTitle,
    tooltipDescription,
    tooltipPlacement,
    tooltipOffset,
    ...linkProps
  } = rest;
  const size = useResponsiveProp(sizeProp);

  return (
    <Tooltip
      title={tooltipTitle}
      description={tooltipDescription}
      placement={tooltipPlacement}
      offset={tooltipOffset}
    >
      <Base {...stylesProps} asChild className={getButtonClassName({ disabled, variant, size })}>
        <Link {...linkProps}>
          {!!StartIconSlot && <span className={styles.button_icon}>{StartIconSlot}</span>}
          {children}
          {!!EndIconSlot && <span className={styles.button_icon}>{EndIconSlot}</span>}
        </Link>
      </Base>
    </Tooltip>
  );
}
