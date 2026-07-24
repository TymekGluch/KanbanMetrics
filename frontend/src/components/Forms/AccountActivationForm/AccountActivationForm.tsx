"use client";

import Form from "@/components/Form";
import { useAccountActivationForm } from "./useAccountActivationForm";
import Button from "@/components/Button";
import React from "react";
import { useGenerateNewCodeMutationFetch } from "./api/useGenerateNewCodeFetch";
import { Base } from "@/components/Base/Base";
import styles from "./AccountActivationForm.module.scss";
import { pxToRem } from "@/utils/pxToRem";
import { COLORS } from "@/theme/theme.constants";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

interface AccountActivationFormProps {
  expirationAt?: Date;
}

export function AccountActivationForm(props: AccountActivationFormProps) {
  const { expirationAt } = props;

  const nowDateToTimestamp = new Date().getTime();
  const expirationDateToTimestamp = expirationAt?.getTime();

  const restTime = expirationDateToTimestamp
    ? expirationDateToTimestamp - nowDateToTimestamp
    : null;

  const [restTimeInMilliseconds, setRestTimeInMilliseconds] = React.useState<number | null>(
    restTime
  );

  const turnstileRef = React.useRef<TurnstileInstance>(null);

  const resetTurnstile = React.useCallback(() => {
    turnstileRef.current?.reset();
  }, []);

  const generateNewCodeMutation = useGenerateNewCodeMutationFetch();

  const { form, handleSubmit, isPending } = useAccountActivationForm({ onSettled: resetTurnstile });

  const globalErrorMessage = form.formState.errors.root?.server?.message;
  const shouldRenderCounter = restTimeInMilliseconds !== null && restTimeInMilliseconds > 0;

  const handleTurnstileVerificationSuccess = (token: string) => {
    form.setValue("turnstileToken", token);
  };

  React.useEffect(
    function setCounter() {
      if (restTimeInMilliseconds === null) return;

      const interval = setInterval(() => {
        setRestTimeInMilliseconds((prev) => (prev !== null ? prev - 1000 : null));
      }, 1000);

      return () => clearInterval(interval);
    },
    [restTimeInMilliseconds]
  );

  return (
    <form onSubmit={handleSubmit} className={styles.accountActivationForm}>
      {shouldRenderCounter && (
        <Base
          as="p"
          key={restTimeInMilliseconds}
          fontSize={pxToRem(11)}
          color={COLORS.TEXT_SECONDARY}
        >
          This code will expire in {new Date(restTimeInMilliseconds).getMinutes()} minutes and{" "}
          {new Date(restTimeInMilliseconds).getSeconds()} seconds.
        </Base>
      )}

      <Form.Input
        {...form.register("code")}
        disabled={isPending || generateNewCodeMutation.isPending}
        invalid={Boolean(form.formState.errors.code)}
        marginTop={pxToRem(16)}
        label="Activation Code"
        error={form.formState.errors.code?.message}
      />

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

      <div className={styles.accountActivationForm_buttonContainer}>
        <Button.AsButton
          type="submit"
          width="100%"
          disabled={isPending || generateNewCodeMutation.isPending}
        >
          Submit
        </Button.AsButton>
        <Button.AsButton
          type="button"
          variant="outlined"
          width="100%"
          disabled={
            isPending || generateNewCodeMutation.isPending || !!form.formState.errors.turnstileToken
          }
          onClick={() =>
            generateNewCodeMutation.mutate(
              { turnstileToken: form.getValues("turnstileToken") },
              { onSettled: resetTurnstile }
            )
          }
        >
          Generate New Code
        </Button.AsButton>
      </div>

      {globalErrorMessage && (
        <p className={styles.accountActivationForm_globalError}>{globalErrorMessage}</p>
      )}

      {form.formState.errors.turnstileToken && (
        <p className={styles.accountActivationForm_globalError}>
          reCAPTCHA verification failed. Maybe you are a robot. If you are not a robot, please try
          again.
        </p>
      )}
    </form>
  );
}
