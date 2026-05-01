import { BREAKPOINTS_KEYS } from "./responsive.constants";

type ResponsiveBreakpointKey = keyof typeof BREAKPOINTS_KEYS;
type CustomBreakpointKey = `${number}`;

type RecordWithDefault<T> = {
  default : T;
} & Partial<Record<ResponsiveBreakpointKey | CustomBreakpointKey, T>>

export type ResponsiveValue<T> = T | RecordWithDefault<T>;

export type WithResponsiveValues<T extends object> = {
  [Key in keyof T]?: ResponsiveValue<NonNullable<T[Key]>>;
};