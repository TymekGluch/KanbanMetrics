"use client";

import { resolveProps } from "@/responsive/utils/resolveProps";
import clsx from "clsx";
import { Base } from "../Base/Base";
import { DIALOG_SIZES } from "./dialog.constants";
import { DialogContext, useDialogContext, useDialogRootState } from "./Dialog.hooks";
import styles from "./Dialog.module.scss";
import {
  type DialogCloseProps,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogOverlayProps,
  type DialogRootProps,
  type DialogSimpleSlotProps,
  type DialogTitleProps,
  type DialogTriggerProps,
} from "./Dialog.types";

export function DialogRootComponent(props: DialogRootProps) {
  const {
    children,
    open,
    defaultOpen = false,
    onOpenChange,
    closeOnEscape = true,
    closeOnOverlayClick = true,
  } = props;

  const contextValue = useDialogRootState({
    open,
    defaultOpen,
    onOpenChange,
    closeOnEscape,
    closeOnOverlayClick,
  });

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
}

export function DialogTriggerComponent(props: DialogTriggerProps) {
  const { stylesProps, rest } = resolveProps(props);
  const { children, className, onClick, ...buttonProps } = rest;

  const { isOpen, setIsOpen, contentId, triggerRef } = useDialogContext();

  return (
    <Base {...stylesProps} asChild className={clsx(styles.dialogTrigger, className)}>
      <button
        {...buttonProps}
        ref={triggerRef}
        type={buttonProps.type ?? "button"}
        aria-haspopup="dialog"
        aria-controls={contentId}
        aria-expanded={isOpen}
        onClick={(event) => {
          onClick?.(event);
          setIsOpen(true);
        }}
      >
        {children}
      </button>
    </Base>
  );
}

export function DialogOverlayComponent(props: DialogOverlayProps) {
  const { className, onClick, ...overlayProps } = props;
  const { isOpen, setIsOpen, closeOnOverlayClick } = useDialogContext();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      {...overlayProps}
      className={clsx(styles.dialogOverlay, className)}
      onClick={(event) => {
        onClick?.(event);

        if (closeOnOverlayClick) {
          setIsOpen(false);
        }
      }}
    />
  );
}

export function DialogContentComponent(props: DialogContentProps) {
  const { stylesProps, rest } = resolveProps(props);
  const { children, className, size = DIALOG_SIZES.DEFAULT, ...contentProps } = rest;
  const { isOpen, contentId, titleId, descriptionId, contentRef } = useDialogContext();

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.dialogRoot}>
      <DialogOverlayComponent />

      <Base
        {...stylesProps}
        asChild
        className={clsx(styles.dialogContent, styles[`dialogContent__size_${size}`], className)}
      >
        <section
          {...contentProps}
          ref={contentRef}
          id={contentId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
        >
          {children}
        </section>
      </Base>
    </div>
  );
}

export function DialogCloseComponent(props: DialogCloseProps) {
  const { stylesProps, rest } = resolveProps(props);
  const { children, className, onClick, ...buttonProps } = rest;
  const { setIsOpen } = useDialogContext();

  return (
    <Base {...stylesProps} asChild className={clsx(styles.dialogClose, className)}>
      <button
        {...buttonProps}
        type={buttonProps.type ?? "button"}
        onClick={(event) => {
          onClick?.(event);
          setIsOpen(false);
        }}
      >
        {children}
      </button>
    </Base>
  );
}

export function DialogHeaderComponent(props: DialogSimpleSlotProps) {
  const { className, ...rest } = props;

  return <div {...rest} className={clsx(styles.dialogHeader, className)} />;
}

export function DialogBodyComponent(props: DialogSimpleSlotProps) {
  const { className, ...rest } = props;

  return <div {...rest} className={clsx(styles.dialogBody, className)} />;
}

export function DialogFooterComponent(props: DialogSimpleSlotProps) {
  const { className, ...rest } = props;

  return <div {...rest} className={clsx(styles.dialogFooter, className)} />;
}

export function DialogTitleComponent(props: DialogTitleProps) {
  const { className, id, ...rest } = props;
  const { titleId } = useDialogContext();

  return <h2 {...rest} id={id ?? titleId} className={clsx(styles.dialogTitle, className)} />;
}

export function DialogDescriptionComponent(props: DialogDescriptionProps) {
  const { className, id, ...rest } = props;
  const { descriptionId } = useDialogContext();

  return (
    <p {...rest} id={id ?? descriptionId} className={clsx(styles.dialogDescription, className)} />
  );
}
