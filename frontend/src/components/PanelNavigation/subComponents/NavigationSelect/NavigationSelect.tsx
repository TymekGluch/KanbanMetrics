import { GlassSvg } from "@/assets/GlassSvg";
import { XSvg } from "@/assets/XSvg";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import { Hidden } from "@/components/Hidden/Hidden";
import { Select } from "@/components/Select/Select";
import { type SelectProps } from "@/components/Select/Select.types";
import { pxToRem } from "@/utils/pxToRem";
import React from "react";
import { PanelButton } from "../PanelButton/PanelButton";
import { PANEL_NAVIGATION_BUTTON } from "../PanelButton/PanelButton.constants";

function MobileNavigationSelect(props: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <PanelButton
        StartIconSlot={<GlassSvg />}
        polymorphicButtonProps={{
          polymorphicVariant: PANEL_NAVIGATION_BUTTON.BUTTON,
          onClick: () => setIsOpen((value) => !value),
          variant: "outlined",
        }}
        text="Select workspace"
      />

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Select a workspace</Dialog.Title>

          <Button.AsButton
            variant="outlined"
            onClick={() => setIsOpen(false)}
            StartIconSlot={<XSvg />}
            width={pxToRem(48)}
            padding={0}
          >
            <Hidden>Close</Hidden>
          </Button.AsButton>
        </Dialog.Header>

        <Select {...props} isOverDialog />
      </Dialog.Content>
    </Dialog.Root>
  );
}

interface NavigationSelectProps extends SelectProps {
  isSideMenuWide?: boolean;
}

export function NavigationSelect(props: NavigationSelectProps) {
  const { isSideMenuWide = false, ...selectProps } = props;

  if (isSideMenuWide) {
    return <Select {...selectProps} />;
  }

  return <MobileNavigationSelect {...selectProps} />;
}
