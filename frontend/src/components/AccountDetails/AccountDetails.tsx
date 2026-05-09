"use client";

import { UserContext } from "@/providers/UserProvider/UserProvider";
import { COLORS } from "@/theme/theme.constants";
import { pxToRem } from "@/utils/pxToRem";
import clsx from "clsx";
import React from "react";
import { Hidden } from "../Hidden/Hidden";
import { Separator } from "../Separator/Separator";
import styles from "./AccountDetails.module.scss";
import { resolveDate, resolveRole } from "./AccountDetails.utils";

export function AccountDetails() {
  const user = React.useContext(UserContext);

  if (!user) {
    return null;
  }

  return (
    <ul className={styles.accountDetails}>
      <li className={styles.accountDetails_item}>
        <strong className={styles.accountDetails_strong}>ID:</strong>{" "}
        <span className={styles.accountDetails_value}>{user.id}</span>
      </li>

      <li>
        <Separator background={COLORS.DIVIDER_SUBTLE} marginY={pxToRem(8)} />
      </li>

      <li className={styles.accountDetails_item}>
        <strong className={styles.accountDetails_strong}>Name:</strong>{" "}
        <span className={styles.accountDetails_value}>{user.name}</span>
      </li>

      <li>
        <Separator background={COLORS.DIVIDER_SUBTLE} marginY={pxToRem(8)} />
      </li>

      <li className={styles.accountDetails_item}>
        <strong className={styles.accountDetails_strong}>Email:</strong>{" "}
        <span className={styles.accountDetails_value}>{user.email}</span>
      </li>

      <li>
        <Separator background={COLORS.DIVIDER_SUBTLE} marginY={pxToRem(8)} />
      </li>

      <li className={styles.accountDetails_item}>
        <strong className={styles.accountDetails_strong}>Role:</strong>{" "}
        <span className={styles.accountDetails_badgeValue}>{resolveRole(user.role)}</span>
      </li>

      <li>
        <Separator background={COLORS.DIVIDER_SUBTLE} marginY={pxToRem(8)} />
      </li>

      <li className={styles.accountDetails_item}>
        <strong className={styles.accountDetails_strong}>Is verified</strong>{" "}
        <span
          className={clsx(styles.accountDetails_booleanValue, {
            [styles.accountDetails_booleanValue__false]: !user.is_verified,
          })}
        >
          <Hidden>{user.is_verified ? "Yes" : "No"}</Hidden>
        </span>
      </li>

      <li>
        <Separator background={COLORS.DIVIDER_SUBTLE} marginY={pxToRem(8)} />
      </li>

      <li className={styles.accountDetails_item}>
        <strong className={styles.accountDetails_strong}>Is active</strong>{" "}
        <span
          className={clsx(styles.accountDetails_booleanValue, {
            [styles.accountDetails_booleanValue__false]: !user.is_active,
          })}
        >
          <Hidden>{user.is_active ? "Yes" : "No"}</Hidden>
        </span>
      </li>

      <li>
        <Separator background={COLORS.DIVIDER_SUBTLE} marginY={pxToRem(8)} />
      </li>

      <li className={styles.accountDetails_item}>
        <strong className={styles.accountDetails_strong}>Last login at:</strong>{" "}
        <span className={styles.accountDetails_value}>{resolveDate(user.last_login_at)}</span>
      </li>

      <li>
        <Separator background={COLORS.DIVIDER_SUBTLE} marginY={pxToRem(8)} />
      </li>

      <li className={styles.accountDetails_item}>
        <strong className={styles.accountDetails_strong}>Created at:</strong>{" "}
        <span className={styles.accountDetails_value}>{resolveDate(user.created_at)}</span>
      </li>

      <li>
        <Separator background={COLORS.DIVIDER_SUBTLE} marginY={pxToRem(8)} />
      </li>

      <li className={styles.accountDetails_item}>
        <strong className={styles.accountDetails_strong}>Updated at:</strong>{" "}
        <span className={styles.accountDetails_value}>{resolveDate(user.updated_at)}</span>
      </li>
    </ul>
  );
}
