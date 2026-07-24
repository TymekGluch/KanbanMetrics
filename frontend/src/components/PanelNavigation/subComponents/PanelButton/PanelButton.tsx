'use client";';

import React from "react";
import {
  type NextLinkConditionProp,
  type ButtonConditionProp,
  type PanelButtonProps,
} from "./PanelButton.types";
import styles from "./PanelButton.module.scss";
import { PageLayoutPanelContext } from "@/components/PageLayout/PageLayoutPanel/context";
import { DrawerContext } from "@/components/Drawer/context";
import { pageLayoutPanelContextDefaultSpaces } from "@/components/PageLayout/PageLayoutPanel/context/LayoutContext";
import { PANEL_NAVIGATION_BUTTON } from "./PanelButton.constants";
import Button from "@/components/Button";
import clsx from "clsx";
import { Hidden } from "@/components/Hidden/Hidden";
import { Media } from "@/components/Media";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";
import { MEDIA_CONDITION } from "@/components/Media/Media.constants";
import Link from "@/components/Link";

export function PanelButton(props: PanelButtonProps) {
  const { polymorphicButtonProps, StartIconSlot, text, isOutlined = true } = props;
  const { polymorphicVariant, ...restButtonProps } = polymorphicButtonProps;

  const { value } = React.useContext(PageLayoutPanelContext);
  const { setIsOpen } = React.useContext(DrawerContext);

  const isNavigationHidden =
    value.contentSpace === pageLayoutPanelContextDefaultSpaces.contentSpace &&
    value.navigationSpace === pageLayoutPanelContextDefaultSpaces.navigationSpace;

  const [isOpenTransitionFinished, setIsOpenTransitionFinished] =
    React.useState(!isNavigationHidden);

  const previousHiddenRef = React.useRef(isNavigationHidden);

  const isTextVisible = !isNavigationHidden && isOpenTransitionFinished;

  const handleTransitionEnd = () => {
    if (!isNavigationHidden) {
      setIsOpenTransitionFinished(true);
    }
  };

  React.useLayoutEffect(() => {
    if (previousHiddenRef.current !== isNavigationHidden) {
      setIsOpenTransitionFinished(false);
      previousHiddenRef.current = isNavigationHidden;
    }
  }, [isNavigationHidden]);

  switch (polymorphicVariant) {
    case PANEL_NAVIGATION_BUTTON.BUTTON:
      const buttonProps = restButtonProps as ButtonConditionProp;

      const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsOpen(false);

        if (buttonProps.onClick) {
          buttonProps.onClick(event);
        }
      };

      return (
        <Media.Client
          variant={MEDIA_CONDITION.BREAKPOINTS}
          condition={{
            [BREAKPOINTS_KEYS.md]: true,
          }}
          Fallback={
            <Link.AsButton
              {...buttonProps}
              className={styles.panelLink}
              onClick={handleButtonClick}
            >
              {text}
            </Link.AsButton>
          }
        >
          <Button.AsButton
            {...buttonProps}
            className={clsx(styles.panelButton, buttonProps.className, {
              [styles.panelButton__active]: !isNavigationHidden,
            })}
            onClick={handleButtonClick}
            onTransitionEnd={handleTransitionEnd}
            StartIconSlot={StartIconSlot}
          >
            {isTextVisible ? text : <Hidden>{text}</Hidden>}
          </Button.AsButton>
        </Media.Client>
      );
    case PANEL_NAVIGATION_BUTTON.NEXT_LINK:
      const nextLinkProps = restButtonProps as NextLinkConditionProp;

      return (
        <Media.Client
          variant={MEDIA_CONDITION.BREAKPOINTS}
          condition={{
            [BREAKPOINTS_KEYS.md]: true,
          }}
          Fallback={
            <Link.AsNextLink
              {...nextLinkProps}
              className={styles.panelLink}
              onClick={() => setIsOpen(false)}
            >
              {text}
            </Link.AsNextLink>
          }
        >
          <Button.AsLink
            {...nextLinkProps}
            prefetch
            className={clsx(styles.panelButton, nextLinkProps.className, {
              [styles.panelButton__isOutlined]: isOutlined,
              [styles.panelButton__active]: !isNavigationHidden,
            })}
            onClick={() => setIsOpen(false)}
            StartIconSlot={StartIconSlot}
            onTransitionEnd={handleTransitionEnd}
          >
            {isTextVisible ? text : <Hidden>{text}</Hidden>}
          </Button.AsLink>
        </Media.Client>
      );
    default:
      return null;
  }
}
