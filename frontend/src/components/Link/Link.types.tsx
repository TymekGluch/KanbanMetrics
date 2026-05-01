import {
  type BaseBackgroundProps,
  type BaseMarginProps,
  type BasePaddingProps,
  type BasePositionProps,
  type BaseSizeProps,
  type BaseTypographyProps,
} from "@/responsive/responsiveStyleProps.types";
import type Link from "next/link";
import type React from "react";

type OmittedLinkProps = "className";

type LinkSizeProps = Pick<BaseSizeProps, "width" | "minWidth">;

type LinkStylesProps = LinkSizeProps &
  BaseMarginProps &
  BasePaddingProps &
  BaseBackgroundProps &
  BaseTypographyProps &
  BasePositionProps;

interface LinkCommonProps {
  isInherits?: boolean;
  disabled?: boolean;
  StartIconSlot?: React.ReactNode;
  EndIconSlot?: React.ReactNode;
}

export type LinkAsAnchorProps = Omit<React.ComponentPropsWithRef<"a">, OmittedLinkProps> &
  LinkStylesProps &
  LinkCommonProps;

export type LinkAsButtonProps = Omit<React.ComponentPropsWithRef<"button">, OmittedLinkProps> &
  LinkStylesProps &
  LinkCommonProps;

export type LinkAsNextLinkProps = Omit<React.ComponentPropsWithRef<typeof Link>, OmittedLinkProps> &
  LinkStylesProps &
  LinkCommonProps;
