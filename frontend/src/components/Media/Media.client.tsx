"use client";

import { useIsLightMode } from "@/hooks/useIsLightMode";
import { useAdvancedMedia } from "@/responsive/hooks/useMedia";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";
import { MEDIA_CONDITION } from "./Media.constants";
import { type MediaProps } from "./Media.types";

function MediaThemeConditionClient(props: MediaProps) {
  const { children, Fallback, forDarkMode } = props as MediaProps & {
    variant: typeof MEDIA_CONDITION.THEME;
  };

  const isDarkMode = !useIsLightMode();
  const shouldRenderChildren = forDarkMode ? isDarkMode : !isDarkMode;

  return shouldRenderChildren ? children : Fallback;
}

function MediaBreakpointsConditionClient(props: MediaProps) {
  const { children, Fallback, condition } = props as MediaProps & {
    variant: typeof MEDIA_CONDITION.BREAKPOINTS;
  };

  const { matches, currentBreakpoint } = useAdvancedMedia();

  if (currentBreakpoint > BREAKPOINTS_KEYS.xxl && condition?.[`${currentBreakpoint}`]) {
    return <>{children}</>;
  }

  switch (true) {
    case condition.xxl && matches.xxl:
    case condition.xl && matches.xl:
    case condition.lg && matches.lg:
    case condition.md && matches.md:
    case condition.sm && matches.sm:
      return <>{children}</>;
    default:
      return <>{Fallback}</>;
  }
}

export function MediaClient(props: MediaProps) {
  switch (props.variant) {
    case MEDIA_CONDITION.BREAKPOINTS:
      return <MediaBreakpointsConditionClient {...props} />;
    case MEDIA_CONDITION.THEME:
      return <MediaThemeConditionClient {...props} />;
    default:
      return null;
  }
}
