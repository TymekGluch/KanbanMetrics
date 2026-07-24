"use client";

import { type GetApiWorkspacesSuccessResponse } from "@/generated/api-aliases";
import { usePathname, redirect } from "next/navigation";
import React from "react";

type Workspaces = GetApiWorkspacesSuccessResponse;
type CurrentWorkspace = NonNullable<Workspaces["items"]>[number];

interface WorkspacesContext {
  workspaces: Workspaces | null;
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspaces | null>> | null;
  currentWorkspace: CurrentWorkspace | null;
  setCurrentWorkspace: React.Dispatch<React.SetStateAction<CurrentWorkspace | null>> | null;
}

export const WorkspacesContext = React.createContext<WorkspacesContext>({
  workspaces: null,
  currentWorkspace: null,
  setCurrentWorkspace: null,
  setWorkspaces: null,
});

interface WorkspacesProviderProps extends React.PropsWithChildren {
  workspaces: Workspaces | null;
}

const workspacesRelatedChunk = "workspaces";

const isWorkspaceUrl = (pathChunk: string[]) => {
  return pathChunk.some((chunk, index, array) => {
    const isWorkspacesChunk = chunk === workspacesRelatedChunk;
    const isNotWorkspacesOverview = array.length > index + 1;

    return isWorkspacesChunk && isNotWorkspacesOverview;
  });
};

export function WorkspacesProvider(props: WorkspacesProviderProps) {
  const { workspaces, children } = props;

  const pathname = usePathname();
  const pathnameChunks = pathname?.split("/") ?? [];
  const pathnameWorkspaceId = pathnameChunks[pathnameChunks.indexOf(workspacesRelatedChunk) + 1];
  const workspacesItems = workspaces?.items;
  const workspace =
    workspacesItems?.find((workspace) => workspace.id === pathnameWorkspaceId) ??
    workspacesItems?.[0] ??
    null;

  const [currentWorkspace, setCurrentWorkspace] = React.useState<CurrentWorkspace | null>(
    workspace
  );

  React.useEffect(() => {
    if (isWorkspaceUrl(pathnameChunks)) {
      if (pathnameWorkspaceId === currentWorkspace?.id) {
        return;
      }

      if (!!currentWorkspace) {
        const restOfPathnameChunks = pathnameChunks
          .slice(pathnameChunks.indexOf(workspacesRelatedChunk) + 2)
          .join("/");

        const resolvedRestOfPathnameChunks = restOfPathnameChunks ? `/${restOfPathnameChunks}` : "";
        const newPathname = `/dashboard/workspaces/${currentWorkspace?.id}${resolvedRestOfPathnameChunks}`;

        redirect(newPathname);
      }
    }
  }, [currentWorkspace]);

  return (
    <WorkspacesContext.Provider
      value={{
        workspaces: workspaces ?? null,
        setWorkspaces: null,
        currentWorkspace,
        setCurrentWorkspace,
      }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
}
