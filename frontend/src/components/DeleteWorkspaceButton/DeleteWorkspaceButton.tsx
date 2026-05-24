"use client";

import { useDeleteWorkspaceMutationFetch } from "@/api/useDeleteWorkspaceMutationFetch";
import React from "react";
import Button from "../Button";
import { type DeleteWorkspaceButtonProps } from "./DeleteWorkspaceButton.types";
import Dialog from "../Dialog";
import styles from "./DeleteWorkspaceButton.module.scss";
import { Base } from "../Base/Base";
import { COLORS } from "@/theme/theme.constants";
import { useParams } from "next/navigation";
import z from "zod";

const paramIdSchema = z.uuid();

export function DeleteWorkspaceButton(props: DeleteWorkspaceButtonProps) {
  const {
    confirmationTitle = "Delete Workspace",
    confirmationDescription = "This action cannot be undone. Are you sure you want to permanently delete this workspace and all associated data?",
    confirmationCancelLabel = "Cancel",
    confirmationDeleteLabel = "Delete Workspace",
    onClick,
    disabled,
    ...rest
  } = props;

  const [isConfirm, setIsConfirm] = React.useState(false);

  const params = useParams();
  const mutation = useDeleteWorkspaceMutationFetch();

  const resolvedId = paramIdSchema.safeParse(params?.id).data ?? "";

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsConfirm(true);

    onClick?.(event);
  };

  const handleDeleteWorkspace = () => {
    mutation.mutate(resolvedId);

    setIsConfirm(false);
  };

  return (
    <Dialog.Root open={isConfirm} onOpenChange={setIsConfirm}>
      <Button.AsButton
        {...rest}
        type="button"
        className={styles.deleteWorkspaceButton}
        onClick={handleButtonClick}
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
            onClick={() => setIsConfirm(false)}
            disabled={mutation.isPending}
            variant="outlined"
          >
            {confirmationCancelLabel}
          </Button.AsButton>

          <Button.AsButton
            type="button"
            onClick={handleDeleteWorkspace}
            className={styles.deleteWorkspaceButton}
            disabled={mutation.isPending}
          >
            {confirmationDeleteLabel}
          </Button.AsButton>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
