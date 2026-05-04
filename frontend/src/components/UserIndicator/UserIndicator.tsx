"use client";

import { UserContext } from "@/providers/UserProvider/UserProvider";
import React from "react";
import Link from "../Link";
import styles from "./UserIndicator.module.scss";
import Button from "../Button";
import { Media } from "../Media";
import { MEDIA_CONDITION } from "../Media/Media.constants";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";
import { useLogoutMutationFetch } from "./api/useLogoutMutationFetch";

export function UserIndicator() {
  const user = React.useContext(UserContext);
  const logoutMutation = useLogoutMutationFetch();

  if (!user) {
    return (
      <ul className={styles.userIndicator}>
        <li>
          <Button.AsLink
            className={styles.userIndicator_smallButton}
            href="/auth/login"
            variant="outlined"
          >
            Login
          </Button.AsLink>
        </li>

        <li>
          <Button.AsLink
            className={styles.userIndicator_smallButton}
            href="/auth/register"
            variant="outlined"
          >
            Register
          </Button.AsLink>
        </li>
      </ul>
    );
  }

  return (
    <ul className={styles.userIndicator}>
      <li>
        <Link.AsButton
          disabled={logoutMutation.isPending}
          className={styles.userIndicator}
          onClick={() => logoutMutation.mutate()}
        >
          Logout
        </Link.AsButton>
      </li>
      <li>
        <Button.AsLink href="/dashboard" variant="outlined">
          <Media.Client
            variant={MEDIA_CONDITION.BREAKPOINTS}
            condition={{
              [BREAKPOINTS_KEYS.md]: true,
            }}
            Fallback={"dashboard"}
          >
            Go to dashboard
          </Media.Client>
        </Button.AsLink>
      </li>
    </ul>
  );
}
