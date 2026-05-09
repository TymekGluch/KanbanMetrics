import { getUserFetch } from "@/api/getUserFetch";
import PageLayoutPanel from "@/components/PageLayout/PageLayoutPanel";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type React from "react";

export default async function AuthLayout(props: React.PropsWithChildren) {
  const { children } = props;

  const headersList = await headers();
  const user = await getUserFetch(headersList);

  if (!user) {
    redirect("/auth/login");
  }

  return <PageLayoutPanel.Provider>{children}</PageLayoutPanel.Provider>;
}
