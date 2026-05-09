"use client";

import { useLogoutMutationFetch } from "@/api/useLogoutMutationFetch";
import React from "react";
import Button from "../Button";
import Dialog from "../Dialog";
import { type LogoutButtonProps } from "./LogoutButton.types";

export function LogoutButton(props: LogoutButtonProps) {
  const {
    onClick,
    disabled,
    requireConfirmation = true,
    confirmationTitle = "Confirm logout",
    confirmationDescription = "Are you sure you want to log out?",
    confirmationCancelLabel = "Cancel",
    confirmationConfirmLabel = "Logout",
    ...rest
  } = props;

  const mutation = useLogoutMutationFetch();
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }

    setIsConfirmOpen(false);
    mutation.mutate();
  };

  if (!requireConfirmation) {
    return (
      <Button.AsButton {...rest} onClick={handleLogout} disabled={disabled || mutation.isPending} />
    );
  }

  return (
    <Dialog.Root open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <Button.AsButton
        {...rest}
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        disabled={disabled || mutation.isPending}
      />

      <Dialog.Content>
        <Dialog.Header>
          <div>
            <Dialog.Title>{confirmationTitle}</Dialog.Title>
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

          <Button.AsButton type="button" onClick={handleLogout} disabled={mutation.isPending}>
            {confirmationConfirmLabel}
          </Button.AsButton>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
