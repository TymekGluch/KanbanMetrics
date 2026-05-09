"use client";

import { UserContext } from "@/providers/UserProvider/UserProvider";
import React from "react";
import Link from "../Link";
import styles from "./UserIndicator.module.scss";
import Button from "../Button";
import { Media } from "../Media";
import { MEDIA_CONDITION } from "../Media/Media.constants";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";
import { useLogoutMutationFetch } from "../../api/useLogoutMutationFetch";
import Dialog from "../Dialog";

export function UserIndicator() {
  const user = React.useContext(UserContext);
  const logoutMutation = useLogoutMutationFetch();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);

  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false);
    logoutMutation.mutate();
  };

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
          <Button.AsLink className={styles.userIndicator_smallButton} href="/auth/register">
            Register
          </Button.AsLink>
        </li>
      </ul>
    );
  }

  return (
    <ul className={styles.userIndicator}>
      <li>
        <Dialog.Root open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <Link.AsButton
            disabled={logoutMutation.isPending}
            type="button"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            Logout
          </Link.AsButton>

          <Dialog.Content>
            <Dialog.Header>
              <div>
                <Dialog.Title>Confirm logout</Dialog.Title>
                <Dialog.Description>Are you sure you want to log out?</Dialog.Description>
              </div>
            </Dialog.Header>

            <Dialog.Footer>
              <Button.AsButton
                type="button"
                variant="outlined"
                onClick={() => setIsLogoutDialogOpen(false)}
                disabled={logoutMutation.isPending}
              >
                Cancel
              </Button.AsButton>

              <Button.AsButton
                type="button"
                onClick={handleConfirmLogout}
                disabled={logoutMutation.isPending}
              >
                Logout
              </Button.AsButton>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </li>
      <li>
        <Button.AsLink
          href="/dashboard"
          variant="outlined"
          className={styles.userIndicator_smallButton}
        >
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
