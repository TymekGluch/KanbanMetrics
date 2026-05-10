"use client";

import React from "react";
import Button from "../Button";
import Dialog from "../Dialog";
import Form from "../Form";
import {
  type CommonDialogWithFormProps,
  type CrateWorkspaceButtonProps,
} from "./CrateWorkspaceButton.types";
import { useCreateWorkspaceForm } from "./useCreateWorkspaceForm";
import { Base } from "../Base/Base";
import { COLORS } from "@/theme/theme.constants";
import { type PanelButtonProps } from "../PanelNavigation/PanelNavigation.types";
import { PanelButton } from "../PanelNavigation/PanelNavigation";
import { PANEL_NAVIGATION_BUTTON } from "../PanelNavigation/PanelNavigation.constants";

function CommonDialogWithForm(props: CommonDialogWithFormProps) {
  const { isOpen, onOpenChange } = props;

  const formID = React.useId();
  const { form, handleSubmit, isPending } = useCreateWorkspaceForm(onOpenChange);

  const { errors } = form.formState;
  const globalErrorMessage = errors.root?.server?.message;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Base as="div" display="flex" flexDirection="column" gap={8}>
            <Dialog.Title>Create workspace</Dialog.Title>
            <Dialog.Description>
              Here you can create your new workspace, to begin get metrics, but first name it.
            </Dialog.Description>
          </Base>
        </Dialog.Header>

        <Dialog.Body>
          <Form id={formID} onSubmit={handleSubmit}>
            <Form.Input
              {...form.register("name")}
              error={errors.name?.message}
              invalid={Boolean(errors.name)}
              disabled={isPending}
              autoComplete="off"
              width="100%"
              label="Workspace name"
              required
            />

            {globalErrorMessage && (
              <Base as="p" color={COLORS.STATUS_DANGER_TEXT}>
                {globalErrorMessage}
              </Base>
            )}
          </Form>
        </Dialog.Body>

        <Dialog.Footer>
          <Button.AsButton
            type="button"
            variant="outlined"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button.AsButton>

          <Button.AsButton type="submit" form={formID} disabled={isPending}>
            Create
          </Button.AsButton>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function CrateWorkspaceButtonComponent(props: CrateWorkspaceButtonProps) {
  const { children, ...rest } = props;

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const handleOpenChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsConfirmOpen(true);

    rest.onClick?.(event);
  };

  if (!isConfirmOpen) {
    return (
      <Button.AsButton {...rest} onClick={handleOpenChange}>
        {children}
      </Button.AsButton>
    );
  }

  return <CommonDialogWithForm isOpen={isConfirmOpen} onOpenChange={setIsConfirmOpen} />;
}

export function CrateWorkspacePanelNavigationComponent(props: PanelButtonProps) {
  const { text, StartIconSlot } = props;

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const handleOpenChange = () => {
    setIsConfirmOpen(true);
  };

  if (!isConfirmOpen) {
    return (
      <PanelButton
        polymorphicButtonProps={{
          polymorphicVariant: PANEL_NAVIGATION_BUTTON.BUTTON,
          onClick: handleOpenChange,
          variant: "outlined",
        }}
        text={text}
        StartIconSlot={StartIconSlot}
      />
    );
  }

  return <CommonDialogWithForm isOpen={isConfirmOpen} onOpenChange={setIsConfirmOpen} />;
}
