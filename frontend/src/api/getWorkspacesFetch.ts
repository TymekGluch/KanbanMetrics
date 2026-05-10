import { type GetApiWorkspacesSuccessResponse } from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";

const fiveMinutesInSeconds = 5 * 60;

export async function getWorkspacesFetch(
  headersList: Headers
): Promise<GetApiWorkspacesSuccessResponse | null> {
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

  if (!host) return null;

  try {
    const response = await fetch(`${protocol}://${host}/api/workspaces`, {
      headers: {
        cookie: headersList.get("cookie") ?? "",
      },
      next: {
        revalidate: fiveMinutesInSeconds,
        tags: [nextFetchTags.workspaces],
      },
    });

    if (!response.ok) return null;

    const user: GetApiWorkspacesSuccessResponse | null = await response.json();

    return user;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[RootLayout] failed to fetch workspaces via /api/workspaces", error);
    }

    return null;
  }
}
