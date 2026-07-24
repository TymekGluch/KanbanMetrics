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
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

interface AuthFormProps {
  variant: ValueOf<typeof AUTH_FORM_VARIANTS>;
}

export function AuthForm(props: AuthFormProps) {
  const { variant } = props;

  const user = React.useContext(UserContext);

  const turnstileRef = React.useRef<TurnstileInstance>(null);

  const resetTurnstile = React.useCallback(() => {
    turnstileRef.current?.reset();
  }, []);

  const { form, handleSubmit, isPending, isLoginVariant } = useAuthForm(variant, {
    onSettled: resetTurnstile,
  });

  const { errors } = form.formState;
  const globalErrorMessage = errors.root?.server?.message;

  const handleTurnstileVerificationSuccess = (token: string) => {
    form.setValue("turnstileToken", token);
  };

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

        <Turnstile
          ref={turnstileRef}
          className={styles.accountActivationForm_turnstile}
          siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
          onSuccess={handleTurnstileVerificationSuccess}
          onError={(error) => {
            form.setError("turnstileToken", {
              message: error,
            });
          }}
          options={{
            theme: "light",
            size: "flexible",
            refreshExpired: "auto",
            refreshTimeout: "auto",
            appearance: "interaction-only",
            language: "en",
          }}
        />

        <Button.AsButton type="submit" disabled={isPending || !!errors.turnstileToken} width="100%">
          Submit
        </Button.AsButton>

        {globalErrorMessage && <p className={styles.authForm_globalError}>{globalErrorMessage}</p>}

        {errors.turnstileToken && (
          <p className={styles.authForm_globalError}>
            reCAPTCHA verification failed. Maybe you are a robot. If you are not a robot, please try
            again.
          </p>
        )}
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
