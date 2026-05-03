import { resolveProps } from "@/responsive/utils/resolveProps";
import styles from "./Button.module.scss";
import {
  type ButtonAsAnchorProps,
  type ButtonAsButtonProps,
  type ButtonAsNextLinkProps,
} from "./Button.types";
import { BUTTON_VARIANTS } from "./button.constants";
import { Base } from "../Base/Base";
import Link from "next/link";
import clsx from "clsx";

export function AsButtonComponent(props: ButtonAsButtonProps) {
  const { stylesProps, rest } = resolveProps(props);
  const {
    children,
    disabled,
    variant = BUTTON_VARIANTS.PRIMARY,
    StartIconSlot,
    EndIconSlot,
    ...buttonProps
  } = rest;

  return (
    <Base
      {...stylesProps}
      asChild
      className={clsx(styles.button, {
        [styles.button__disabled]: disabled,
        [styles.button__outlined]: variant === BUTTON_VARIANTS.OUTLINED,
      })}
    >
      <button {...buttonProps} disabled={disabled}>
        {!!StartIconSlot && <span className={styles.button_icon}>{StartIconSlot}</span>}

        {children}
        {!!EndIconSlot && <span className={styles.button_icon}>{EndIconSlot}</span>}
      </button>
    </Base>
  );
}

export function AsAnchorComponent(props: ButtonAsAnchorProps) {
  const { stylesProps, rest } = resolveProps(props);
  const {
    children,
    disabled,
    variant = BUTTON_VARIANTS.PRIMARY,
    StartIconSlot,
    EndIconSlot,
    ...anchorProps
  } = rest;
  return (
    <Base
      {...stylesProps}
      asChild
      className={clsx(styles.button, {
        [styles.button__disabled]: disabled,
        [styles.button__outlined]: variant === BUTTON_VARIANTS.OUTLINED,
      })}
    >
      <a {...anchorProps}>
        {!!StartIconSlot && <span className={styles.button_icon}>{StartIconSlot}</span>}
        {children}
        {!!EndIconSlot && <span className={styles.button_icon}>{EndIconSlot}</span>}
      </a>
    </Base>
  );
}

export function AsNextLinkComponent(props: ButtonAsNextLinkProps) {
  const { stylesProps, rest } = resolveProps(props);
  const {
    children,
    disabled,
    variant = BUTTON_VARIANTS.PRIMARY,
    StartIconSlot,
    EndIconSlot,
    ...linkProps
  } = rest;

  return (
    <Base
      {...stylesProps}
      asChild
      className={clsx(styles.button, {
        [styles.button__disabled]: disabled,
        [styles.button__outlined]: variant === BUTTON_VARIANTS.OUTLINED,
      })}
    >
      <Link {...linkProps}>
        {!!StartIconSlot && <span className={styles.button_icon}>{StartIconSlot}</span>}
        {children}
        {!!EndIconSlot && <span className={styles.button_icon}>{EndIconSlot}</span>}
      </Link>
    </Base>
  );
}
