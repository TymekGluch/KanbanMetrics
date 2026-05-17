import { getWorkspaceByIdFetch } from "@/api/getWorkspaceByIdFetch";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type React from "react";
import z from "zod";

interface LayoutProps extends React.PropsWithChildren {
  params: Promise<{
    id: string;
  }>;
}

const workspaceIdSchema = z.uuid();

export default async function WorkspacesLayout(props: LayoutProps) {
  const { children, params } = props;

  const resolvedParams = await params;
  const isValidWorkspaceId = workspaceIdSchema.safeParse(resolvedParams.id).success;

  if (!isValidWorkspaceId) {
    notFound();
  }

  const headersList = await headers();
  const workspace = await getWorkspaceByIdFetch(headersList, resolvedParams.id);

  if (!workspace) {
    notFound();
  }

  return <>{children}</>;
}
