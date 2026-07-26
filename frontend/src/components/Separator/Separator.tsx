import { Base } from "../Base/Base";
import styles from "./Separator.module.scss";
import { type SeparatorProps } from "./Separator.types";

export function Separator(props: SeparatorProps) {
  const { background, margin, marginY, width, height } = props;

  return (
    <Base
      as="span"
      className={styles.separator}
      background={background}
      width={width ?? "100%"}
      height={height}
      margin={margin}
      marginY={marginY}
    />
  );
}
