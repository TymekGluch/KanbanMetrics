import type { BREAKPOINTS_KEYS } from "../responsive.constants";

type BreakpointKey = keyof typeof BREAKPOINTS_KEYS;
type MatchBreakpoint = Record<BreakpointKey, boolean>;

export function parseUABreakpoint(ua: string): MatchBreakpoint {
  const lower = ua.toLowerCase();

  const isMobile =
    /android.*(mobile)|iphone|ipod|blackberry|iemobile|opera mini|mobile safari/.test(lower);
  const isTablet = !isMobile && /(ipad|android|tablet|kindle|silk|playbook)/.test(lower);

  if (isMobile) {
    return { sm: true, md: false, lg: false, xl: false, xxl: false };
  }

  if (isTablet) {
    return { sm: true, md: true, lg: false, xl: false, xxl: false };
  }

  return { sm: true, md: true, lg: true, xl: false, xxl: false };
}
