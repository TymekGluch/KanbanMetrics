const LUMINANCE_RED_COEFFICIENT = 0.2126;
const LUMINANCE_GREEN_COEFFICIENT = 0.7152;
const LUMINANCE_BLUE_COEFFICIENT = 0.0722;

const SRGB_LINEARISATION_THRESHOLD = 0.04045;
const SRGB_LOW_DIVISOR = 12.92;
const SRGB_HIGH_OFFSET = 0.055;
const SRGB_HIGH_DIVISOR = 1.055;
const SRGB_GAMMA = 2.4;

const WCAG_LUMINANCE_OFFSET = 0.05;

const HEX_CHANNEL_MAX = 255;
const HEX_CHARS_PER_CHANNEL = 2;
const HEX_RADIX = 16;

const HEX_SHORTHAND_LENGTH = 3;
const HEX_FULL_LENGTH = 6;

const VALID_HEX_PATTERN = /^[0-9a-f]{6}$/i;

const BLACK_HEX = "#000000";
const WHITE_HEX = "#ffffff";

function parseHexChannel(hex: string, offset: number): number {
  return parseInt(hex.slice(offset, offset + HEX_CHARS_PER_CHANNEL), HEX_RADIX) / HEX_CHANNEL_MAX;
}

function toLinearLight(srgbChannel: number): number {
  return srgbChannel <= SRGB_LINEARISATION_THRESHOLD
    ? srgbChannel / SRGB_LOW_DIVISOR
    : ((srgbChannel + SRGB_HIGH_OFFSET) / SRGB_HIGH_DIVISOR) ** SRGB_GAMMA;
}

function computeRelativeLuminance(red: number, green: number, blue: number): number {
  return (
    LUMINANCE_RED_COEFFICIENT * toLinearLight(red) +
    LUMINANCE_GREEN_COEFFICIENT * toLinearLight(green) +
    LUMINANCE_BLUE_COEFFICIENT * toLinearLight(blue)
  );
}

export function getAccessibleTextColor(bgHex: string): typeof BLACK_HEX | typeof WHITE_HEX {
  const cleaned = bgHex.replace("#", "").trim();

  const expanded =
    cleaned.length === HEX_SHORTHAND_LENGTH
      ? cleaned
          .split("")
          .map((char) => char + char)
          .join("")
      : cleaned;

  if (!VALID_HEX_PATTERN.test(expanded) || expanded.length !== HEX_FULL_LENGTH) {
    return BLACK_HEX;
  }

  const red = parseHexChannel(expanded, 0);
  const green = parseHexChannel(expanded, HEX_CHARS_PER_CHANNEL);
  const blue = parseHexChannel(expanded, HEX_CHARS_PER_CHANNEL * 2);

  const luminance = computeRelativeLuminance(red, green, blue);

  const contrastWithWhite = (1 + WCAG_LUMINANCE_OFFSET) / (luminance + WCAG_LUMINANCE_OFFSET);
  const contrastWithBlack = (luminance + WCAG_LUMINANCE_OFFSET) / WCAG_LUMINANCE_OFFSET;

  return contrastWithWhite >= contrastWithBlack ? WHITE_HEX : BLACK_HEX;
}
