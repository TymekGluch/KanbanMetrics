import { getPageLayoutPanelSpaces } from "@/actions/pageLayoutPanel";
import { pageLayoutPanelContextDefaultSpaces, PageLayoutPanelProvider } from "./LayoutContext";
import type { LayoutProviderProps } from "./LayoutContext.types";

export async function PageLayoutPanelProviderServer(props: LayoutProviderProps) {
  const { children } = props;

  const storedSpaces = await getPageLayoutPanelSpaces();
  const initialValue = storedSpaces || pageLayoutPanelContextDefaultSpaces;

  return <PageLayoutPanelProvider initialValue={initialValue}>{children}</PageLayoutPanelProvider>;
}
