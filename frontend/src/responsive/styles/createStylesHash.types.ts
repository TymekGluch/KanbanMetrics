type StyleKey = string;
type BreakpointKey = string;

export type GroupedProps = Record<StyleKey, Record<BreakpointKey, unknown[]>>;
export type ResolvedByBreakpoint = Record<BreakpointKey, Record<StyleKey, unknown>>;
