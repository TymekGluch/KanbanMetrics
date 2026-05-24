"use client";

import { refreshServerFetchAction } from "@/actions/refreshServerFetch";
import { type DeleteApiWorkspacesIdDeleteSuccessResponse } from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";
import { ApiClient, type ApiError } from "@/utils/api/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useDeleteWorkspaceMutationFetch() {
  const router = useRouter();

  return useMutation<DeleteApiWorkspacesIdDeleteSuccessResponse, ApiError, string>({
    mutationKey: ["workspaces", "delete"],
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.delete<DeleteApiWorkspacesIdDeleteSuccessResponse>(
        `/api/workspaces/${workspaceId}/delete`
      );

      return response.data;
    },
    onSuccess: async (_, workspaceId) => {
      await Promise.all([
        refreshServerFetchAction(nextFetchTags.workspaces),
        refreshServerFetchAction(nextFetchTags.workspace(workspaceId)),
      ]);

      router.refresh();
    },
    onError: async () => {
      const isProduction = process.env.NODE_ENV === "production";

      if (!isProduction) {
        console.warn("Delete workspace failed, please try again...");
      }
    },
  });
}
