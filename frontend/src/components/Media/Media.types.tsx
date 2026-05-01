import { type MEDIA_CONDITION } from "./Media.constants";
import { type BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";

type BreakPointsKeys = keyof typeof BREAKPOINTS_KEYS | `${number}`;

interface MediaThemeCondition {
  variant: typeof MEDIA_CONDITION.THEME;
  forDarkMode?: boolean;
}

export interface MediaBreakpointsCondition {
  variant: typeof MEDIA_CONDITION.BREAKPOINTS;
  condition: Record<BreakPointsKeys, boolean>;
}

type MediaCondition = MediaThemeCondition | MediaBreakpointsCondition;

export type MediaProps = React.PropsWithChildren<{
  Fallback?: React.ReactNode;
}> &
  MediaCondition;
