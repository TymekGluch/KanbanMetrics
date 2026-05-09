import {
  type BaseBackgroundProps,
  type BaseMarginProps,
  type BasePaddingProps,
  type BasePositionProps,
  type BaseSizeProps,
  type BaseTypographyProps,
} from "@/responsive/responsiveStyleProps.types";
import { type ValueOf } from "@/types/valueOf";
import { type DIALOG_SIZES } from "./dialog.constants";
import type React from "react";

type DialogSizeProps = Pick<BaseSizeProps, "width" | "minWidth" | "maxWidth">;

type DialogStylesProps = DialogSizeProps &
  BaseMarginProps &
  BasePaddingProps &
  BaseBackgroundProps &
  BaseTypographyProps &
  BasePositionProps;

export interface DialogRootProps extends React.PropsWithChildren {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
}

export type DialogTriggerProps = React.ComponentPropsWithRef<"button"> & DialogStylesProps;

export type DialogOverlayProps = React.ComponentPropsWithRef<"div">;

export type DialogContentProps = React.ComponentPropsWithRef<"section"> &
  DialogStylesProps & {
    size?: ValueOf<typeof DIALOG_SIZES>;
  };

export type DialogCloseProps = React.ComponentPropsWithRef<"button"> & DialogStylesProps;

export type DialogSimpleSlotProps = React.ComponentPropsWithRef<"div">;
export type DialogTitleProps = React.ComponentPropsWithRef<"h2">;
export type DialogDescriptionProps = React.ComponentPropsWithRef<"p">;
