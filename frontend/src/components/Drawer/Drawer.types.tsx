import type React from "react";

interface DrawerButtonNameByState {
  open: string;
  close: string;
}

export interface DrawerButtonComponentProps {
  name: DrawerButtonNameByState;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  OpenIconSlot?: React.ReactNode;
  CloseIconSlot?: React.ReactNode;
}

export interface DrawerContentComponentProps extends React.PropsWithChildren {
  HeroSlot?: React.ReactNode;
  FooterSlot?: React.ReactNode;
  as?: React.HTMLElementType;
}
