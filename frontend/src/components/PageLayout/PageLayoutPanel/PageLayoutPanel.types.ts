import { type ValueOf } from "@/types/valueOf";
import type React from "react";
import { type PAGE_LAYOUT_PANEL_CONTENT_ALIGNMENT } from "./PageLayoutPanel.constants";
import { type ResponsiveValue } from "@/responsive/responsive.types";
import type { LayoutContextValue } from "./context/LayoutContext.types";

export type PageLayoutPanelProviderProps = React.PropsWithChildren<{
  initialValue?: LayoutContextValue;
}>;

export interface PageLayoutPanelRootProps extends React.PropsWithChildren {
  as?: React.HTMLElementType;
}

export interface NavigationContentComponentProps extends React.PropsWithChildren {
  alignment?: ResponsiveValue<ValueOf<typeof PAGE_LAYOUT_PANEL_CONTENT_ALIGNMENT>>;
}
