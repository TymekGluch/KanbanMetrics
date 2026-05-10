import { getUserFetch } from "@/api/getUserFetch";
import { getWorkspacesFetch } from "@/api/getWorkspacesFetch";
import PageLayoutPanel from "@/components/PageLayout/PageLayoutPanel";
import { WorkspacesProvider } from "@/providers/WorkspacesProvider/WorkspacesProvider";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type React from "react";

export default async function AuthLayout(props: React.PropsWithChildren) {
  const { children } = props;

  const headersList = await headers();
  const user = await getUserFetch(headersList);
  const workspaces = await getWorkspacesFetch(headersList);

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <WorkspacesProvider workspaces={workspaces}>
      <PageLayoutPanel.Provider>{children}</PageLayoutPanel.Provider>
    </WorkspacesProvider>
  );
}
