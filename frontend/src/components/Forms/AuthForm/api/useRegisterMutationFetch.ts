"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiClient, type ApiError } from "@/utils/api/apiClient";
import {
  type PostApiAuthRegisterRequestBody,
  type PostApiAuthRegisterSuccessResponse,
} from "@/generated/api-aliases";
import { refreshServerFetchAction } from "@/actions/refreshServerFetch";
import { useRouter } from "next/navigation";
import { nextFetchTags } from "@/nextFetchTags";

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useRegisterMutationFetch() {
  const router = useRouter();

  return useMutation<PostApiAuthRegisterSuccessResponse, ApiError, PostApiAuthRegisterRequestBody>({
    mutationKey: ["auth", "register"],
    mutationFn: async (payload) => {
      const response = await apiClient.post<
        PostApiAuthRegisterSuccessResponse,
        PostApiAuthRegisterRequestBody
      >("/api/auth/register", payload);

      return response.data;
    },
    onSuccess: async () => {
      await refreshServerFetchAction(nextFetchTags.me);

      router.refresh();
    },
  });
}
