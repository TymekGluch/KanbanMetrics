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

export type LinkAsAnchorProps = React.ComponentPropsWithRef<"a"> &
  LinkStylesProps &
  LinkCommonProps;

export type LinkAsButtonProps = React.ComponentPropsWithRef<"button"> &
  LinkStylesProps &
  LinkCommonProps;

export type LinkAsNextLinkProps = React.ComponentPropsWithRef<typeof Link> &
  LinkStylesProps &
  LinkCommonProps;
