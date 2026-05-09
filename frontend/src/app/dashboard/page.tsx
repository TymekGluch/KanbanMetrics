import PageLayoutPanel from "@/components/PageLayout/PageLayoutPanel";

export const metadata = {
  title: "Dashboard - Morphyxis Kanban Metrics",
  description:
    "Welcome to your dashboard! Here you can upload your Kanban data, view detailed metrics, and gain insights to optimize your workflow performance.",
};

export default function DashboardPage() {
  return (
    <PageLayoutPanel.Provider>
      <PageLayoutPanel.Root>
        <PageLayoutPanel.TopNavigationMobile />
        <PageLayoutPanel.NavigationContent />
      </PageLayoutPanel.Root>
    </PageLayoutPanel.Provider>
  );
}
