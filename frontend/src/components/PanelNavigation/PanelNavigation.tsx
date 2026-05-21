"use client";

import { PlusSvg } from "@/assets/PlusSvg";
import { PuzzleSvg } from "@/assets/PuzzleSvg";
import { WorkspacesContext } from "@/providers/WorkspacesProvider/WorkspacesProvider";
import React from "react";
import CreateWorkspaceButton from "../CrateWorkspaceButton";
import { Select } from "../Select/Select";
import { type SelectOption } from "../Select/Select.types";
import styles from "./PanelNavigation.module.scss";
import { sortWorkspaces } from "./PanelNavigation.utils";
import { PanelButton } from "./subComponents/PanelButton/PanelButton";
import { PANEL_NAVIGATION_BUTTON } from "./subComponents/PanelButton/PanelButton.constants";
import { usePathname } from "next/navigation";
import z from "zod";
import { NavigationSelect } from "./subComponents/NavigationSelect/NavigationSelect";
import { PageLayoutPanelContext } from "../PageLayout/PageLayoutPanel/context";

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
  const pathName = usePathname();
  const { isWide } = React.useContext(PageLayoutPanelContext);

  const sortedWorkspaces = sortWorkspaces(workspaces?.items ?? []);
  const resolvedWorkspaceId = pathName
    .split("/")
    .find((segment) => z.uuid().safeParse(segment).success)
    ?.toString();

  const [currentWorkspace, setCurrentWorkspace] = React.useState<string>(
    resolvedWorkspaceId ?? sortedWorkspaces[0]?.id ?? ""
  );

  const workspacesItems = sortedWorkspaces ?? [];

  const options: Array<SelectOption> = workspacesItems.map((workspaces) => ({
    label: workspaces.name ?? "",
    value: workspaces.id ?? "",
  }));

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
        {asListItems ? (
          <li className={styles.panelNavigation_item}>{createWorkspaceItem}</li>
        ) : (
          createWorkspaceItem
        )}

        <CommonItems asListItems={asListItems} />
      </>
    );
  }

  return (
    <>
      <li className={styles.panelNavigation_item}>
        <NavigationSelect
          isSideMenuWide={isWide}
          label="Select a workspace"
          options={options}
          value={currentWorkspace}
          withSearch={options.length > 5}
          onChoose={(option) => setCurrentWorkspace(option.value)}
        />
      </li>

      <CommonItems asListItems={asListItems} />
    </>
  );
}
