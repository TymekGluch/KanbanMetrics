'use client";';

import clsx from "clsx";
import React from "react";
import { resolveProps } from "@/responsive/utils/resolveProps";
import { Base } from "../Base/Base";
import { type InputProps, type FormProps, type FieldsetProps } from "./Form.types";
import styles from "./Form.module.scss";
import { EyeIcon } from "./EyeIcon/EyeIcon";

export function FormComponent(props: FormProps) {
  const { stylesProps, rest } = resolveProps(props);
  const { children } = rest;

  return (
    <Base {...stylesProps} className={styles.form} asChild>
      <form {...rest}>{children}</form>
    </Base>
  );
}

export function FieldsetComponent(props: FieldsetProps) {
  const { stylesProps, rest } = resolveProps(props);
  const { children, LegendSlot } = rest;

  return (
    <Base {...stylesProps} asChild width="100%" className={styles.fieldset}>
      <fieldset {...rest}>
        {LegendSlot && <legend className={styles.fieldset_legend}>{LegendSlot}</legend>}
        {children}
      </fieldset>
    </Base>
  );
}

export function InputComponent(props: InputProps) {
  const { stylesProps, rest } = resolveProps(props);
  const {
    label,
    name,
    id,
    invalid,
    error,
    message,
    helperText,
    isError,
    isRequired,
    hasPasswordToggle,
    ...inputProps
  } = rest;

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const isInvalid = Boolean(invalid || isError);
  const canTogglePassword = Boolean(
    hasPasswordToggle && (inputProps.type === "password" || inputProps.type === undefined)
  );
  const resolvedInputType = canTogglePassword
    ? isPasswordVisible
      ? "text"
      : "password"
    : inputProps.type;
  const fieldId = id ?? name;
  const helperTextId = helperText ? `${fieldId}-helper` : undefined;
  const feedback = isInvalid ? (error ?? message) : message;
  const hasFeedback = Boolean(feedback);
  const feedbackId = hasFeedback ? `${fieldId}-feedback` : undefined;
  const ariaDescribedBy = [helperTextId, feedbackId].filter(Boolean).join(" ") || undefined;
  const rootClassName = clsx(styles.input_root, {
    [styles.input__invalid]: isInvalid,
    [styles.input__disabled]: inputProps.disabled,
    [styles.input__readonly]: inputProps.readOnly,
  });

  return (
    <Base {...stylesProps} asChild className={styles.input}>
      <div className={rootClassName}>
        {Boolean(label) && (
          <label className={styles.input_label} htmlFor={fieldId}>
            {label}
            {isRequired && <span className={styles.input_required}>*</span>}
          </label>
        )}

        <div className={styles.input_fieldWrapper}>
          <input
            {...inputProps}
            className={styles.input_field}
            id={fieldId}
            name={name}
            type={resolvedInputType}
            aria-invalid={isInvalid || undefined}
            aria-describedby={ariaDescribedBy}
            aria-errormessage={isInvalid ? feedbackId : undefined}
          />

          {canTogglePassword && (
            <button
              type="button"
              className={styles.input_toggle}
              onClick={() => setIsPasswordVisible((current) => !current)}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              aria-pressed={isPasswordVisible}
              disabled={inputProps.disabled}
            >
              <EyeIcon isClosed={!isPasswordVisible} />
            </button>
          )}
        </div>

        {Boolean(helperText) && (
          <p id={helperTextId} className={styles.input_helperText}>
            {helperText}
          </p>
        )}

        <p
          id={feedbackId}
          className={clsx(styles.input_message, {
            [styles.input_message__error]: isInvalid,
            [styles.input_message__placeholder]: !hasFeedback,
          })}
          aria-hidden={hasFeedback ? undefined : true}
          aria-live={hasFeedback ? (isInvalid ? "assertive" : "polite") : undefined}
          role={hasFeedback && isInvalid ? "alert" : undefined}
        >
          {hasFeedback ? feedback : " "}
        </p>
      </div>
    </Base>
  );
}
