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

  const generateNewCodeMutation = useGenerateNewCodeMutationFetch();

  const { form, handleSubmit, isPending } = useAccountActivationForm();

  const globalErrorMessage = form.formState.errors.root?.server?.message;
  const shouldRenderCounter = restTimeInMilliseconds !== null && restTimeInMilliseconds > 0;

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
        label="Activation Code"
        error={form.formState.errors.code?.message}
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
          disabled={isPending || generateNewCodeMutation.isPending}
          onClick={() => generateNewCodeMutation.mutate()}
        >
          Generate New Code
        </Button.AsButton>
      </div>

      {globalErrorMessage && (
        <p className={styles.accountActivationForm_globalError}>{globalErrorMessage}</p>
      )}
    </form>
  );
}
