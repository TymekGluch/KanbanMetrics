import { type GetApiUserMeSuccessResponse } from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";
import { ApiClient } from "@/utils/api/apiClient";

export async function GET(request: Request) {
  const backendBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!backendBaseUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[auth/me proxy] missing API base URL env, returning null");
    }

    return Response.json(null, { status: 200 });
  }

  const apiClient = new ApiClient({
    baseURL: backendBaseUrl,
    defaultHeaders: {
      "Content-Type": "application/json",
      cookie: request.headers.get("cookie") ?? "",
    },
  });

  try {
    const response = await apiClient.get<GetApiUserMeSuccessResponse>("/api/user/me", {
      next: { tags: [nextFetchTags.me] },
    });
    return Response.json(response.data, { status: response.status });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[auth/me proxy] returning null due to upstream error", error);
    }

    return Response.json(null, { status: 200 });
  }
}
