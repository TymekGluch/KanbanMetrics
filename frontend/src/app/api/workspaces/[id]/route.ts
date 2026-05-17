import { type GetApiWorkspacesIdSuccessResponse } from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";
import { ApiClient } from "@/utils/api/apiClient";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, context: RouteContext) {
  const backendBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  const { id } = await context.params;

  if (!backendBaseUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[workspaces proxy] missing API base URL env, returning null");
    }

    return Response.json(null, { status: 200 });
  }

  const apiClient = new ApiClient({
    baseURL: backendBaseUrl,
    defaultHeaders: {
      "Content-Type": "application/json",
      cookie: request.headers.get("cookie") ?? "",
    },
  }).CompleteCredentialsForRestrictedRoutes();

  try {
    const response = await apiClient.get<GetApiWorkspacesIdSuccessResponse>(
      `/api/workspaces/${id}`,
      undefined,
      {
        next: { tags: [nextFetchTags.workspaces, nextFetchTags.workspace(id)] },
      }
    );

    return Response.json(response.data, { status: response.status });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[workspaces proxy] returning null due to upstream error", error);
    }

    return Response.json(null, { status: 200 });
  }
}
