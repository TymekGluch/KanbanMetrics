import type React from "react";
import type Button from "../Button";

export type CrateWorkspaceButtonProps = React.ComponentProps<typeof Button.AsButton>;

export interface CommonDialogWithFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
