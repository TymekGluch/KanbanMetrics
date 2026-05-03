import {
  type BaseBackgroundProps,
  type BaseMarginProps,
  type BasePaddingProps,
  type BasePositionProps,
  type BaseSizeProps,
  type BaseTypographyProps,
} from "@/responsive/responsiveStyleProps.types";
import type Link from "next/link";

type ButtonSizeProps = Pick<BaseSizeProps, "width" | "minWidth">;

type ButtonStylesProps = ButtonSizeProps &
  BaseMarginProps &
  BasePaddingProps &
  BaseBackgroundProps &
  BaseTypographyProps &
  BasePositionProps;

interface ButtonCommonProps {
  disabled?: boolean;
  StartIconSlot?: React.ReactNode;
  EndIconSlot?: React.ReactNode;
}

export type ButtonAsAnchorProps = React.ComponentPropsWithRef<"a"> &
  ButtonStylesProps &
  ButtonCommonProps;

export type ButtonAsButtonProps = React.ComponentPropsWithRef<"button"> &
  ButtonStylesProps &
  ButtonCommonProps;

export type ButtonAsNextLinkProps = React.ComponentPropsWithRef<typeof Link> &
  ButtonStylesProps &
  ButtonCommonProps;
