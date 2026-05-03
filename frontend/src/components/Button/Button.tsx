import { resolveProps } from "@/responsive/utils/resolveProps";
import styles from "./Button.module.scss";
import {
  type ButtonAsAnchorProps,
  type ButtonAsButtonProps,
  type ButtonAsNextLinkProps,
} from "./Button.types";
import { Base } from "../Base/Base";
import Link from "next/link";
import clsx from "clsx";

export function AsButtonComponent(props: ButtonAsButtonProps) {
  const { stylesProps, rest } = resolveProps(props);
  const { children, disabled, ...buttonProps } = rest;

  return (
    <Base
      {...stylesProps}
      asChild
      className={clsx(styles.button, {
        [styles.button__disabled]: disabled,
      })}
    >
      <button {...buttonProps} disabled={disabled}>
        {children}
      </button>
    </Base>
  );
}

export function AsAnchorComponent(props: ButtonAsAnchorProps) {
  const { stylesProps, rest } = resolveProps(props);
  const { children, disabled, ...anchorProps } = rest;
  return (
    <Base
      {...stylesProps}
      asChild
      className={clsx(styles.button, {
        [styles.button__disabled]: disabled,
      })}
    >
      <a {...anchorProps}>{children}</a>
    </Base>
  );
}

export function AsNextLinkComponent(props: ButtonAsNextLinkProps) {
  const { stylesProps, rest } = resolveProps(props);
  const { children, disabled, ...linkProps } = rest;

  return (
    <Base
      {...stylesProps}
      asChild
      className={clsx(styles.button, {
        [styles.button__disabled]: disabled,
      })}
    >
      <Link {...linkProps}>{children}</Link>
    </Base>
  );
}
