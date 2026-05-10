import { Base } from "@/components/Base/Base";
import PageLayoutPanel from "@/components/PageLayout/PageLayoutPanel";
import { PanelNavigation } from "@/components/PanelNavigation/PanelNavigation";
import { COLORS } from "@/theme/theme.constants";
import { pxToRem } from "@/utils/pxToRem";

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
      </PageLayoutPanel.Root>
    </PageLayoutPanel.Provider>
  );
}
