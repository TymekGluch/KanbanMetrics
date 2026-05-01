import { ValueOf } from "@/types/valueOf";
import { BaseStyleGroups } from "@/responsive/responsiveStyleProps.types";
import React from "react";
import { BASE_AS } from "./Base.constants";

export type BaseAs = ValueOf<typeof BASE_AS>

export type BaseBaseProps<T extends BaseAs = 'div'> = React.PropsWithChildren & Omit<React.ComponentPropsWithRef<T>, "style" | keyof BaseStyleGroups> & BaseStyleGroups & {
  as?: T
  className?: string;
}

export type BaseProps<T extends BaseAs = 'div'> = BaseBaseProps<T>;