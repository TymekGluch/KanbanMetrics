import {
  type BaseMarginProps,
  type BaseBackgroundProps,
  type BaseSizeProps,
} from "@/responsive/responsiveStyleProps.types";

type MarginProps = Pick<BaseMarginProps, "margin" | "marginY">;
type SizeProps = Pick<BaseSizeProps, "width" | "height">;

export interface SeparatorProps extends MarginProps, SizeProps {
  background?: BaseBackgroundProps["background"];
}
