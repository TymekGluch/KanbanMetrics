"use client";

import { type ValueOf } from "@/types/valueOf";
import { BREAKPOINTS_KEYS } from "../responsive.constants";
import React from "react";
import { ResponsiveContext } from "../Responsive.Provider";

export function useMedia(breakpoints: ValueOf<typeof BREAKPOINTS_KEYS>): boolean {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(`(min-width: ${breakpoints}px)`).matches;
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints}px)`);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [breakpoints]);

  return matches;
}

export function useIsMobile(): boolean {
  return !useMedia(BREAKPOINTS_KEYS.lg);
}

type BreakpointKey = keyof typeof BREAKPOINTS_KEYS;
type MatchBreakpoint = Record<BreakpointKey, boolean>;

interface UseAdvancedMediaResult {
  matches: MatchBreakpoint;
  currentBreakpoint: number;
}

export function useAdvancedMedia(): UseAdvancedMediaResult {
  const { ssrBreakpoint } = React.useContext(ResponsiveContext);

  const [matches, setMatches] = React.useState<MatchBreakpoint>(() => {
    const breakpointKeys = Object.keys(BREAKPOINTS_KEYS) as BreakpointKey[];

    if (typeof window === "undefined") {
      return breakpointKeys.reduce<MatchBreakpoint>((accumulator, key) => {
        accumulator[key] = ssrBreakpoint[key];

        return accumulator;
      }, {} as MatchBreakpoint);
    }

    return breakpointKeys.reduce<MatchBreakpoint>((accumulator, key) => {
      const value = BREAKPOINTS_KEYS[key];
      accumulator[key] = window.matchMedia(`(min-width: ${value}px)`).matches;

      return accumulator;
    }, {} as MatchBreakpoint);
  });

  React.useEffect(() => {
    const keys = Object.keys(BREAKPOINTS_KEYS) as BreakpointKey[];

    const mediaQueries = keys.map((key) => {
      const value = BREAKPOINTS_KEYS[key];
      const mediaQuery = window.matchMedia(`(min-width: ${value}px)`);

      const handleChange = (event: MediaQueryListEvent) => {
        setMatches((previousKeys) => ({
          ...previousKeys,
          [key]: event.matches,
        }));
      };

      setMatches((previousKeys) => ({
        ...previousKeys,
        [key]: mediaQuery.matches,
      }));
      mediaQuery.addEventListener("change", handleChange);

      return { key, mediaQuery, handleChange };
    });

    return () => {
      mediaQueries.forEach(({ mediaQuery, handleChange }) => {
        mediaQuery.removeEventListener("change", handleChange);
      });
    };
  }, []);

  const currentBreakpoint = React.useMemo(() => {
    const keys = Object.keys(BREAKPOINTS_KEYS) as BreakpointKey[];

    return keys.reduce((highestMatchedValue, key) => {
      if (!matches[key]) {
        return highestMatchedValue;
      }

      const breakpointValue = BREAKPOINTS_KEYS[key];
      return breakpointValue > highestMatchedValue ? breakpointValue : highestMatchedValue;
    }, 0);
  }, [matches]);

  return { matches, currentBreakpoint };
}
