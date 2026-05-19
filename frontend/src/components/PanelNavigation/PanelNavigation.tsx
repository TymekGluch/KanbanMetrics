"use client";

import { PlusSvg } from "@/assets/PlusSvg";
import { PuzzleSvg } from "@/assets/PuzzleSvg";
import { WorkspacesContext } from "@/providers/WorkspacesProvider/WorkspacesProvider";
import React from "react";
import CreateWorkspaceButton from "../CrateWorkspaceButton";
import styles from "./PanelNavigation.module.scss";
import { PanelButton } from "./subComponents/PanelButton/PanelButton";
import { PANEL_NAVIGATION_BUTTON } from "./subComponents/PanelButton/PanelButton.constants";

interface PanelNavigationProps {
  asListItems?: boolean;
  isNavigationWide?: boolean;
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
    return (
      <>
        <li className={styles.panelNavigation_item}>{commonItem}</li>
      </>
    );
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
