import { type ValueOf } from "@/types/valueOf";
import {
  type IRREGULAR_ICON_BADGE_VARIANTS,
  type IRREGULAR_ICON_BADGE_COLORS,
} from "./IrregularIconBadge.constants";

export interface IrregularIconBadgeProps extends React.PropsWithChildren {
  className?: string;
  contentClassName?: string;
  variant?: ValueOf<typeof IRREGULAR_ICON_BADGE_VARIANTS>;
  color?: ValueOf<typeof IRREGULAR_ICON_BADGE_COLORS>;
}
