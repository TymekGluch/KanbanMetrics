"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiClient, type ApiError } from "@/utils/api/apiClient";
import {
  type PostApiAuthLoginRequestBody,
  type PostApiAuthLoginSuccessResponse,
} from "@/generated/api-aliases";
import { refreshServerFetchAction } from "@/actions/refreshServerFetch";
import { nextFetchTags } from "@/nextFetchTags";
import { useRouter } from "next/navigation";

interface Payload extends PostApiAuthLoginRequestBody {
  turnstileToken: string;
}

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useLoginMutationFetch() {
  const router = useRouter();

  return useMutation<PostApiAuthLoginSuccessResponse, ApiError, Payload>({
    mutationKey: ["auth", "login"],
    mutationFn: async (payload) => {
      const { turnstileToken, ...body } = payload;

      apiClient.appendHeaders({
        "X-Turnstile-Token": turnstileToken,
      });

      const response = await apiClient.post<PostApiAuthLoginSuccessResponse, typeof body>(
        "/api/auth/login",
        body
      );

      return response.data;
    },
    onSuccess: async () => {
      await refreshServerFetchAction(nextFetchTags.me);

      router.refresh();
    },
  });
}
