"use client";

import { refreshServerFetchAction } from "@/actions/refreshServerFetch";
import { type DeleteApiUserDeleteSuccessResponse } from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";
import { ApiClient, type ApiError } from "@/utils/api/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useDeleteAccountMutationFetch() {
  const router = useRouter();

  return useMutation<DeleteApiUserDeleteSuccessResponse, ApiError, void>({
    mutationKey: ["user", "delete"],
    mutationFn: async () => {
      const response =
        await apiClient.delete<DeleteApiUserDeleteSuccessResponse>("/api/user/delete");

      return response.data;
    },
    onSuccess: async () => {
      await refreshServerFetchAction(nextFetchTags.me);

      router.refresh();
    },
    onError: async () => {
      const isProduction = process.env.NODE_ENV === "production";

      if (!isProduction) {
        console.warn("Delete account failed, please try again...");
      }
    },
  });
}
