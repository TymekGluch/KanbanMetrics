import PageLayoutPanel from "@/components/PageLayout/PageLayoutPanel";

export default function DashboardPage() {
  return (
    <PageLayoutPanel.Provider>
      <PageLayoutPanel.Root>
        <PageLayoutPanel.TopNavigationMobile />
      </PageLayoutPanel.Root>
    </PageLayoutPanel.Provider>
  );
}
