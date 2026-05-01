"use client";

import { resolveProps } from "@/responsive/utils/resolveProps";
import {
  type LinkAsButtonProps,
  type LinkAsAnchorProps,
  type LinkAsNextLinkProps,
} from "./Link.types";
import { Base } from "../Base/Base";
import styles from "./Link.module.scss";
import Link from "next/link";
import clsx from "clsx";

export function LinkAsAnchor(props: LinkAsAnchorProps) {
  const { stylesProps, rest } = resolveProps<LinkAsAnchorProps>(props);
  const {
    children,
    isInherits = false,
    StartIconSlot = null,
    EndIconSlot = null,
    disabled = false,
    ...anchorProps
  } = rest;

  return (
    <Base
      {...stylesProps}
      className={clsx(styles.link, {
        [styles.link__Inherit]: isInherits,
        [styles.link__Disabled]: disabled,
      })}
      asChild
    >
      <a {...anchorProps}>
        {!!StartIconSlot && <span className={styles.link_icon}>{StartIconSlot}</span>}
        {children}
        {!!EndIconSlot && <span className={styles.link_icon}>{EndIconSlot}</span>}
      </a>
    </Base>
  );
}

export function LinkAsButton(props: LinkAsButtonProps) {
  const { stylesProps, rest } = resolveProps<LinkAsButtonProps>(props);
  const {
    children,
    isInherits = false,
    StartIconSlot = null,
    EndIconSlot = null,
    disabled = false,
    ...buttonProps
  } = rest;

  return (
    <Base
      {...stylesProps}
      className={clsx(styles.link, {
        [styles.link__Inherit]: isInherits,
        [styles.link__Disabled]: disabled,
      })}
      asChild
    >
      <button {...buttonProps} disabled={disabled}>
        {!!StartIconSlot && <span className={styles.link_icon}>{StartIconSlot}</span>}
        {children}
        {!!EndIconSlot && <span className={styles.link_icon}>{EndIconSlot}</span>}
      </button>
    </Base>
  );
}

export function LinkAsNextLink(props: LinkAsNextLinkProps) {
  const { stylesProps, rest } = resolveProps<LinkAsNextLinkProps>(props);
  const {
    children,
    isInherits = false,
    StartIconSlot = null,
    EndIconSlot = null,
    disabled = false,
    ...nextLinkProps
  } = rest;

  return (
    <Base
      {...stylesProps}
      className={clsx(styles.link, {
        [styles.link__Inherit]: isInherits,
        [styles.link__Disabled]: disabled,
      })}
      asChild
    >
      <Link {...nextLinkProps}>
        {!!StartIconSlot && <span className={styles.link_icon}>{StartIconSlot}</span>}
        {children}
        {!!EndIconSlot && <span className={styles.link_icon}>{EndIconSlot}</span>}
      </Link>
    </Base>
  );
}
