"use client";

import { ChartSvg } from "@/assets/ChartSvg";
import { EyeSvg } from "@/assets/EyeSvg";
import { PlusSvg } from "@/assets/PlusSvg";
import { PuzzleSvg } from "@/assets/PuzzleSvg";
import { SettingsSvg } from "@/assets/SettingsSvg";
import { WorkspacesContext } from "@/providers/WorkspacesProvider/WorkspacesProvider";
import { usePathname } from "next/navigation";
import React from "react";
import z from "zod";
import CreateWorkspaceButton from "../CrateWorkspaceButton";
import { PageLayoutPanelContext } from "../PageLayout/PageLayoutPanel/context";
import { type SelectOption } from "../Select/Select.types";
import styles from "./PanelNavigation.module.scss";
import { getCurrentWorkspacePaths, sortWorkspaces } from "./PanelNavigation.utils";
import { NavigationSelect } from "./subComponents/NavigationSelect/NavigationSelect";
import { PanelButton } from "./subComponents/PanelButton/PanelButton";
import { PANEL_NAVIGATION_BUTTON } from "./subComponents/PanelButton/PanelButton.constants";
import { Separator } from "../Separator/Separator";
import { pxToRem } from "@/utils/pxToRem";
import { useResponsiveProp } from "@/responsive/hooks/useResponsive";
import { CloudArrowUpSvg } from "@/assets/CloadArrowUp";

interface PanelNavigationProps {
  asListItems?: boolean;
  isNavigationWide?: boolean;
  currentWorkspace?: Record<"id" | "name", string>;
}

interface CommonItemsProps extends React.PropsWithChildren {
  asListItems?: boolean;
}

function CommonItemWrapper(props: CommonItemsProps) {
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
      {currentWorkspace && (
        <>
          <CommonItemWrapper asListItems={asListItems}>
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
          </CommonItemWrapper>
          <CommonItemWrapper asListItems={asListItems}>
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
          </CommonItemWrapper>
          <CommonItemWrapper asListItems={asListItems}>
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
          </CommonItemWrapper>

          <CommonItemWrapper asListItems={asListItems}>
            <Separator
              marginY={pxToRem(8)}
              width={{
                default: "80%",
                md: "100%",
              }}
            />
          </CommonItemWrapper>

          <CommonItemWrapper asListItems={asListItems}>
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
          </CommonItemWrapper>
        </>
      )}
    </>
  );
}

export function PanelNavigation(props: PanelNavigationProps) {
  const { asListItems = false } = props;

  const { workspaces, currentWorkspace, setCurrentWorkspace } = React.useContext(WorkspacesContext);
  const pathName = usePathname();
  const { isWide } = React.useContext(PageLayoutPanelContext);

  const shouldDisplayWorkspace = useResponsiveProp({
    default: false,
    md: true,
  });

  const sortedWorkspaces = sortWorkspaces(workspaces?.items ?? []);
  const resolvedWorkspaceId =
    pathName
      .split("/")
      .find((segment) => z.uuid().safeParse(segment).success)
      ?.toString() ?? sortedWorkspaces?.[0]?.id;
  const resolvedWorkspaceNameFromId = workspaces?.items?.find(
    (workspace) => workspace.id === resolvedWorkspaceId
  )?.name;

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
          <>
            <li className={styles.panelNavigation_item}>
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
            </li>

            {shouldDisplayWorkspace && (
              <>
                <li className={styles.panelNavigation_item}>
                  <Separator marginY={pxToRem(8)} />
                </li>

                <li className={styles.panelNavigation_item}>{createWorkspaceItem}</li>
              </>
            )}
          </>
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
      </li>

      {shouldDisplayWorkspace && (
        <>
          <li className={styles.panelNavigation_item}>
            <Separator marginY={pxToRem(8)} />
          </li>

          <li className={styles.panelNavigation_item}>
            <NavigationSelect
              isSideMenuWide={isWide}
              label="Select a workspace"
              options={options}
              value={currentWorkspace?.id}
              withSearch={options.length > 5}
              onChoose={(option) => {
                setCurrentWorkspace?.({ id: option.value, name: option.label });
              }}
            />
          </li>
        </>
      )}

      <CommonItems
        asListItems={asListItems}
        currentWorkspace={{
          id: currentWorkspace?.id ?? resolvedWorkspaceId ?? "",
          name: currentWorkspace?.name ?? resolvedWorkspaceNameFromId ?? "",
        }}
      />
    </>
  );
}
