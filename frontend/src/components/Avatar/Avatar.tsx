import clsx from "clsx";
import Image from "next/image";
import React from "react";
import { getAcronym } from "@/utils/getAcronym";
import {
  AVATAR_COLORS,
  AVATAR_SHAPES,
  AVATAR_SIZES,
  AVATAR_STATUS_COLORS,
} from "./Avatar.constants";
import { type AvatarProps, type ResponsiveDimension } from "./Avatar.types";
import styles from "./Avatar.module.scss";

function toCssSize(value?: number | string): string | undefined {
  if (typeof value === "number") {
    return `${value}px`;
  }

  return value;
}

function toResponsiveDimension(
  value: AvatarProps["width"] | AvatarProps["height"]
): ResponsiveDimension | undefined {
  if (typeof value === "undefined") {
    return undefined;
  }

  if (typeof value === "number" || typeof value === "string") {
    return { base: value };
  }

  return value;
}

function renderAvatarIcon(icon: AvatarProps["icon"]) {
  if (!icon || !React.isValidElement(icon)) {
    return null;
  }

  return React.cloneElement(icon, {
    className: clsx(styles.avatar_icon, icon.props.className),
    color: "currentColor",
    fill: "currentColor",
    stroke: "currentColor",
    "aria-hidden": true,
    focusable: false,
  });
}

export function Avatar(props: AvatarProps) {
  const hasExplicitStatusColor = typeof props.statusColor !== "undefined";

  const {
    name,
    src,
    Icon,
    alt,
    shape = AVATAR_SHAPES.ROUND,
    size = AVATAR_SIZES.MD,
    avatarColor = AVATAR_COLORS.VIOLET,
    width,
    height,
    withStatus = false,
    statusColor = AVATAR_STATUS_COLORS.DEFAULT,
    showContrastingBackground = false,
    className,
    contentClassName,
  } = props;

  const resolvedWidth = toResponsiveDimension(width);
  const resolvedHeight = toResponsiveDimension(height);
  const shouldShowStatus = withStatus || hasExplicitStatusColor;

  return (
    <div
      className={clsx(
        styles.avatar,
        styles[`avatar__${shape}`],
        styles[`avatar__${size}`],
        styles[`avatar_color__${avatarColor}`],
        className
      )}
      style={
        {
          "--avatar-width-base": toCssSize(resolvedWidth?.base),
          "--avatar-width-sm": toCssSize(resolvedWidth?.sm),
          "--avatar-width-md": toCssSize(resolvedWidth?.md),
          "--avatar-width-lg": toCssSize(resolvedWidth?.lg),
          "--avatar-height-base": toCssSize(resolvedHeight?.base),
          "--avatar-height-sm": toCssSize(resolvedHeight?.sm),
          "--avatar-height-md": toCssSize(resolvedHeight?.md),
          "--avatar-height-lg": toCssSize(resolvedHeight?.lg),
        } as React.CSSProperties
      }
      role="img"
      aria-label={alt ?? name}
    >
      <div
        className={clsx(
          styles.avatar_content,
          contentClassName,
          showContrastingBackground && styles.avatar_content__contrastingBackground
        )}
      >
        {Icon ? (
          renderAvatarIcon(Icon)
        ) : src ? (
          <Image src={src} alt={alt ?? name} className={styles.avatar_image} fill sizes="100vw" />
        ) : (
          <span aria-hidden="true">{getAcronym(name)}</span>
        )}
      </div>

      {shouldShowStatus ? (
        <span
          className={clsx(styles.avatar_status, styles[`avatar_status__${statusColor}`])}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
