"use client";

import { MenuSvg } from "@/assets/MenuSvg";
import { type DrawerContentComponentProps, type DrawerButtonComponentProps } from "./Drawer.types";
import { XSvg } from "@/assets/XSvg";
import React from "react";
import { DrawerContext, DrawerProvider } from "./context";
import { Hidden } from "../Hidden/Hidden";
import styles from "./Drawer.module.scss";
import Button from "../Button";
import clsx from "clsx";

export function DrawerProviderComponent(props: React.PropsWithChildren) {
  const { children } = props;

  return <DrawerProvider>{children}</DrawerProvider>;
}

export function DrawerButtonComponent(props: DrawerButtonComponentProps) {
  const { name, onClick, OpenIconSlot, CloseIconSlot } = props;
  const { open: NameByStateOpen, close: NameByStateClose } = name;

  const { isOpen, setIsOpen } = React.useContext(DrawerContext);

  const nameByState = isOpen ? NameByStateClose : NameByStateOpen;

  const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!!onClick) {
      onClick(event);
    }

    setIsOpen((prev) => !prev);
  };

  return (
    <Button.AsButton
      className={clsx(styles.drawerButton, {
        [styles.drawerButton__isOpen]: isOpen,
      })}
      variant="outlined"
      onClick={onButtonClick}
    >
      <Hidden>{nameByState}</Hidden>
      {isOpen
        ? (CloseIconSlot ?? <XSvg className={styles.drawerButton_icon} />)
        : (OpenIconSlot ?? <MenuSvg className={styles.drawerButton_icon} />)}
    </Button.AsButton>
  );
}

export function DrawerContentComponent(props: DrawerContentComponentProps) {
  const { children, HeroSlot = null, FooterSlot = null, as: Component = "div" } = props;

  const { isOpen } = React.useContext(DrawerContext);

  return (
    <Component
      className={clsx(styles.drawerContent, {
        [styles.drawerContent__isOpen]: isOpen,
      })}
    >
      <div className={styles.drawerContent_hero}>{HeroSlot}</div>
      {isOpen && <div className={styles.drawerContent_children}>{children}</div>}
      {FooterSlot && <div className={styles.drawerContent_footer}>{FooterSlot}</div>}
    </Component>
  );
}
