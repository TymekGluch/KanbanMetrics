import { type GetApiWorkspacesSuccessResponse } from "@/generated/api-aliases";
import { type GetApiWorkspacesBody } from "@/generated/orval/zod/getApiWorkspacesBody.zod";
import { nextFetchTags } from "@/nextFetchTags";
import { ApiClient } from "@/utils/api/apiClient";

export async function GET(request: Request) {
  const backendBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

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
    const requestBody: GetApiWorkspacesBody = {
      only_mine: true,
    };

    const response = await apiClient.get<GetApiWorkspacesSuccessResponse, GetApiWorkspacesBody>(
      "/api/workspaces",
      requestBody,
      {
        next: { tags: [nextFetchTags.workspaces] },
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
