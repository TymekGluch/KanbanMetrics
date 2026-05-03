import clsx from "clsx";
import { resolveProps } from "@/responsive/utils/resolveProps";
import { Base } from "../Base/Base";
import { type InputProps, type FormProps, type FieldsetProps } from "./Form.types";
import styles from "./Form.module.scss";

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
    <Base {...stylesProps} asChild className={styles.fieldset}>
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
    ...inputProps
  } = rest;

  const isInvalid = Boolean(invalid || isError);
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

        <input
          {...inputProps}
          className={styles.input_field}
          id={fieldId}
          name={name}
          aria-invalid={isInvalid || undefined}
          aria-describedby={ariaDescribedBy}
          aria-errormessage={isInvalid ? feedbackId : undefined}
        />

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
