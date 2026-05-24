import { getWorkspaceByIdFetch } from "@/api/getWorkspaceByIdFetch";
import { headers } from "next/headers";
import type { Metadata } from "next";
import PageLayoutPanel from "@/components/PageLayout/PageLayoutPanel";
import { Base } from "@/components/Base/Base";
import { pxToRem } from "@/utils/pxToRem";
import { COLORS } from "@/theme/theme.constants";
import { PanelNavigation } from "@/components/PanelNavigation/PanelNavigation";
import { DeleteWorkspaceButton } from "@/components/DeleteWorkspaceButton/DeleteWorkspaceButton";
import styles from "./page.module.scss";
import { Separator } from "@/components/Separator/Separator";

interface WorkspacePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: WorkspacePageProps): Promise<Metadata> {
  const { params } = props;
  const { id } = await params;
  const headersList = await headers();
  const workspace = await getWorkspaceByIdFetch(headersList, id);

  const workspaceName = workspace?.name
    ? `${workspace?.name?.trim()} - Settings`
    : "Workspace Settings";

  return {
    title: workspaceName,
    description:
      "Manage workspace settings, including deletion and other critical actions. Please proceed with caution when making changes in this section.",
  };
}

export default async function WorkspaceSettingsPage(props: WorkspacePageProps) {
  const { params } = props;

  const { id } = await params;
  const headersList = await headers();
  const workspace = await getWorkspaceByIdFetch(headersList, id);

  const workspaceName = workspace?.name
    ? `${workspace?.name?.trim()} - Settings`
    : "Workspace Settings";
  const description =
    "Manage workspace settings, including deletion and other critical actions. Please proceed with caution when making changes in this section.";

  return (
    <PageLayoutPanel.Provider>
      <PageLayoutPanel.Root>
        <PageLayoutPanel.TopNavigationMobile />
        <PageLayoutPanel.NavigationContent>
          <PanelNavigation asListItems />
        </PageLayoutPanel.NavigationContent>
        <PageLayoutPanel.Header>
          <Base as="h1" fontSize={pxToRem(24)}>
            {workspaceName}
          </Base>

          <Base as="p" fontSize={pxToRem(12)} color={COLORS.TEXT_SECONDARY} textWrap="balance">
            {description}
          </Base>
        </PageLayoutPanel.Header>

        <PageLayoutPanel.Details className={styles.pageLayoutPanelDetails}>
          <section></section>
          <section className={styles.pageLayoutPanelDetails_dangerZone}>
            <div className={styles.pageLayoutPanelDetails_dangerZoneHeader}>
              <Base as="h2" fontSize={pxToRem(18)} color={COLORS.STATUS_DANGER_TEXT}>
                Danger Zone
              </Base>

              <Base as="p" fontSize={pxToRem(12)} textWrap="balance">
                Actions in this section can have irreversible consequences. Please proceed with
                caution.
              </Base>
            </div>

            <Separator background={COLORS.STATUS_DANGER_BORDER} />

            <div className={styles.pageLayoutPanelDetails_dangerZoneContent}>
              <ul className={styles.pageLayoutPanelDetails_dangerZoneList}>
                <li className={styles.pageLayoutPanelDetails_dangerZoneListItem}>
                  <section className={styles.pageLayoutPanelDetails_dangerZoneListContent}>
                    <Base as="h3" fontSize={pxToRem(14)} color={COLORS.STATUS_DANGER_TEXT}>
                      Deleting a workspace is irreversible. Please proceed with caution.
                    </Base>

                    <Base as="p" fontSize={pxToRem(12)} textWrap="balance">
                      When you delete a workspace, all associated data, including projects, tasks,
                      and member information, will be permanently removed. This action cannot be
                      undone.
                    </Base>

                    <DeleteWorkspaceButton marginTop={pxToRem(8)}>
                      Delete Workspace
                    </DeleteWorkspaceButton>
                  </section>
                </li>

                <li className={styles.pageLayoutPanelDetails_dangerZoneListItem}></li>
              </ul>
            </div>
          </section>
        </PageLayoutPanel.Details>
      </PageLayoutPanel.Root>
    </PageLayoutPanel.Provider>
  );
}
