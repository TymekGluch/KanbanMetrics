"use client";

import React from "react";
import { type DialogRootProps } from "./Dialog.types";

export interface DialogContextValue {
  isOpen: boolean;
  setIsOpen: (next: boolean) => void;
  closeOnEscape: boolean;
  closeOnOverlayClick: boolean;
  contentId: string;
  titleId: string;
  descriptionId: string;
  contentRef: React.RefObject<HTMLElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export const DialogContext = React.createContext<DialogContextValue | null>(null);

export function useDialogContext() {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error("Dialog compound components must be used inside Dialog.Root");
  }

  return context;
}

function getFocusableElements(container: HTMLElement) {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1
  );
}

type UseDialogRootStateProps = Pick<
  DialogRootProps,
  "open" | "defaultOpen" | "onOpenChange" | "closeOnEscape" | "closeOnOverlayClick"
>;

export function useDialogRootState(props: UseDialogRootStateProps): DialogContextValue {
  const {
    open,
    defaultOpen = false,
    onOpenChange,
    closeOnEscape = true,
    closeOnOverlayClick = true,
  } = props;

  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = isControlled ? Boolean(open) : internalOpen;

  const contentRef = React.useRef<HTMLElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const reactId = React.useId();
  const contentId = `dialog-content-${reactId}`;
  const titleId = `dialog-title-${reactId}`;
  const descriptionId = `dialog-description-${reactId}`;

  const setIsOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }

      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
      return;
    }

    const contentElement = contentRef.current;
    if (!contentElement) {
      return;
    }

    const focusable = getFocusableElements(contentElement);

    if (focusable.length > 0) {
      focusable[0].focus();
      return;
    }

    contentElement.focus();
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const contentElement = contentRef.current;
      if (!contentElement) {
        return;
      }

      const focusable = getFocusableElements(contentElement);
      if (focusable.length === 0) {
        event.preventDefault();
        contentElement.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onDocumentKeyDown);

    return () => {
      document.removeEventListener("keydown", onDocumentKeyDown);
    };
  }, [closeOnEscape, isOpen, setIsOpen]);

  return React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      closeOnEscape,
      closeOnOverlayClick,
      contentId,
      titleId,
      descriptionId,
      contentRef,
      triggerRef,
    }),
    [closeOnEscape, closeOnOverlayClick, contentId, descriptionId, isOpen, setIsOpen, titleId]
  );
}
