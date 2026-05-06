import { type MatchBreakpoint } from "@/responsive/Responsive.Provider";
import { type LayoutContextValue } from "./LayoutContext.types";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";

const sumOfColumnSpaces = 12;

const setColumns = (navigationSpace: number, contentSpace: number): LayoutContextValue => ({
  navigationSpace,
  contentSpace,
});

export function inferDefaultSpacesByBreakpoint(
  matches: MatchBreakpoint,
  currentBreakpoint: number
) {
  const { sm, md, lg, xl, xxl } = matches;

  if (currentBreakpoint > BREAKPOINTS_KEYS.xxl) {
    return setColumns(3, 7);
  }

  switch (true) {
    case xxl:
    case xl:
    case lg:
      return setColumns(3, 7);
    case md:
      return setColumns(2, 10);
    case sm:
    default:
      return setColumns(0, sumOfColumnSpaces);
  }
}

export function isCorrectColumnSpaces(params: LayoutContextValue) {
  const { navigationSpace, contentSpace } = params;

  return navigationSpace + contentSpace === sumOfColumnSpaces;
}
