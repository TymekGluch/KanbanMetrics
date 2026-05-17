import type React from "react";
import type Button from "../Button";

export interface DeleteWorkspaceButtonProps extends React.ComponentProps<typeof Button.AsButton> {
  confirmationTitle?: string;
  confirmationDescription?: string;
  confirmationCancelLabel?: string;
  confirmationDeleteLabel?: string;
}
