import { type GetApiWorkspacesIdSuccessResponse } from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";
import { redirect } from "next/navigation";

const fiveMinutesInSeconds = 5 * 60;

export async function getWorkspaceByIdFetch(
  headersList: Headers,
  workspaceId: string
): Promise<GetApiWorkspacesIdSuccessResponse | null> {
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

  if (!host) return null;

  try {
    const response = await fetch(`${protocol}://${host}/api/workspaces/${workspaceId}`, {
      headers: {
        cookie: headersList.get("cookie") ?? "",
      },
      next: {
        revalidate: fiveMinutesInSeconds,
        tags: [nextFetchTags.workspaces, nextFetchTags.workspace(workspaceId)],
      },
    });

    if (!response.ok) return null;

    const workspace: GetApiWorkspacesIdSuccessResponse | null = await response.json();

    return workspace;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[RootLayout] failed to fetch workspace ${workspaceId} via /api/workspaces/${workspaceId}`,
        error
      );

      redirect("/dashboard");
    }

    return null;
  }
}
