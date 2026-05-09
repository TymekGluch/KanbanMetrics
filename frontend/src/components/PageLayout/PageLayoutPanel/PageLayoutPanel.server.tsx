import { getPageLayoutPanelSpaces } from "@/actions/pageLayoutPanel";
import { pageLayoutPanelContextDefaultSpaces } from "./context/LayoutContext";
import { ProviderComponent } from "./PageLayoutPanel.client";

import type { PageLayoutPanelProviderProps } from "./PageLayoutPanel.types";

export async function ProviderComponentServer(props: PageLayoutPanelProviderProps) {
  const { children } = props;

  const storedSpaces = await getPageLayoutPanelSpaces();
  const initialValue = storedSpaces || pageLayoutPanelContextDefaultSpaces;

  return <ProviderComponent initialValue={initialValue}>{children}</ProviderComponent>;
}
