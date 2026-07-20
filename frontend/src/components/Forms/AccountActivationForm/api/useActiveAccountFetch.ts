"use client";

import { type PostApiAccountActivationCodeActivateSuccessResponse } from "@/generated/api-aliases";
import { ApiClient, type ApiError } from "@/utils/api/apiClient";
import { useMutation } from "@tanstack/react-query";
import { type PostApiAccountActivationCodeActivateRequestBody } from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";
import { refreshServerFetchAction } from "@/actions/refreshServerFetch";
import { useRouter } from "next/navigation";

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useActiveAccountFetch() {
  const router = useRouter();

  return useMutation<
    PostApiAccountActivationCodeActivateSuccessResponse,
    ApiError,
    PostApiAccountActivationCodeActivateRequestBody
  >({
    mutationKey: ["accountActivation", "activate"],
    mutationFn: async (payload) => {
      const response = await apiClient.post<
        PostApiAccountActivationCodeActivateSuccessResponse,
        PostApiAccountActivationCodeActivateRequestBody
      >("/api/account-activation-code/activate", payload);

      return response.data;
    },
    onSuccess: async () => {
      await refreshServerFetchAction(nextFetchTags.me);

      router.refresh();
    },
    onError: async (error) => {
      const isProduction = process.env.NODE_ENV === "production";

      if (!isProduction) {
        console.warn("Account activation failed, please try again...", error);
      }
    },
  });
}
