import { Base } from "../Base/Base";
import styles from "./Separator.module.scss";
import { type SeparatorProps } from "./Separator.types";

export function Separator(props: SeparatorProps) {
  const { background, margin, marginY } = props;

  return (
    <Base
      as="span"
      className={styles.separator}
      background={background}
      margin={margin}
      marginY={marginY}
    />
  );
}
