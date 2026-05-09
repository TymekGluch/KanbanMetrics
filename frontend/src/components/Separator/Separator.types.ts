import {
  type BaseMarginProps,
  type BaseBackgroundProps,
} from "@/responsive/responsiveStyleProps.types";

type MarginProps = Pick<BaseMarginProps, "margin" | "marginY">;

export interface SeparatorProps extends MarginProps {
  background?: BaseBackgroundProps["background"];
}
