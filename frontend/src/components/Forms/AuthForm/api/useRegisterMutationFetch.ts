"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiClient, type ApiError } from "@/api/apiClient";
import {
  type PostApiAuthRegisterRequestBody,
  type PostApiAuthRegisterSuccessResponse,
} from "@/generated/api-aliases";

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useRegisterMutationFetch() {
  return useMutation<PostApiAuthRegisterSuccessResponse, ApiError, PostApiAuthRegisterRequestBody>({
    mutationKey: ["auth", "register"],
    mutationFn: async (payload) => {
      const response = await apiClient.post<
        PostApiAuthRegisterSuccessResponse,
        PostApiAuthRegisterRequestBody
      >("/api/auth/register", payload);

      return response.data;
    },
  });
}
