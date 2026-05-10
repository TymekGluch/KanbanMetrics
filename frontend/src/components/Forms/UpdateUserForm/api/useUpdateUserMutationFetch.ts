"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiClient, type ApiError } from "@/utils/api/apiClient";
import {
  type GetApiUserMeSuccessResponse,
  type PutApiUserUpdateRequestBody,
  type PutApiUserUpdateSuccessResponse,
} from "@/generated/api-aliases";
import { refreshServerFetchAction } from "@/actions/refreshServerFetch";
import { useRouter } from "next/navigation";
import { nextFetchTags } from "@/nextFetchTags";
import { SetUserContext } from "@/providers/UserProvider/UserProvider";
import React from "react";

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useUpdateUserMutationFetch() {
  const router = useRouter();
  const setUser = React.useContext(SetUserContext);

  return useMutation<GetApiUserMeSuccessResponse, ApiError, PutApiUserUpdateRequestBody>({
    mutationKey: ["user", "update"],
    mutationFn: async (payload) => {
      await apiClient.put<PutApiUserUpdateSuccessResponse, PutApiUserUpdateRequestBody>(
        "/api/user/update",
        payload
      );

      const meResponse = await apiClient.get<GetApiUserMeSuccessResponse>("/api/user/me");

      return meResponse.data;
    },
    onSuccess: async (updatedUser) => {
      if (setUser) {
        setUser(updatedUser);
      }

      await refreshServerFetchAction(nextFetchTags.me);

      router.refresh();
    },
  });
}
