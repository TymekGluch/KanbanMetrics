import { Base } from "@/components/Base/Base";
import PageLayoutPanel from "@/components/PageLayout/PageLayoutPanel";
import { PanelNavigation } from "@/components/PanelNavigation/PanelNavigation";
import { COLORS } from "@/theme/theme.constants";
import { pxToRem } from "@/utils/pxToRem";
import styles from "./page.module.scss";
import { UsersWorkspaces } from "@/components/UsersWorkspaces/UsersWorkspaces";
import Button from "@/components/Button";
import CreateWorkspaceButton from "@/components/CrateWorkspaceButton";
import { PlusSvg } from "@/assets/PlusSvg";
import { Media } from "@/components/Media";
import { Hidden } from "@/components/Hidden/Hidden";
import { MEDIA_CONDITION } from "@/components/Media/Media.constants";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";

export const metadata = {
  title: "Overview - Morphyxis Kanban Metrics",
  description:
    "Welcome to your dashboard! Here you can upload your Kanban data, view detailed metrics, and gain insights to optimize your workflow performance.",
};

export default function DashboardPage() {
  return (
    <PageLayoutPanel.Provider>
      <PageLayoutPanel.Root>
        <PageLayoutPanel.TopNavigationMobile />
        <PageLayoutPanel.NavigationContent>
          <PanelNavigation asListItems />
        </PageLayoutPanel.NavigationContent>
        <PageLayoutPanel.Header>
          <Base as="h1" fontSize={pxToRem(24)}>
            Welcome to your Overview
          </Base>

          <Base as="p" fontSize={pxToRem(12)} color={COLORS.TEXT_SECONDARY} textWrap="balance">
            overview of your account and access your personalized metrics and insights.
          </Base>
        </PageLayoutPanel.Header>

        <PageLayoutPanel.Details>
          <div className={styles.overviewContent}>
            <section className={styles.overviewContent_workspaces}>
              <div className={styles.overviewContent_workspacesHeader}>
                <div className={styles.overviewContent_textContent}>
                  <Base as="h2" fontSize={pxToRem(18)}>
                    Your Workspaces
                  </Base>

                  <Base
                    as="p"
                    fontSize={pxToRem(12)}
                    color={COLORS.TEXT_SECONDARY}
                    textWrap="balance"
                  >
                    Manage your workspaces and access your personalized metrics and insights.
                  </Base>
                </div>

                <CreateWorkspaceButton.CommonButton
                  minWidth={{
                    default: "fit-content",
                    [BREAKPOINTS_KEYS.md]: pxToRem(140),
                  }}
                  StartIconSlot={<PlusSvg className={styles.overviewContent_icon} />}
                >
                  <Media.Client
                    variant={MEDIA_CONDITION.BREAKPOINTS}
                    condition={{
                      [BREAKPOINTS_KEYS.md]: true,
                    }}
                    Fallback={<Hidden>Create new workspace</Hidden>}
                  >
                    Create new workspace
                  </Media.Client>
                </CreateWorkspaceButton.CommonButton>
              </div>

              <div>
                <UsersWorkspaces />
              </div>
            </section>
          </div>
        </PageLayoutPanel.Details>
      </PageLayoutPanel.Root>
    </PageLayoutPanel.Provider>
  );
}
