"use client";

import React from "react";
import {
  type LayoutContextType,
  type LayoutContextValue,
  type LayoutProviderProps,
} from "./LayoutContext.types";
import { pxToRem } from "@/utils/pxToRem";
import { setPageLayoutPanelSpaces } from "@/actions/pageLayoutPanel";

export const pageLayoutPanelContextDefaultSpaces = {
  navigationSpace: pxToRem(80),
  contentSpace: "auto",
};

export const PageLayoutPanelContext = React.createContext<LayoutContextType>({
  value: pageLayoutPanelContextDefaultSpaces,
  setValue: () => {},
  isRestored: false,
});

export function PageLayoutPanelProvider(props: LayoutProviderProps) {
  const { children, initialValue = pageLayoutPanelContextDefaultSpaces } = props;

  const [layoutSpaces, setLayoutSpaces] = React.useState<LayoutContextValue>(initialValue);

  const handleSetLayoutSpaces = React.useCallback(
    (newSpaces: React.SetStateAction<LayoutContextValue>) => {
      setLayoutSpaces((prev) => {
        const updated = typeof newSpaces === "function" ? newSpaces(prev) : newSpaces;
        void setPageLayoutPanelSpaces(updated);
        return updated;
      });
    },
    []
  );

  return (
    <PageLayoutPanelContext.Provider
      value={{ value: layoutSpaces, setValue: handleSetLayoutSpaces, isRestored: true }}
    >
      {children}
    </PageLayoutPanelContext.Provider>
  );
}
