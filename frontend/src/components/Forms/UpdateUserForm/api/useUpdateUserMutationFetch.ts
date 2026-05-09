"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiClient, type ApiError } from "@/utils/api/apiClient";
import {
  type PutApiUserUpdateRequestBody,
  type PutApiUserUpdateSuccessResponse,
} from "@/generated/api-aliases";
import { refreshServerFetchAction } from "@/actions/refreshServerFetch";
import { useRouter } from "next/navigation";
import { nextFetchTags } from "@/nextFetchTags";

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useUpdateUserMutationFetch() {
  const router = useRouter();

  return useMutation<PutApiUserUpdateSuccessResponse, ApiError, PutApiUserUpdateRequestBody>({
    mutationKey: ["user", "update"],
    mutationFn: async (payload) => {
      const response = await apiClient.put<
        PutApiUserUpdateSuccessResponse,
        PutApiUserUpdateRequestBody
      >("/api/user/update", payload);

      return response.data;
    },
    onSuccess: async () => {
      await refreshServerFetchAction(nextFetchTags.me);

      router.refresh();
    },
  });
}
