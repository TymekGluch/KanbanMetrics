"use client";

import { type ValueOf } from "@/types/valueOf";
import { type AUTH_FORM_VARIANTS } from "./AuthForm.constants";
import Form from "@/components/Form";
import { useAuthForm } from "./useAuthForm";
import Button from "@/components/Button";
import styles from "./AuthForm.module.scss";
import React from "react";
import { UserContext } from "@/providers/UserProvider/UserProvider";
import Link from "@/components/Link";
import { AuthFormSuccessStatus } from "./AuthFormSuccessStatus/AuthFormSuccessStatus";

interface AuthFormProps {
  variant: ValueOf<typeof AUTH_FORM_VARIANTS>;
}

export function AuthForm(props: AuthFormProps) {
  const { variant } = props;

  const user = React.useContext(UserContext);
  const { form, handleSubmit, isPending, isLoginVariant } = useAuthForm(variant);

  const { errors } = form.formState;
  const globalErrorMessage = errors.root?.server?.message;

  if (!!user) {
    return <AuthFormSuccessStatus user={user} isFromLogin={isLoginVariant} />;
  }

  return (
    <div className={styles.authForm}>
      <Form onSubmit={handleSubmit} width="100%">
        <Form.Input
          {...form.register("email")}
          error={errors.email?.message}
          invalid={Boolean(errors.email)}
          isRequired
          label="Email"
          autoComplete={isLoginVariant ? "email" : "new-email"}
          disabled={isPending}
          width="100%"
        />

        <Form.Input
          {...form.register("password")}
          error={errors.password?.message}
          invalid={Boolean(errors.password)}
          isRequired
          hasPasswordToggle
          label="Password"
          autoComplete={isLoginVariant ? "current-password" : "new-password"}
          disabled={isPending}
          width="100%"
        />

        {!isLoginVariant && (
          <Form.Input
            {...form.register("name")}
            error={"name" in errors ? errors.name?.message : undefined}
            invalid={Boolean("name" in errors && errors.name)}
            label="Name"
            isRequired
            autoComplete="name"
            disabled={isPending}
            width="100%"
          />
        )}

        <Button.AsButton type="submit" disabled={isPending} width="100%">
          Submit
        </Button.AsButton>

        {globalErrorMessage && <p className={styles.authForm_globalError}>{globalErrorMessage}</p>}
      </Form>

      <div className={styles.authForm_options}>
        <p className={styles.authForm_optionsText}>
          {isLoginVariant ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link.AsNextLink
            href={isLoginVariant ? "/auth/register" : "/auth/login"}
            isInherits
            disabled={isPending}
            className={styles.authForm_link}
          >
            {isLoginVariant ? "Sign up" : "Log in"}
          </Link.AsNextLink>
        </p>
      </div>
    </div>
  );
}
