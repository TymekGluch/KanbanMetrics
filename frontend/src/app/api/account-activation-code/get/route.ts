import { type GetApiAccountActivationCodeGetSuccessResponse } from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";
import { ApiClient, ApiError } from "@/utils/api/apiClient";

export async function GET(request: Request) {
  const backendBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!backendBaseUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[account/activation-code proxy] missing API base URL env, returning null");
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
    const response = await apiClient.get<GetApiAccountActivationCodeGetSuccessResponse>(
      "/api/account-activation-code/get",
      undefined,
      {
        next: { tags: [nextFetchTags.accountActivationCode] },
      }
    );

    return Response.json(response.data, { status: 200 });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return Response.json(null, { status: 200 });
    }

    if (process.env.NODE_ENV !== "production") {
      console.warn("[account/activation-code proxy] returning null due to upstream error", error);
    }

    return Response.json(null, { status: 200 });
  }
}
