"use client";

import React from "react";
import type { BREAKPOINTS_KEYS } from "./responsive.constants";

type BreakpointKey = keyof typeof BREAKPOINTS_KEYS;
export type MatchBreakpoint = Record<BreakpointKey, boolean>;

interface ResponsiveContextValue {
  ssrBreakpoint: MatchBreakpoint;
}

export const ResponsiveContext = React.createContext<ResponsiveContextValue>({
  ssrBreakpoint: { sm: false, md: false, lg: false, xl: false, xxl: false },
});

interface ResponsiveProviderProps {
  ssrBreakpoint: MatchBreakpoint;
  children: React.ReactNode;
}

export function ResponsiveProvider(props: ResponsiveProviderProps) {
  const { ssrBreakpoint, children } = props;

  return (
    <ResponsiveContext.Provider value={{ ssrBreakpoint }}>{children}</ResponsiveContext.Provider>
  );
}
