import React from "react";

export type SlotAwareType = {
  $$slot?: string;
};

export type ClientReferenceTuple = readonly [unknown, unknown, string];

export type LazyLike = {
  _payload?: {
    value?: unknown;
  };
};

export type MemoLike = {
  type?: unknown;
};

export type SlotAwareComponent<Props = object> = React.ComponentType<Props> & SlotAwareType;

export interface SlotMatcherOptions {
  slot: string;
  exportNames?: readonly string[];
}

function isMemoLike(value: unknown): value is MemoLike {
  return typeof value === "object" && value !== null && "type" in value;
}

function isLazyLike(value: unknown): value is LazyLike {
  return typeof value === "object" && value !== null && "_payload" in value;
}

function isClientReferenceTuple(value: unknown): value is ClientReferenceTuple {
  return Array.isArray(value) && value.length >= 3 && typeof value[value.length - 1] === "string";
}

export function unwrapElementType(type: unknown): unknown {
  if (isMemoLike(type) && type.type) {
    return unwrapElementType(type.type);
  }

  if (isLazyLike(type) && type._payload?.value) {
    return unwrapElementType(type._payload.value);
  }

  return type;
}

export function isSlotType(type: unknown, options: SlotMatcherOptions): boolean {
  const { slot, exportNames = [] } = options;

  if (typeof type === "function") {
    return (type as SlotAwareType).$$slot === slot;
  }

  if (isClientReferenceTuple(type)) {
    const exportName = type[type.length - 1];
    return exportNames.includes(exportName as string);
  }

  if (typeof type === "object" && type !== null) {
    return (type as SlotAwareType).$$slot === slot;
  }

  return false;
}

export function isSlotChild(
  child: React.ReactNode,
  options: SlotMatcherOptions
): child is React.ReactElement<React.PropsWithChildren> {
  if (!React.isValidElement(child)) {
    return false;
  }

  return isSlotType(unwrapElementType(child.type), options);
}

export function markSlotComponent<Props>(component: React.ComponentType<Props>, slot: string) {
  (component as SlotAwareComponent<Props>).$$slot = slot;
  return component as SlotAwareComponent<Props>;
}
