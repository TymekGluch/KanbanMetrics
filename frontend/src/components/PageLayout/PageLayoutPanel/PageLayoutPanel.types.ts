import type React from "react";

export type PageLayoutPanelProviderProps = React.PropsWithChildren;

export interface PageLayoutPanelRootProps extends React.PropsWithChildren {
  As?: React.HTMLElementType;
}
