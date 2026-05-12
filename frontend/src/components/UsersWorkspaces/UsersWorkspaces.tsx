"use client";

import { EyeSvg } from "@/assets/EyeSvg";
import { WorkspacesContext } from "@/providers/WorkspacesProvider/WorkspacesProvider";
import { COLORS } from "@/theme/theme.constants";
import { pxToRem } from "@/utils/pxToRem";
import React from "react";
import { Base } from "../Base/Base";
import Button from "../Button";
import { Hidden } from "../Hidden/Hidden";
import styles from "./UsersWorkspaces.module.scss";
import { Avatar, AVATAR_COLORS, AVATAR_SHAPES, AVATAR_STATUS_COLORS } from "../Avatar";

export function UsersWorkspaces() {
  const { workspaces: unresolvedWorkspaces } = React.useContext(WorkspacesContext);
  const workspaces = unresolvedWorkspaces?.items ?? [];

  return (
    <>
      {workspaces.length ? (
        <ul className={styles.usersWorkspaces}>
          {workspaces.map((workspace) => {
            const workspaceName = workspace.name?.trim() || "Workspace";

            return (
              <li key={workspace.id} className={styles.usersWorkspaces_listItem}>
                <section className={styles.usersWorkspaces_listItemContent}>
                  <div className={styles.usersWorkspaces_listItemIdentity}>
                    <Avatar
                      name={workspaceName}
                      shape={AVATAR_SHAPES.SQUARE}
                      avatarColor={AVATAR_COLORS.VIOLET}
                      width={{ base: 44, md: 52 }}
                      height={{ base: 44, md: 52 }}
                    />

                    <Base
                      as="h3"
                      color={COLORS.TEXT_SECONDARY}
                      fontSize={pxToRem(14)}
                      fontWeight={600}
                    >
                      {workspaceName}
                    </Base>
                  </div>
                  <Button.AsLink
                    href={`/dashboard/workspaces/${workspace.id}`}
                    className={styles.usersWorkspaces_listItemButton}
                    variant="outlined"
                  >
                    <EyeSvg className={styles.usersWorkspaces_listItemIcon} />
                    <Hidden>go to workspace {workspaceName}</Hidden>
                  </Button.AsLink>
                </section>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={styles.usersWorkspaces_empty}>
          <Base as="p" color={COLORS.TEXT_SECONDARY} fontSize={pxToRem(12)}>
            You don&apos;t have any workspaces yet.
          </Base>
        </div>
      )}
    </>
  );
}
