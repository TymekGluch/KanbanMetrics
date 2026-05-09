"use client";

import Button from "@/components/Button";
import Form from "@/components/Form";
import { UserContext } from "@/providers/UserProvider/UserProvider";
import React from "react";
import styles from "./UpdateUserForm.module.scss";
import { useUpdateUserForm } from "./useUpdateUserForm";

export function UpdateUserForm() {
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

  const { errors } = form.formState;
  const globalErrorMessage = errors.root?.server?.message;

  return (
    <div className={styles.updateUserForm}>
      <Form onSubmit={handleSubmit} width="100%">
        <Form.Input
          {...form.register("name")}
          error={errors.name?.message}
          invalid={Boolean(errors.name)}
          label="Name"
          autoComplete="name"
          disabled={isPending}
          width="100%"
        />

        <Form.Input
          {...form.register("email")}
          error={errors.email?.message}
          invalid={Boolean(errors.email)}
          label="Email"
          type="email"
          autoComplete="email"
          disabled={isPending}
          width="100%"
        />

        <Form.Input
          {...form.register("password")}
          error={errors.password?.message}
          invalid={Boolean(errors.password)}
          hasPasswordToggle
          label="New Password (Optional)"
          autoComplete="new-password"
          disabled={isPending}
          width="100%"
        />

        <Form.Input
          {...form.register("confirmPassword")}
          error={errors.confirmPassword?.message}
          invalid={Boolean(errors.confirmPassword)}
          hasPasswordToggle
          label="Confirm New Password"
          autoComplete="new-password"
          disabled={isPending}
          width="100%"
        />

        <Button.AsButton type="submit" disabled={isPending} width="100%">
          Update Profile
        </Button.AsButton>

        {globalErrorMessage && (
          <p className={styles.updateUserForm_globalError}>
            <span className={styles.updateUserForm_globalErrorText}>{globalErrorMessage}</span>
          </p>
        )}
      </Form>
    </div>
  );
}
