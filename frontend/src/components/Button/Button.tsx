"use client";

import { resolveProps } from "@/responsive/utils/resolveProps";
import { useResponsiveProp } from "@/responsive/hooks/useResponsive";
import styles from "./Button.module.scss";
import {
  type ChildrenComponentWithClassNameProps,
  type ButtonAsAnchorProps,
  type ButtonAsButtonProps,
  type ButtonAsNextLinkProps,
} from "./Button.types";
import { BUTTON_SIZES, BUTTON_VARIANTS } from "./button.constants";
import { Base } from "../Base/Base";
import Link from "next/link";
import clsx from "clsx";
import { Tooltip } from "../Tooltip";
import React from "react";
import { usePathname } from "next/navigation";

function ChildrenComponentWithClassName(props: ChildrenComponentWithClassNameProps) {
  const { children, className } = props;

  return React.cloneElement(children as React.ReactElement<HTMLElement>, {
    className: clsx(className, (children as React.ReactElement<HTMLElement>).props.className),
  });
}

function getButtonClassName(props: {
  size: (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES];
  variant: (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];
  disabled?: boolean;
  isCurrentPage?: boolean;
}) {
  const { disabled, variant, size, isCurrentPage = false } = props;

  return clsx(styles.button, {
    [styles.button__disabled]: disabled,
    [styles.button__outlined]: variant === BUTTON_VARIANTS.OUTLINED,
    [styles.button__size_default]: size === BUTTON_SIZES.DEFAULT,
    [styles.button__size_large]: size === BUTTON_SIZES.LARGE,
    [styles.button__current]: isCurrentPage,
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
          {!!StartIconSlot && (
            <ChildrenComponentWithClassName className={styles.button_icon}>
              {StartIconSlot}
            </ChildrenComponentWithClassName>
          )}

          {children}
          {!!EndIconSlot && (
            <ChildrenComponentWithClassName className={styles.button_icon}>
              {EndIconSlot}
            </ChildrenComponentWithClassName>
          )}
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
          {!!StartIconSlot && (
            <ChildrenComponentWithClassName className={styles.button_icon}>
              {StartIconSlot}
            </ChildrenComponentWithClassName>
          )}
          {children}
          {!!EndIconSlot && (
            <ChildrenComponentWithClassName className={styles.button_icon}>
              {EndIconSlot}
            </ChildrenComponentWithClassName>
          )}
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
  const path = usePathname();

  const isCurrentPage = path === linkProps.href;

  return (
    <Tooltip
      title={tooltipTitle}
      description={tooltipDescription}
      placement={tooltipPlacement}
      offset={tooltipOffset}
    >
      <Base
        {...stylesProps}
        asChild
        className={getButtonClassName({ disabled, variant, size, isCurrentPage })}
      >
        <Link {...linkProps}>
          {!!StartIconSlot && (
            <ChildrenComponentWithClassName className={styles.button_icon}>
              {StartIconSlot}
            </ChildrenComponentWithClassName>
          )}
          {children}
          {!!EndIconSlot && (
            <ChildrenComponentWithClassName className={styles.button_icon}>
              {EndIconSlot}
            </ChildrenComponentWithClassName>
          )}
        </Link>
      </Base>
    </Tooltip>
  );
}
