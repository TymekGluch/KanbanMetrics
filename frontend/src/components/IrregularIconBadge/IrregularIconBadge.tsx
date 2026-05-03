import clsx from "clsx";
import styles from "./IrregularIconBadge.module.scss";
import {
  IRREGULAR_ICON_BADGE_COLORS,
  IRREGULAR_ICON_BADGE_VARIANTS,
} from "./IrregularIconBadge.constants";
import { type IrregularIconBadgeProps } from "./IrregularIconBadge.types";

export function IrregularIconBadge(props: IrregularIconBadgeProps) {
  const {
    children,
    className,
    contentClassName,
    variant = IRREGULAR_ICON_BADGE_VARIANTS.V1,
    color = IRREGULAR_ICON_BADGE_COLORS.DEFAULT,
  } = props;

  return (
    <div
      className={clsx(
        styles.irregularIconBadge,
        styles[`irregularIconBadge__${variant}`],
        styles[`irregularIconBadge__${color}`],
        className
      )}
    >
      <div className={clsx(styles.irregularIconBadge_content, contentClassName)}>{children}</div>
    </div>
  );
}
