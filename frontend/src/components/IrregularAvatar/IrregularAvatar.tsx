import React from "react";
import clsx from "clsx";
import styles from "./IrregularAvatar.module.scss";
import { IRREGULAR_AVATAR_SIZES } from "./IrregularAvatar.constants";
import { type IrregularAvatarProps } from "./IrregularAvatar.types";
import { getAcronym } from "@/utils/getAcronym";
import { getAccessibleTextColor } from "@/utils/getAccessibleTextColor";
import Image from "next/image";

export function IrregularAvatar(props: IrregularAvatarProps) {
  const {
    name,
    backgroundColor,
    src,
    size = IRREGULAR_AVATAR_SIZES.MD,
    className,
    contentClassName,
  } = props;

  const textColor = getAccessibleTextColor(backgroundColor);

  return (
    <div
      className={clsx(styles.irregularAvatar, styles[`irregularAvatar__${size}`], className)}
      style={
        {
          "--avatar-bg-color": backgroundColor,
          "--avatar-text-color": textColor,
        } as React.CSSProperties
      }
      role="img"
      aria-label={name}
    >
      <div className={clsx(styles.irregularAvatar_content, contentClassName)}>
        {src ? (
          <Image className={styles.irregularAvatar_image} src={src} alt={name} />
        ) : (
          <span aria-hidden="true">{getAcronym(name)}</span>
        )}
      </div>
    </div>
  );
}
