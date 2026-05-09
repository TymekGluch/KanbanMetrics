"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  type GetApiUserMeSuccessResponse,
  type PutApiUserUpdateRequestBody,
} from "@/generated/api-aliases";
import { mapBackendErrorsToForm } from "../utils/backendFormErrors";
import {
  updateUserFormSchema,
  type UpdateUserFormSchemaInputType,
  type UpdateUserFormSchemaType,
} from "./UpdateUserForm.validation";
import { useUpdateUserMutationFetch } from "./api/useUpdateUserMutationFetch";
import { UPDATE_USER_FORM_FIELD_NAMES } from "./UpdateUserForm.constants";

const GLOBAL_SERVER_FIELD = "root.server" as const;
type UpdateUserFormErrorPath = keyof UpdateUserFormSchemaInputType | "root" | `root.${string}`;

const fieldNameMap: Record<string, UpdateUserFormErrorPath> = {
  [UPDATE_USER_FORM_FIELD_NAMES.NAME]: UPDATE_USER_FORM_FIELD_NAMES.NAME,
  [UPDATE_USER_FORM_FIELD_NAMES.EMAIL]: UPDATE_USER_FORM_FIELD_NAMES.EMAIL,
  [UPDATE_USER_FORM_FIELD_NAMES.PASSWORD]: UPDATE_USER_FORM_FIELD_NAMES.PASSWORD,
  global: GLOBAL_SERVER_FIELD,
};

export function useUpdateUserForm(initialUser: GetApiUserMeSuccessResponse | null) {
  const mutation = useUpdateUserMutationFetch();

  const form = useForm<UpdateUserFormSchemaInputType, unknown, UpdateUserFormSchemaType>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    form.clearErrors();

    try {
      const payload: PutApiUserUpdateRequestBody = {};

      const normalizedInitialName = initialUser?.name?.trim() ?? "";
      const normalizedInitialEmail = initialUser?.email?.trim() ?? "";
      const normalizedName = data.name?.trim() ?? "";
      const normalizedEmail = data.email?.trim() ?? "";

      if (normalizedName && normalizedName !== normalizedInitialName) {
        payload.name = normalizedName;
      }

      if (normalizedEmail && normalizedEmail !== normalizedInitialEmail) {
        payload.email = normalizedEmail;
      }

      if (data.password) {
        payload.password = data.password;
      }

      if (Object.keys(payload).length === 0) {
        form.setError(GLOBAL_SERVER_FIELD, {
          type: "manual",
          message: "No changes to update.",
        });

        return;
      }

      await mutation.mutateAsync(payload);
    } catch (error) {
      mapBackendErrorsToForm<UpdateUserFormSchemaInputType>({
        error,
        fallbackField: GLOBAL_SERVER_FIELD,
        fieldNameMap,
        setError: form.setError,
      });
    }
  });

  return {
    form,
    handleSubmit,
    mutation,
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
}
