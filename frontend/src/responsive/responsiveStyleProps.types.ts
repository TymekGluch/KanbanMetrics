import type { CSSProperties } from "react";
import { WithResponsiveValues } from "./responsive.types";

type StyleAliasProps = {
  marginX?: CSSProperties["marginLeft"];
  marginY?: CSSProperties["marginTop"];
  paddingX?: CSSProperties["paddingLeft"];
  paddingY?: CSSProperties["paddingTop"];
  insetX?: CSSProperties["left"];
  insetY?: CSSProperties["top"];
  spacing?: CSSProperties["gap"];
};

export type ResponsiveStyleProps = WithResponsiveValues<CSSProperties & StyleAliasProps>;

export type BaseDisplayProps = Pick<ResponsiveStyleProps,
  | "display"
  | "visibility"
  | "overflow"
  | "overflowX"
  | "overflowY"
>;

export type BaseFlexProps = Pick<ResponsiveStyleProps,
  | "display"
  | "flex"
  | "flexBasis"
  | "flexDirection"
  | "flexWrap"
  | "flexGrow"
  | "flexShrink"
  | "justifyContent"
  | "alignItems"
  | "alignContent"
  | "alignSelf"
  | "order"
  | "gap"
  | "rowGap"
  | "columnGap"
  | "spacing"
>;

export type BaseGridProps = Pick<ResponsiveStyleProps,
  | "display"
  | "grid"
  | "gridArea"
  | "gridAutoFlow"
  | "gridAutoRows"
  | "gridAutoColumns"
  | "gridTemplate"
  | "gridTemplateAreas"
  | "gridTemplateRows"
  | "gridTemplateColumns"
  | "gridRow"
  | "gridRowStart"
  | "gridRowEnd"
  | "gridColumn"
  | "gridColumnStart"
  | "gridColumnEnd"
  | "placeItems"
  | "placeContent"
  | "placeSelf"
  | "justifyItems"
  | "justifySelf"
  | "alignItems"
  | "alignContent"
  | "alignSelf"
  | "gap"
  | "rowGap"
  | "columnGap"
  | "spacing"
>;

export type BaseMarginProps = Pick<ResponsiveStyleProps,
  | "margin"
  | "marginTop"
  | "marginRight"
  | "marginBottom"
  | "marginLeft"
  | "marginInline"
  | "marginInlineStart"
  | "marginInlineEnd"
  | "marginBlock"
  | "marginBlockStart"
  | "marginBlockEnd"
  | "marginX"
  | "marginY"
>;

export type BasePaddingProps = Pick<ResponsiveStyleProps,
  | "padding"
  | "paddingTop"
  | "paddingRight"
  | "paddingBottom"
  | "paddingLeft"
  | "paddingInline"
  | "paddingInlineStart"
  | "paddingInlineEnd"
  | "paddingBlock"
  | "paddingBlockStart"
  | "paddingBlockEnd"
  | "paddingX"
  | "paddingY"
>;

export type BaseSpacingProps = Pick<ResponsiveStyleProps,
  | "gap"
  | "rowGap"
  | "columnGap"
  | "spacing"
>;

export type BaseSizeProps = Pick<ResponsiveStyleProps,
  | "width"
  | "minWidth"
  | "maxWidth"
  | "height"
  | "minHeight"
  | "maxHeight"
  | "aspectRatio"
  | "boxSizing"
>;

export type BasePositionProps = Pick<ResponsiveStyleProps,
  | "position"
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "inset"
  | "insetBlock"
  | "insetBlockStart"
  | "insetBlockEnd"
  | "insetInline"
  | "insetInlineStart"
  | "insetInlineEnd"
  | "insetX"
  | "insetY"
  | "zIndex"
>;

export type BaseTypographyProps = Pick<ResponsiveStyleProps,
  | "font"
  | "fontFamily"
  | "fontSize"
  | "fontWeight"
  | "fontStyle"
  | "lineHeight"
  | "letterSpacing"
  | "textAlign"
  | "textTransform"
  | "textDecoration"
  | "whiteSpace"
  | "wordBreak"
  | "wordWrap"
  | "overflowWrap"
  | "color"
>;

export type BaseBackgroundProps = Pick<ResponsiveStyleProps,
  | "background"
  | "backgroundColor"
  | "backgroundImage"
  | "backgroundSize"
  | "backgroundPosition"
  | "backgroundRepeat"
  | "backgroundClip"
  | "opacity"
>;

export type BaseBorderProps = Pick<ResponsiveStyleProps,
  | "border"
  | "borderTop"
  | "borderRight"
  | "borderBottom"
  | "borderLeft"
  | "borderColor"
  | "borderStyle"
  | "borderWidth"
  | "borderRadius"
  | "outline"
  | "outlineColor"
  | "outlineStyle"
  | "outlineWidth"
  | "boxShadow"
>;

export type BaseStyleGroups =
  & BaseDisplayProps
  & BaseFlexProps
  & BaseGridProps
  & BaseMarginProps
  & BasePaddingProps
  & BaseSpacingProps
  & BaseSizeProps
  & BasePositionProps
  & BaseTypographyProps
  & BaseBackgroundProps
  & BaseBorderProps;
