"use client";

import { WorkspacesContext } from "@/providers/WorkspacesProvider/WorkspacesProvider";
import { COLORS } from "@/theme/theme.constants";
import { pxToRem } from "@/utils/pxToRem";
import React from "react";
import { Avatar, AVATAR_COLORS, AVATAR_SHAPES } from "../Avatar";
import { Base } from "../Base/Base";
import Link from "../Link";
import styles from "./UsersWorkspaces.module.scss";
import { Separator } from "../Separator/Separator";
import { ClockSvg } from "@/assets/ClockSvg";
import { getRemainingTimeOfLastUpdate } from "./UsersWorkspaces.utils";

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
                  <header className={styles.usersWorkspaces_listItemHeader}>
                    <Avatar
                      name={workspaceName}
                      shape={AVATAR_SHAPES.SQUARE}
                      avatarColor={AVATAR_COLORS.DEFAULT}
                      width={{ base: 44, md: 52 }}
                      height={{ base: 44, md: 52 }}
                    />

                    <div className={styles.usersWorkspaces_listItemTexts}>
                      <Base
                        as="h3"
                        color={COLORS.TEXT_SECONDARY}
                        fontSize={pxToRem(16)}
                        fontWeight={600}
                      >
                        {workspaceName}
                      </Base>

                      {Boolean(workspace.description) && (
                        <Base as="p" color={COLORS.TEXT_TERTIARY} fontSize={pxToRem(12)}>
                          {workspace.description}
                        </Base>
                      )}
                    </div>
                  </header>
                  <Separator background={COLORS.DIVIDER_SUBTLE} />
                  <div className={styles.usersWorkspaces_footer}>
                    <div className={styles.usersWorkspaces_footerInfo}>
                      <ClockSvg className={styles.usersWorkspaces_footerIcon} />
                      <Base as="p" color={COLORS.TEXT_TERTIARY} fontSize={pxToRem(12)}>
                        created at:{" "}
                        <strong>{new Date(`${workspace.created_at}`).toLocaleDateString()}</strong>
                      </Base>
                    </div>

                    <div className={styles.usersWorkspaces_footerInfo}>
                      <ClockSvg className={styles.usersWorkspaces_footerIcon} />
                      <Base as="p" color={COLORS.TEXT_TERTIARY} fontSize={pxToRem(12)}>
                        updated:{" "}
                        <strong>{getRemainingTimeOfLastUpdate(workspace.updated_at)}</strong>
                      </Base>
                    </div>

                    <Link.AsNextLink
                      href={`/dashboard/workspaces/${workspace.id}`}
                      className={styles.usersWorkspaces_listItemButton}
                      marginLeft="auto"
                    >
                      See workspace
                    </Link.AsNextLink>
                  </div>
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
