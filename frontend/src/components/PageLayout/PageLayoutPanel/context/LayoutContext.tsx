import { useAdvancedMedia } from "@/responsive/hooks/useMedia";
import React from "react";
import {
  type LayoutContextType,
  type LayoutProviderProps,
  type LayoutContextValue,
} from "./LayoutContext.types";
import { inferDefaultSpacesByBreakpoint, isCorrectColumnSpaces } from "./LayoutContext.utils";

const defaultSpaces = {
  navigationSpace: 0,
  contentSpace: 0,
};

export const PageLayoutPanelContext = React.createContext<LayoutContextType | null>(null);

export function PageLayoutPanelProvider(props: LayoutProviderProps) {
  const { children } = props;

  const [layoutSpaces, setLayoutSpaces] = React.useState<LayoutContextValue>(defaultSpaces);

  const { matches, currentBreakpoint } = useAdvancedMedia();

  const resolvedSpaces: LayoutContextValue = React.useMemo(() => {
    if (!isCorrectColumnSpaces(layoutSpaces)) {
      return inferDefaultSpacesByBreakpoint(matches, currentBreakpoint);
    }

    return layoutSpaces;
  }, [layoutSpaces, matches, currentBreakpoint]);

  return (
    <PageLayoutPanelContext.Provider value={{ value: resolvedSpaces, setValue: setLayoutSpaces }}>
      {children}
    </PageLayoutPanelContext.Provider>
  );
}
