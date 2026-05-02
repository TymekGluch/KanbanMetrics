const remValue = 16;

export function pxToRem(value: string | number): string {
  if (typeof value === "number") {
    return `${value / remValue}rem`;
  }

  if (typeof value === "string" && value.endsWith("px")) {
    const numericValue = parseFloat(value);
    return `${numericValue / remValue}rem`;
  }

  return value;
}
