"use client";

import { refreshServerFetchAction } from "@/actions/refreshServerFetch";
import {
  type PostApiWorkspacesCreateRequestBody,
  type PostApiWorkspacesCreateSuccessResponse,
} from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";
import { ApiClient, type ApiError } from "@/utils/api/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useCreateWorkspaceMutationFetch() {
  const router = useRouter();

  return useMutation<
    PostApiWorkspacesCreateSuccessResponse,
    ApiError,
    PostApiWorkspacesCreateRequestBody
  >({
    mutationKey: ["workspaces", "create"],
    mutationFn: async (payload) => {
      const response = await apiClient.post<
        PostApiWorkspacesCreateSuccessResponse,
        PostApiWorkspacesCreateRequestBody
      >("/api/workspaces/create", payload);

      return response.data;
    },
    onSuccess: async () => {
      await refreshServerFetchAction(nextFetchTags.workspaces);

      router.refresh();
    },
    onError: async () => {
      const isProduction = process.env.NODE_ENV === "production";

      if (!isProduction) {
        console.warn("Create workspace failed, refreshing to update the state just in case...");
      }
    },
  });
}
