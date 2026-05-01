import { type ResponsiveValue } from "../responsive.types";
import { BREAKPOINTS_KEYS } from "../responsive.constants";
import { hashDescriptor } from "../../utils/hashString";
import { type GroupedProps, type ResolvedByBreakpoint } from "./createStylesHash.types";

type StylePropsInput = Record<string, ResponsiveValue<unknown>>[] | Record<string, unknown>;

type StyleSheetResult = {
  cssText: string;
  hash: string;
};

const STYLE_CLASS_PREFIX = "rb-";

function normalizeStylePropsInput(
  props: StylePropsInput
): Record<string, ResponsiveValue<unknown>>[] {
  return Array.isArray(props) ? props : [props as Record<string, ResponsiveValue<unknown>>];
}

function expandStyleAliases(
  styleKey: string,
  value: ResponsiveValue<unknown>
): Array<[string, ResponsiveValue<unknown>]> {
  if (styleKey === "marginX")
    return [
      ["marginLeft", value],
      ["marginRight", value],
    ];
  if (styleKey === "marginY")
    return [
      ["marginTop", value],
      ["marginBottom", value],
    ];
  if (styleKey === "paddingX")
    return [
      ["paddingLeft", value],
      ["paddingRight", value],
    ];
  if (styleKey === "paddingY")
    return [
      ["paddingTop", value],
      ["paddingBottom", value],
    ];
  if (styleKey === "insetX")
    return [
      ["left", value],
      ["right", value],
    ];
  if (styleKey === "insetY")
    return [
      ["top", value],
      ["bottom", value],
    ];
  if (styleKey === "spacing") return [["gap", value]];

  return [[styleKey, value]];
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function getBreakpointWidth(breakpointKey: string): number {
  if (breakpointKey in BREAKPOINTS_KEYS) {
    return BREAKPOINTS_KEYS[breakpointKey as keyof typeof BREAKPOINTS_KEYS];
  }

  const numericWidth = Number(breakpointKey);
  if (Number.isFinite(numericWidth)) {
    return numericWidth;
  }

  return Number.MAX_SAFE_INTEGER;
}

function toMediaQuery(breakpointKey: string): string {
  const width = getBreakpointWidth(breakpointKey);

  if (width === Number.MAX_SAFE_INTEGER) {
    return `@media ${breakpointKey}`;
  }

  return `@media screen and (min-width: ${width}px)`;
}

function toCssValue(value: unknown): string {
  if (typeof value === "number") {
    return `${value}`;
  }

  return String(value);
}

function resolveFinalValuesByBreakpoint(groupedProps: GroupedProps): ResolvedByBreakpoint {
  const resolved: ResolvedByBreakpoint = {};

  for (const [styleKey, breakpoints] of Object.entries(groupedProps)) {
    for (const [breakpointKey, values] of Object.entries(breakpoints)) {
      const finalValue = values[values.length - 1];

      if (finalValue === undefined) {
        continue;
      }

      if (!resolved[breakpointKey]) {
        resolved[breakpointKey] = {};
      }

      resolved[breakpointKey][styleKey] = finalValue;
    }
  }

  return resolved;
}

function groupPropByBreakpoints(props: Record<string, ResponsiveValue<unknown>>[]): GroupedProps {
  const result: GroupedProps = {};

  for (const prop of props) {
    if (prop === null || prop === undefined) {
      continue;
    }

    for (const [styleKey, responsiveValue] of Object.entries(prop)) {
      for (const [expandedStyleKey, expandedValue] of expandStyleAliases(
        styleKey,
        responsiveValue
      )) {
        if (!result[expandedStyleKey]) {
          result[expandedStyleKey] = { default: [] };
        }

        const styleBreakpoints = result[expandedStyleKey];

        if (expandedValue === null || expandedValue === undefined) {
          continue;
        }

        if (typeof expandedValue !== "object") {
          styleBreakpoints.default.push(expandedValue);
          continue;
        }

        if ("default" in expandedValue) {
          styleBreakpoints.default.push(expandedValue.default);
        }

        for (const [breakpointKey, value] of Object.entries(expandedValue)) {
          if (breakpointKey === "default") {
            continue;
          }

          if (!styleBreakpoints[breakpointKey]) {
            styleBreakpoints[breakpointKey] = [];
          }

          styleBreakpoints[breakpointKey].push(value);
        }
      }
    }
  }

  return result;
}

function createStyleDescriptor(groupedProps: ReturnType<typeof groupPropByBreakpoints>) {
  const resolvedByBreakpoint = resolveFinalValuesByBreakpoint(groupedProps);

  const defaultDeclarations = Object.entries(resolvedByBreakpoint.default || {})
    .sort(([previousKey], [nextKey]) => previousKey.localeCompare(nextKey))
    .map(([styleKey, value]) => [toKebabCase(styleKey), toCssValue(value)] as [string, string]);

  const media = Object.keys(resolvedByBreakpoint)
    .filter((breakpointKey) => breakpointKey !== "default")
    .sort((previous, next) => {
      const widthDelta = getBreakpointWidth(previous) - getBreakpointWidth(next);
      if (widthDelta !== 0) {
        return widthDelta;
      }

      return previous.localeCompare(next);
    })
    .map((breakpointKey) => ({
      media: toMediaQuery(breakpointKey),
      declarations: Object.entries(resolvedByBreakpoint[breakpointKey])
        .sort(([previousKey], [nextKey]) => previousKey.localeCompare(nextKey))
        .map(([styleKey, value]) => [toKebabCase(styleKey), toCssValue(value)] as [string, string]),
    }));

  return {
    default: defaultDeclarations,
    media,
  };
}

function createRuleBlock(selector: string, declarations: Array<[string, string]>): string {
  if (declarations.length === 0) {
    return "";
  }

  const body = declarations.map(([property, value]) => `  ${property}: ${value};`).join("\n");

  return `${selector} {\n${body}\n}`;
}

function createStyleCssText(
  hash: string,
  descriptor: ReturnType<typeof createStyleDescriptor>
): string {
  const selector = `.${hash}`;
  const chunks: string[] = [];

  const defaultBlock = createRuleBlock(selector, descriptor.default);
  if (defaultBlock) {
    chunks.push(defaultBlock);
  }

  for (const mediaEntry of descriptor.media) {
    const mediaBlock = createRuleBlock(selector, mediaEntry.declarations);
    if (!mediaBlock) {
      continue;
    }

    chunks.push(`${mediaEntry.media} {\n${mediaBlock}\n}`);
  }

  return chunks.join("\n\n");
}

export function createStyleSheet(props: StylePropsInput): StyleSheetResult {
  const groupedProps = groupPropByBreakpoints(normalizeStylePropsInput(props));
  const descriptor = createStyleDescriptor(groupedProps);
  const hash = `${STYLE_CLASS_PREFIX}${hashDescriptor(descriptor)}`;
  const cssText = createStyleCssText(hash, descriptor);

  return { hash, cssText };
}

export function createStylesHash(props: StylePropsInput): string {
  return createStyleSheet(props).hash;
}
