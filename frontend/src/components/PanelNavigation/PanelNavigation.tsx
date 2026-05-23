"use client";

import { PlusSvg } from "@/assets/PlusSvg";
import { PuzzleSvg } from "@/assets/PuzzleSvg";
import { WorkspacesContext } from "@/providers/WorkspacesProvider/WorkspacesProvider";
import React from "react";
import CreateWorkspaceButton from "../CrateWorkspaceButton";
import { Select } from "../Select/Select";
import { type SelectOption } from "../Select/Select.types";
import styles from "./PanelNavigation.module.scss";
import { getCurrentWorkspacePaths, sortWorkspaces } from "./PanelNavigation.utils";
import { PanelButton } from "./subComponents/PanelButton/PanelButton";
import { PANEL_NAVIGATION_BUTTON } from "./subComponents/PanelButton/PanelButton.constants";
import { usePathname } from "next/navigation";
import z, { set } from "zod";
import { NavigationSelect } from "./subComponents/NavigationSelect/NavigationSelect";
import { PageLayoutPanelContext } from "../PageLayout/PageLayoutPanel/context";
import { EyeSvg } from "@/assets/EyeSvg";
import { SettingsSvg } from "@/assets/SettingsSvg";
import { ChartSvg } from "@/assets/ChartSvg";
import { UploadSvg } from "@/assets/UploadSvg";
import { CloudArrowUpSvg } from "@/assets/CloadArrowUp";

interface PanelNavigationProps {
  asListItems?: boolean;
  isNavigationWide?: boolean;
  currentWorkspace?: Record<"id" | "name", string>;
}

interface CommonItemsProps extends React.PropsWithChildren {
  asListItems?: boolean;
}

function CommonItemWrpper(props: CommonItemsProps) {
  const { asListItems = false, children } = props;

  if (asListItems) {
    return <li className={styles.panelNavigation_item}>{children}</li>;
  }

  return <>{children}</>;
}

function CommonItems(props: PanelNavigationProps) {
  const { asListItems = false, currentWorkspace } = props;

  return (
    <>
      <CommonItemWrpper asListItems={asListItems}>
        <PanelButton
          polymorphicButtonProps={{
            polymorphicVariant: PANEL_NAVIGATION_BUTTON.NEXT_LINK,
            href: "/dashboard",
            variant: "outlined",
            title: "Overview",
          }}
          StartIconSlot={<PuzzleSvg />}
          text="Overview"
        />
      </CommonItemWrpper>
      <CommonItemWrpper asListItems={asListItems}>
        <PanelButton
          polymorphicButtonProps={{
            polymorphicVariant: PANEL_NAVIGATION_BUTTON.NEXT_LINK,
            href: getCurrentWorkspacePaths(currentWorkspace?.id).currentWorkspace,
            variant: "outlined",
            title: `Go to workspace: ${currentWorkspace?.name}`,
          }}
          StartIconSlot={<EyeSvg />}
          text="Go to workspace"
        />
      </CommonItemWrpper>
      <CommonItemWrpper asListItems={asListItems}>
        <PanelButton
          polymorphicButtonProps={{
            polymorphicVariant: PANEL_NAVIGATION_BUTTON.NEXT_LINK,
            href: getCurrentWorkspacePaths(currentWorkspace?.id).currentWorkspaceSettings,
            variant: "outlined",
            title: `Workspace settings: ${currentWorkspace?.name}`,
          }}
          StartIconSlot={<SettingsSvg />}
          text="Workspace settings"
        />
      </CommonItemWrpper>
      <CommonItemWrpper asListItems={asListItems}>
        <PanelButton
          polymorphicButtonProps={{
            polymorphicVariant: PANEL_NAVIGATION_BUTTON.NEXT_LINK,
            href: getCurrentWorkspacePaths(currentWorkspace?.id).currentWorkspaceAnalytics,
            variant: "outlined",
            title: `Workspace Analytics: ${currentWorkspace?.name}`,
          }}
          StartIconSlot={<ChartSvg />}
          text="Analytics"
        />
      </CommonItemWrpper>
      <CommonItemWrpper asListItems={asListItems}>
        <PanelButton
          polymorphicButtonProps={{
            polymorphicVariant: PANEL_NAVIGATION_BUTTON.NEXT_LINK,
            href: getCurrentWorkspacePaths(currentWorkspace?.id).currentWorkspaceUploadedFiles,
            variant: "outlined",
            title: `Workspace Uploaded Files: ${currentWorkspace?.name}`,
          }}
          StartIconSlot={<CloudArrowUpSvg />}
          text="Uploaded Files"
        />
      </CommonItemWrpper>
    </>
  );
}

export function PanelNavigation(props: PanelNavigationProps) {
  const { asListItems = false } = props;

  const { workspaces } = React.useContext(WorkspacesContext);
  const pathName = usePathname();
  const { isWide } = React.useContext(PageLayoutPanelContext);

  const sortedWorkspaces = sortWorkspaces(workspaces?.items ?? []);
  const resolvedWorkspaceId =
    pathName
      .split("/")
      .find((segment) => z.uuid().safeParse(segment).success)
      ?.toString() ?? sortedWorkspaces?.[0]?.id;
  const resolvedWorkspaceNameFromId = workspaces?.items?.find(
    (workspace) => workspace.id === resolvedWorkspaceId
  )?.name;

  const [currentWorkspace, setCurrentWorkspace] = React.useState<{
    name: string;
    id: string;
  }>(
    resolvedWorkspaceId
      ? { id: resolvedWorkspaceId, name: resolvedWorkspaceNameFromId ?? "" }
      : { id: "", name: "" }
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
        title: "Create a new workspace",
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
          value={currentWorkspace.id}
          withSearch={options.length > 5}
          onChoose={(option) => {
            setCurrentWorkspace({ id: option.value, name: option.label });
          }}
        />
      </li>

      <CommonItems asListItems={asListItems} currentWorkspace={currentWorkspace} />
    </>
  );
}
