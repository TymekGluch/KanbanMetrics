import { MEDIA_CONDITION } from "./Media.constants";
import { type MediaProps } from "./Media.types";
import styles from "./Media.module.scss";
import clsx from "clsx";
import { Base } from "../Base/Base";
import { inferBasePropsFromMediaCondition } from "./Media.utils";

export function MediaServer(props: MediaProps) {
  const { children, Fallback } = props;

  switch (props.variant) {
    case MEDIA_CONDITION.BREAKPOINTS:
      const { fallbackBaseProps, defaultBaseProps } = inferBasePropsFromMediaCondition(
        props.condition
      );

      return (
        <>
          <Base {...defaultBaseProps}>{children}</Base>
          <Base {...fallbackBaseProps}>{Fallback}</Base>
        </>
      );
    case MEDIA_CONDITION.THEME:
      const isForDarkMode = Boolean(props.forDarkMode);

      return (
        <>
          <div className={clsx(styles.media, { [styles.media__forDarkMode]: isForDarkMode })}>
            {children}
          </div>
          <div className={clsx(styles.media, { [styles.media__forDarkMode]: !isForDarkMode })}>
            {Fallback}
          </div>
        </>
      );
    default:
      return null;
  }
}
