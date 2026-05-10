"use client";

import { refreshServerFetchAction } from "@/actions/refreshServerFetch";
import { type PostApiAuthLogoutSuccessResponse } from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";
import { SetUserContext } from "@/providers/UserProvider/UserProvider";
import { ApiClient } from "@/utils/api/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type ApiError } from "@/utils/api/apiClient";
import React from "react";

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useLogoutMutationFetch() {
  const router = useRouter();
  const setUser = React.useContext(SetUserContext);

  return useMutation<PostApiAuthLogoutSuccessResponse, ApiError, void>({
    mutationKey: ["auth", "logout"],
    mutationFn: async () => {
      const response = await apiClient.post<PostApiAuthLogoutSuccessResponse, undefined>(
        "/api/auth/logout"
      );

      return response.data;
    },
    onSuccess: async () => {
      setUser?.(null);

      await refreshServerFetchAction(nextFetchTags.me);

      router.refresh();
    },
    onError: async () => {
      const isProduction = process.env.NODE_ENV === "production";

      if (!isProduction) {
        console.warn("Logout failed, refreshing to update the state just in case...");
      }
    },
  });
}
