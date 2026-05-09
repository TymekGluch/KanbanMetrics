import {
  DialogBodyComponent,
  DialogCloseComponent,
  DialogContentComponent,
  DialogDescriptionComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogRootComponent,
  DialogTitleComponent,
  DialogTriggerComponent,
} from "./Dialog.client";

export { DIALOG_SIZES } from "./dialog.constants";
export type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogOverlayProps,
  DialogRootProps,
  DialogSimpleSlotProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "./Dialog.types";

type DialogAliasInterface = {
  Body: typeof DialogBodyComponent;
  Close: typeof DialogCloseComponent;
  Content: typeof DialogContentComponent;
  Description: typeof DialogDescriptionComponent;
  Footer: typeof DialogFooterComponent;
  Header: typeof DialogHeaderComponent;
  Root: typeof DialogRootComponent;
  Title: typeof DialogTitleComponent;
  Trigger: typeof DialogTriggerComponent;
};

const Dialog: DialogAliasInterface = {
  Root: DialogRootComponent,
  Trigger: DialogTriggerComponent,
  Content: DialogContentComponent,
  Close: DialogCloseComponent,
  Header: DialogHeaderComponent,
  Body: DialogBodyComponent,
  Footer: DialogFooterComponent,
  Title: DialogTitleComponent,
  Description: DialogDescriptionComponent,
};

export default Dialog;
