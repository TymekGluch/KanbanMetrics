import type React from "react";
import type Button from "../Button";

export interface LogoutButtonProps extends React.ComponentProps<typeof Button.AsButton> {
  requireConfirmation?: boolean;
  confirmationTitle?: React.ReactNode;
  confirmationDescription?: React.ReactNode;
  confirmationCancelLabel?: React.ReactNode;
  confirmationConfirmLabel?: React.ReactNode;
}
