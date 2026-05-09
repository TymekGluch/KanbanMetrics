import {
  type BaseStyleGroups,
  type ResponsiveStyleProps,
} from "@/responsive/responsiveStyleProps.types";
import type React from "react";

export type BaseAs = React.ElementType;

export type BaseBaseProps<T extends BaseAs = "div"> = React.PropsWithChildren &
  Omit<React.ComponentPropsWithRef<T>, "style" | "translate" | keyof ResponsiveStyleProps> &
  BaseStyleGroups & {
    as?: T;
    asChild?: boolean;
    className?: string;
  };

export type BaseProps<T extends BaseAs = "div"> = BaseBaseProps<T>;
