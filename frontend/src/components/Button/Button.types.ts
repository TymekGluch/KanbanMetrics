import {
  type BaseBackgroundProps,
  type BaseMarginProps,
  type BasePaddingProps,
  type BasePositionProps,
  type BaseSizeProps,
  type BaseTypographyProps,
} from "@/responsive/responsiveStyleProps.types";
import type { ResponsiveValue } from "@/responsive/responsive.types";
import { type ValueOf } from "@/types/valueOf";
import type Link from "next/link";
import { type BUTTON_SIZES, type BUTTON_VARIANTS } from "./button.constants";

type ButtonSizeProps = Pick<BaseSizeProps, "width" | "minWidth">;

type ButtonStylesProps = ButtonSizeProps &
  BaseMarginProps &
  BasePaddingProps &
  BaseBackgroundProps &
  BaseTypographyProps &
  BasePositionProps;

interface ButtonCommonProps {
  variant?: ValueOf<typeof BUTTON_VARIANTS>;
  size?: ResponsiveValue<ValueOf<typeof BUTTON_SIZES>>;
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
