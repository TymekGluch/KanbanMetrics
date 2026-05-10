"use client";

import { type GetApiWorkspacesSuccessResponse } from "@/generated/api-aliases";
import React from "react";

type Workspaces = GetApiWorkspacesSuccessResponse;

interface WorkspacesContext {
  workspaces: Workspaces | null;
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspaces | null>> | null;
}

export const WorkspacesContext = React.createContext<WorkspacesContext>({
  workspaces: null,
  setWorkspaces: null,
});

interface WorkspacesProviderProps extends React.PropsWithChildren {
  workspaces: Workspaces | null;
}

export function WorkspacesProvider(props: WorkspacesProviderProps) {
  const { workspaces, children } = props;

  const [localWorkspaces, setLocalWorkspaces] = React.useState<Workspaces | null>(workspaces);

  React.useEffect(() => {
    setLocalWorkspaces(workspaces);
  }, [workspaces]);

  return (
    <WorkspacesContext.Provider
      value={{ workspaces: localWorkspaces, setWorkspaces: setLocalWorkspaces }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
}
