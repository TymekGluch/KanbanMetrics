import { type ValueOf } from "@/types/valueOf";
import type React from "react";
import { type PAGE_LAYOUT_CONTENT_ALIGN } from "./PageLayoutDefault.constants";

export type PageLayoutDefaultRootProps = React.PropsWithChildren;

export interface PageLayoutDefaultNavigationProps extends React.PropsWithChildren {
  withBreadcrumbs?: boolean;
  BreadcrumbsSlot?: React.ReactNode;
}

export interface PageLayoutDefaultContentProps extends React.PropsWithChildren {
  align?: ValueOf<typeof PAGE_LAYOUT_CONTENT_ALIGN>;
}

export interface PageLayoutDefaultFilledContentProps extends React.PropsWithChildren {
  align?: ValueOf<typeof PAGE_LAYOUT_CONTENT_ALIGN>;
  FooterSlot?: React.ReactNode;
}
