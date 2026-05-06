import PageLayoutPanel from "@/components/PageLayout/PageLayoutPanel";
import styles from "./page.module.scss";

export default function DashboardPage() {
  return (
    <PageLayoutPanel.Provider>
      <PageLayoutPanel.Root>
        <PageLayoutPanel.TopNavigationMobile />
      </PageLayoutPanel.Root>
    </PageLayoutPanel.Provider>
  );
}
