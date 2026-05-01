"use client";

import { BREAKPOINTS_KEYS } from "../responsive.constants";
import { type ResponsiveValue } from "../responsive.types";
import { useAdvancedMedia } from "./useMedia";

type BreakpointKey = keyof typeof BREAKPOINTS_KEYS;
type ResponsiveObject<T> = Extract<ResponsiveValue<T>, { default: T }>;

const breakpointKeys = Object.keys(BREAKPOINTS_KEYS) as BreakpointKey[];

export function useResponsiveProp<T>(prop: ResponsiveValue<T>): T {
  const { currentBreakpoint } = useAdvancedMedia();

  if (!prop || typeof prop !== "object" || !("default" in prop)) {
    return prop;
  }

  const responsiveProp = prop as ResponsiveObject<T>;
  const responsiveMap = responsiveProp as { default: T } & Partial<Record<string, T>>;

  const namedCandidates = breakpointKeys
    .filter((key) => key in responsiveProp)
    .map((key) => ({
      key,
      minWidth: BREAKPOINTS_KEYS[key],
      value: responsiveMap[key] as T,
    }));

  const numericCandidates = Object.keys(responsiveProp)
    .filter((key) => key !== "default" && !(key in BREAKPOINTS_KEYS))
    .map((key) => ({
      minWidth: Number(key),
      value: responsiveMap[key] as T,
    }))
    .filter((candidate) => Number.isFinite(candidate.minWidth));

  const matchedCandidate = [...namedCandidates, ...numericCandidates]
    .filter((candidate) => candidate.minWidth <= currentBreakpoint)
    .sort((previous, next) => next.minWidth - previous.minWidth)[0];

  if (matchedCandidate) {
    return matchedCandidate.value;
  }

  return responsiveProp.default;
}
