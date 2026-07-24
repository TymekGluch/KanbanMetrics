"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { mapBackendErrorsToForm } from "../utils/backendFormErrors";
import { authFormSchema, type AuthFormSchemaType } from "./AuthForm.validation";
import { AUTH_FORM_VARIANTS } from "./AuthForm.constants";
import { useLoginMutationFetch } from "./api/useLoginMutationFetch";
import { useRegisterMutationFetch } from "./api/useRegisterMutationFetch";

type AuthFormVariant = AuthFormSchemaType["variant"];
const GLOBAL_SERVER_FIELD = "root.server" as const;

const fieldNameMap = {
  email: "email",
  password: "password",
  name: "name",
  global: GLOBAL_SERVER_FIELD,
} as const;

interface UseAuthFormOptions {
  onSettled?: () => void;
}

export function useAuthForm(variant: AuthFormVariant, options?: UseAuthFormOptions) {
  const loginMutation = useLoginMutationFetch();
  const registerMutation = useRegisterMutationFetch();

  const form = useForm<AuthFormSchemaType>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      variant,
    },
  });

  const watchedVariant = useWatch({ control: form.control, name: "variant" });
  const isLoginVariant = watchedVariant === AUTH_FORM_VARIANTS.LOGIN;

  const handleSubmit = form.handleSubmit(async (data: AuthFormSchemaType) => {
    form.clearErrors();

    try {
      if (data.variant === AUTH_FORM_VARIANTS.LOGIN) {
        await loginMutation.mutateAsync({
          email: data.email,
          password: data.password,
          turnstileToken: data.turnstileToken,
        });

        return;
      }

      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        turnstileToken: data.turnstileToken,
      });
    } catch (error) {
      mapBackendErrorsToForm<AuthFormSchemaType>({
        error,
        fallbackField: GLOBAL_SERVER_FIELD,
        fieldNameMap,
        setError: form.setError,
      });
    } finally {
      options?.onSettled?.();
    }
  });

  return {
    form,
    handleSubmit,
    loginMutation,
    registerMutation,
    isLoginVariant,
    isPending: loginMutation.isPending || registerMutation.isPending,
    isError: loginMutation.isError || registerMutation.isError,
  };
}
