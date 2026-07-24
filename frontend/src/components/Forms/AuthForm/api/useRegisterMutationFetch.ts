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

interface Payload extends PostApiAuthRegisterRequestBody {
  turnstileToken: string;
}

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useRegisterMutationFetch() {
  const router = useRouter();

  return useMutation<PostApiAuthRegisterSuccessResponse, ApiError, Payload>({
    mutationKey: ["auth", "register"],
    mutationFn: async (payload) => {
      const { turnstileToken, ...body } = payload;

      apiClient.appendHeaders({
        "X-Turnstile-Token": turnstileToken,
      });

      const response = await apiClient.post<PostApiAuthRegisterSuccessResponse, typeof body>(
        "/api/auth/register",
        body
      );

      return response.data;
    },
    onSuccess: async () => {
      await refreshServerFetchAction(nextFetchTags.me);

      router.refresh();
    },
  });
}
