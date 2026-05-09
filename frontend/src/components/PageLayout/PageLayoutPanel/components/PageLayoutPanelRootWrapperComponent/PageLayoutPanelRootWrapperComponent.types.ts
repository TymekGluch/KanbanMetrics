import type React from "react";

export interface PageLayoutPanelRootWrapperComponentProps extends React.PropsWithChildren {
  as?: React.HTMLElementType;
  className?: React.HtmlHTMLAttributes<HTMLDivElement>["className"];
}
