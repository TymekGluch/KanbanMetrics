import { type MediaBreakpointsCondition } from "./Media.types";

type DisplayValue = "block" | "none";

export function inferBasePropsFromMediaCondition(
  mediaCondition: MediaBreakpointsCondition["condition"]
) {
  const fallbackBaseProps = Object.entries(mediaCondition).reduce<Record<string, DisplayValue>>(
    (accumulator, [breakpoint, condition]) => {
      accumulator[breakpoint] = condition ? "block" : "none";

      return accumulator;
    },
    {}
  );

  const defaultBaseProps = Object.entries(mediaCondition).reduce<Record<string, DisplayValue>>(
    (accumulator, [breakpoint, condition]) => {
      accumulator[breakpoint] = condition ? "none" : "block";

      return accumulator;
    },
    {}
  );

  return {
    fallbackBaseProps,
    defaultBaseProps,
  };
}
