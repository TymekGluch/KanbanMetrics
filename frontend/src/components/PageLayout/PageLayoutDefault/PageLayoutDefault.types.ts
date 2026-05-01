import type React from "react";

export type PageLayoutDefaultRootProps = React.PropsWithChildren;

export interface PageLayoutDefaultNavigationProps extends React.PropsWithChildren {
  withBreadcrumbs?: boolean;
  BreadcrumbsSlot?: React.ReactNode;
}
