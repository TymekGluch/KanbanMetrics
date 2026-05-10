"use client";

import { PlusSvg } from "@/assets/PlusSvg";
import { PuzzleSvg } from "@/assets/PuzzleSvg";
import { WorkspacesContext } from "@/providers/WorkspacesProvider/WorkspacesProvider";
import clsx from "clsx";
import React from "react";
import Button from "../Button";
import { Hidden } from "../Hidden/Hidden";
import { PageLayoutPanelContext } from "../PageLayout/PageLayoutPanel/context";
import { pageLayoutPanelContextDefaultSpaces } from "../PageLayout/PageLayoutPanel/context/LayoutContext";
import { PANEL_NAVIGATION_BUTTON } from "./PanelNavigation.constants";
import styles from "./PanelNavigation.module.scss";
import {
  type ButtonConditionProp,
  type NextLinkConditionProp,
  type PanelButtonProps,
} from "./PanelNavigation.types";
import CreateWorkspaceButton from "../CrateWorkspaceButton";

type PanelNavigationProps = {
  asListItems?: boolean;
  isNavigationWide?: boolean;
};

export function PanelButton(props: PanelButtonProps) {
  const { polymorphicButtonProps, StartIconSlot, text } = props;
  const { polymorphicVariant, ...restButtonProps } = polymorphicButtonProps;

  const { value } = React.useContext(PageLayoutPanelContext);

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

      return (
        <Button.AsButton
          {...buttonProps}
          className={clsx(styles.panelButton, buttonProps.className, {
            [styles.panelButton__active]: !isNavigationHidden,
          })}
          onTransitionEnd={handleTransitionEnd}
        >
          {React.isValidElement(StartIconSlot) &&
            React.cloneElement(StartIconSlot, { className: styles.panelButton_icon })}
          {isTextVisible ? text : <Hidden>{text}</Hidden>}
        </Button.AsButton>
      );
    case PANEL_NAVIGATION_BUTTON.NEXT_LINK:
      const nextLinkProps = restButtonProps as NextLinkConditionProp;

      return (
        <Button.AsLink
          {...nextLinkProps}
          className={clsx(styles.panelButton, nextLinkProps.className, {
            [styles.panelButton__active]: !isNavigationHidden,
          })}
          onTransitionEnd={handleTransitionEnd}
        >
          {React.isValidElement(StartIconSlot) &&
            React.cloneElement(StartIconSlot, { className: styles.panelButton_icon })}
          {isTextVisible ? text : <Hidden>{text}</Hidden>}
        </Button.AsLink>
      );
    default:
      return null;
  }
}

function CommonItems(props: PanelNavigationProps) {
  const { asListItems = false } = props;

  const commonItem = (
    <PanelButton
      polymorphicButtonProps={{
        polymorphicVariant: PANEL_NAVIGATION_BUTTON.NEXT_LINK,
        href: "/dashboard",
        variant: "outlined",
      }}
      StartIconSlot={<PuzzleSvg />}
      text="Overview"
    />
  );

  if (asListItems) {
    return <li className={styles.panelNavigation_item}>{commonItem}</li>;
  }

  return <>{commonItem}</>;
}

export function PanelNavigation(props: PanelNavigationProps) {
  const { asListItems = false } = props;
  const { workspaces } = React.useContext(WorkspacesContext);

  const workspacesItems = workspaces?.items ?? [];

  const createWorkspaceItem = (
    <CreateWorkspaceButton.PanelButton
      polymorphicButtonProps={{
        polymorphicVariant: PANEL_NAVIGATION_BUTTON.NEXT_LINK,
        href: "/dashboard/workspaces/create",
        variant: "outlined",
      }}
      text="Create your first workspace"
      StartIconSlot={<PlusSvg />}
    />
  );

  if (!workspacesItems.length) {
    return (
      <>
        <CommonItems asListItems={asListItems} />

        {asListItems ? (
          <li className={styles.panelNavigation_item}>{createWorkspaceItem}</li>
        ) : (
          createWorkspaceItem
        )}
      </>
    );
  }

  return (
    <>
      <CommonItems asListItems={asListItems} />
    </>
  );
}
