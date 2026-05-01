import { type ValueOf } from "@/types/valueOf";
import { type PAGE_LAYOUT_VARIANTS } from "./PageLayout.constants";

type PageLayoutVariant = ValueOf<typeof PAGE_LAYOUT_VARIANTS>;

export interface PageLayoutProps extends React.PropsWithChildren {
  variant: PageLayoutVariant;
}
