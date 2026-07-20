"use client";

import { refreshServerFetchAction } from "@/actions/refreshServerFetch";
import { type PostApiAccountActivationCodeGenerateSuccessResponse } from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";
import { ApiClient, type ApiError } from "@/utils/api/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useGenerateNewCodeMutationFetch() {
  const router = useRouter();

  return useMutation<PostApiAccountActivationCodeGenerateSuccessResponse, ApiError, void>({
    mutationKey: ["accountActivation", "generateNewCode"],
    mutationFn: async () => {
      const response = await apiClient.post<
        PostApiAccountActivationCodeGenerateSuccessResponse,
        void
      >("/api/account-activation-code/generate");

      return response.data;
    },
    onSuccess: async () => {
      await refreshServerFetchAction(nextFetchTags.accountActivationCode);

      router.refresh();
    },
    onError: async (error) => {
      const isProduction = process.env.NODE_ENV === "production";

      if (!isProduction) {
        console.warn("CLIENT: Account generation failed, please try again...", error);
      }
    },
  });
}
