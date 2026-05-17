import { WorkspacesContext } from "@/providers/WorkspacesProvider/WorkspacesProvider";
import React from "react";

export function useTransformIdToWorkspaceName() {
  const { workspaces } = React.useContext(WorkspacesContext);

  function transformIdToWorkspaceName(id: string) {
    const workspace = workspaces?.items?.find((workspace) => workspace.id === id);
    const resolvedLabel = workspace ? workspace.name : id;

    return resolvedLabel;
  }

  return { transformIdToWorkspaceName };
}
