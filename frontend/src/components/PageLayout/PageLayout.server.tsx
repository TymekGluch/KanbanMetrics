import { PAGE_LAYOUT_VARIANTS } from "./PageLayout.constants";
import { PageLayoutProps } from "./PageLayout.types";

export function PageLayout(props: PageLayoutProps) {
  const { variant, children } = props;

  switch (variant) {
    case PAGE_LAYOUT_VARIANTS.DEFAULT:
      return <div>{children}</div>;
    default: 
      return null;
  }  
}