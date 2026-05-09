"use client";

import { useDeleteAccountMutationFetch } from "@/api/useDeleteAccountMutationFetch";
import React from "react";
import Button from "../Button";
import Dialog from "../Dialog";
import styles from "./DeleteAccountButton.module.scss";
import { type DeleteAccountButtonProps } from "./DeleteAccountButton.types";
import { COLORS } from "@/theme/theme.constants";
import { Base } from "../Base/Base";

export function DeleteAccountButton(props: DeleteAccountButtonProps) {
  const {
    onClick,
    disabled,
    requireConfirmation = true,
    confirmationTitle = "Delete account",
    confirmationDescription = "This action cannot be undone. Are you sure you want to permanently delete your account and all associated data?",
    confirmationCancelLabel = "Cancel",
    confirmationConfirmLabel = "Delete",
    ...rest
  } = props;

  const mutation = useDeleteAccountMutationFetch();
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const handleDeleteAccount = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }

    setIsConfirmOpen(false);
    mutation.mutate();
  };

  if (!requireConfirmation) {
    return (
      <Button.AsButton
        {...rest}
        type="button"
        className={styles.deleteAccountButton}
        onClick={handleDeleteAccount}
        disabled={disabled || mutation.isPending}
      />
    );
  }

  return (
    <Dialog.Root open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <Button.AsButton
        {...rest}
        type="button"
        className={styles.deleteAccountButton}
        onClick={() => setIsConfirmOpen(true)}
        disabled={disabled || mutation.isPending}
      />

      <Dialog.Content>
        <Dialog.Header>
          <div>
            <Dialog.Title>
              <Base as="span" color={COLORS.STATUS_DANGER_TEXT}>
                {confirmationTitle}
              </Base>
            </Dialog.Title>
            <Dialog.Description>{confirmationDescription}</Dialog.Description>
          </div>
        </Dialog.Header>

        <Dialog.Footer>
          <Button.AsButton
            type="button"
            variant="outlined"
            onClick={() => setIsConfirmOpen(false)}
            disabled={mutation.isPending}
          >
            {confirmationCancelLabel}
          </Button.AsButton>

          <Button.AsButton
            type="button"
            className={styles.deleteAccountButton}
            onClick={handleDeleteAccount}
            disabled={mutation.isPending}
          >
            {confirmationConfirmLabel}
          </Button.AsButton>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
