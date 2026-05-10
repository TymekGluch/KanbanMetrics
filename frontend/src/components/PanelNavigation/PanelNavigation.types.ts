import type React from "react";
import type Button from "../Button";
import { type PANEL_NAVIGATION_BUTTON } from "./PanelNavigation.constants";

export interface ButtonConditionProp extends Omit<
  React.ComponentProps<typeof Button.AsButton>,
  "children"
> {
  polymorphicVariant: typeof PANEL_NAVIGATION_BUTTON.BUTTON;
}

export interface NextLinkConditionProp extends Omit<
  React.ComponentProps<typeof Button.AsLink>,
  "children"
> {
  polymorphicVariant: typeof PANEL_NAVIGATION_BUTTON.NEXT_LINK;
}

type conditionalProps = ButtonConditionProp | NextLinkConditionProp;

type IconType = React.ReactElement<{
  className?: React.HTMLAttributes<HTMLElement>["className"];
}>;

export interface PanelButtonProps extends React.PropsWithChildren {
  polymorphicButtonProps: conditionalProps;
  StartIconSlot: IconType;
  text: string;
}
