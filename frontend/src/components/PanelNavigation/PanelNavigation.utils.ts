import { type GetApiWorkspacesSuccessResponse } from "@/generated/api-aliases";

type Workspaces = GetApiWorkspacesSuccessResponse["items"];

export function sortWorkspaces(workspaces: Workspaces) {
  return [...(workspaces ?? [])].sort((previous, next) => {
    if (previous.updated_at && !next.updated_at) {
      return -1;
    }

    if (!previous.updated_at && next.updated_at) {
      return 1;
    }

    if (previous.updated_at && next.updated_at) {
      return new Date(next.updated_at).getTime() - new Date(previous.updated_at).getTime();
    }

    const nextCreatedAt = next.created_at ?? 0;
    const prevCreatedAt = previous.created_at ?? 0;

    return new Date(nextCreatedAt).getTime() - new Date(prevCreatedAt).getTime();
  });
}
