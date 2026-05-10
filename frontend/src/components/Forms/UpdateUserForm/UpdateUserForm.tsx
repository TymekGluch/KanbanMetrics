"use client";

import Button from "@/components/Button";
import FormUI from "@/components/Form";
import { UserContext } from "@/providers/UserProvider/UserProvider";
import React from "react";
import { FormProvider, useFormContext } from "react-hook-form";
import styles from "./UpdateUserForm.module.scss";
import { useUpdateUserForm } from "./useUpdateUserForm";
import type {
  UpdateUserFormSchemaInputType,
  UpdateUserFormSchemaType,
} from "./UpdateUserForm.validation";
import type { UseFormReturn } from "react-hook-form";

interface UpdateUserFormContextValue {
  form: UseFormReturn<UpdateUserFormSchemaInputType, unknown, UpdateUserFormSchemaType>;
  isPending: boolean;
}

interface UpdateUserFormProps extends React.PropsWithChildren {
  submitButtonLabel?: string;
}

const UpdateUserFormContext = React.createContext<UpdateUserFormContextValue | null>(null);

function useUpdateUserFormContext() {
  const ctx = React.useContext(UpdateUserFormContext);
  if (!ctx) {
    throw new Error("UpdateUserForm sub-components must be used inside <UpdateUserForm.Form>");
  }
  return ctx;
}

export function FormComponent(props: UpdateUserFormProps) {
  const { children, submitButtonLabel = "Update Profile" } = props;

  const user = React.useContext(UserContext);
  const { form, handleSubmit, isPending } = useUpdateUserForm(user);

  React.useEffect(() => {
    form.reset({
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      confirmPassword: "",
    });
  }, [form, user?.email, user?.name]);

  const globalErrorMessage = form.formState.errors.root?.server?.message;

  return (
    <UpdateUserFormContext.Provider value={{ form, isPending }}>
      <FormProvider {...form}>
        <div className={styles.updateUserForm}>
          <FormUI onSubmit={handleSubmit} width="100%">
            {children}

            <Button.AsButton type="submit" disabled={isPending} width="100%">
              {submitButtonLabel}
            </Button.AsButton>

            {globalErrorMessage && (
              <p className={styles.updateUserForm_globalError}>
                <span className={styles.updateUserForm_globalErrorText}>{globalErrorMessage}</span>
              </p>
            )}
          </FormUI>
        </div>
      </FormProvider>
    </UpdateUserFormContext.Provider>
  );
}

export function UserDetailsComponent() {
  const { isPending } = useUpdateUserFormContext();
  const form = useFormContext<UpdateUserFormSchemaInputType>();
  const { errors } = form.formState;

  return (
    <fieldset className={styles.updateUserForm_fieldset}>
      <FormUI.Input
        {...form.register("name")}
        error={errors.name?.message}
        invalid={Boolean(errors.name)}
        label="Name"
        autoComplete="name"
        disabled={isPending}
        width="100%"
      />

      <FormUI.Input
        {...form.register("email")}
        error={errors.email?.message}
        invalid={Boolean(errors.email)}
        label="Email"
        type="email"
        autoComplete="email"
        disabled={isPending}
        width="100%"
      />
    </fieldset>
  );
}

export function NewPasswordComponent() {
  const { isPending } = useUpdateUserFormContext();
  const form = useFormContext<UpdateUserFormSchemaInputType>();
  const { errors } = form.formState;

  return (
    <fieldset className={styles.updateUserForm_fieldset}>
      <FormUI.Input
        {...form.register("password")}
        error={errors.password?.message}
        invalid={Boolean(errors.password)}
        hasPasswordToggle
        label="New Password (Optional)"
        autoComplete="new-password"
        disabled={isPending}
        width="100%"
      />

      <FormUI.Input
        {...form.register("confirmPassword")}
        error={errors.confirmPassword?.message}
        invalid={Boolean(errors.confirmPassword)}
        hasPasswordToggle
        label="Confirm New Password"
        autoComplete="new-password"
        disabled={isPending}
        width="100%"
      />
    </fieldset>
  );
}
