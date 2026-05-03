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

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useLoginMutationFetch() {
  const router = useRouter();

  return useMutation<PostApiAuthLoginSuccessResponse, ApiError, PostApiAuthLoginRequestBody>({
    mutationKey: ["auth", "login"],
    mutationFn: async (payload) => {
      const response = await apiClient.post<
        PostApiAuthLoginSuccessResponse,
        PostApiAuthLoginRequestBody
      >("/api/auth/login", payload);

      return response.data;
    },
    onSuccess: async () => {
      await refreshServerFetchAction(nextFetchTags.me);

      router.refresh();
    },
  });
}
