"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiClient, type ApiError } from "@/api/apiClient";
import {
  type PostApiAuthLoginRequestBody,
  type PostApiAuthLoginSuccessResponse,
} from "@/generated/api-aliases";

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).CompleteCredentialsForRestrictedRoutes();

export function useLoginMutationFetch() {
  return useMutation<PostApiAuthLoginSuccessResponse, ApiError, PostApiAuthLoginRequestBody>({
    mutationKey: ["auth", "login"],
    mutationFn: async (payload) => {
      const response = await apiClient.post<
        PostApiAuthLoginSuccessResponse,
        PostApiAuthLoginRequestBody
      >("/api/auth/login", payload);

      return response.data;
    },
  });
}
