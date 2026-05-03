"use client";

import { type ValueOf } from "@/types/valueOf";
import { type AUTH_FORM_VARIANTS } from "./AuthForm.constants";
import Form from "@/components/Form";
import { useAuthForm } from "./useAuthForm";
import Button from "@/components/Button";
import styles from "./AuthForm.module.scss";

interface AuthFormProps {
  variant: ValueOf<typeof AUTH_FORM_VARIANTS>;
}

export function AuthForm(props: AuthFormProps) {
  const { variant } = props;

  const { form, handleSubmit, isPending, isLoginVariant } = useAuthForm(variant);
  const fieldErrors = form.formState.errors as Partial<
    Record<"email" | "password" | "name", { message?: string }>
  >;
  const globalErrorMessage = (
    form.formState.errors.root as { server?: { message?: string } } | undefined
  )?.server?.message;

  return (
    <Form onSubmit={handleSubmit} width="100%">
      <Form.Input
        {...form.register("email")}
        error={fieldErrors.email?.message}
        invalid={Boolean(fieldErrors.email)}
        isRequired
        label="Email"
        autoComplete={isLoginVariant ? "email" : "new-email"}
        disabled={isPending}
        width="100%"
      />

      <Form.Input
        {...form.register("password")}
        error={fieldErrors.password?.message}
        invalid={Boolean(fieldErrors.password)}
        isRequired
        label="Password"
        autoComplete={isLoginVariant ? "current-password" : "new-password"}
        disabled={isPending}
        width="100%"
      />

      {!isLoginVariant && (
        <Form.Input
          {...form.register("name")}
          error={fieldErrors.name?.message}
          invalid={Boolean(fieldErrors.name)}
          label="Name"
          autoComplete="name"
          disabled={isPending}
          width="100%"
        />
      )}

      <Button.AsButton type="submit" disabled={isPending} width="100%">
        Submit
      </Button.AsButton>

      {globalErrorMessage && <p className={styles.globalError}>{globalErrorMessage}</p>}
    </Form>
  );
}
