import { type BaseMarginProps, type BaseSizeProps } from "@/responsive/responsiveStyleProps.types";
import type React from "react";

interface FormStylesProps extends BaseMarginProps {
  width?: BaseSizeProps["width"];
}

export interface FormProps extends React.ComponentPropsWithRef<"form">, FormStylesProps {}

type InputStylesProps = BaseMarginProps & BaseSizeProps;
type InputNativeProps = Omit<React.ComponentPropsWithRef<"input">, keyof InputStylesProps | "name">;

export interface InputProps extends InputNativeProps, InputStylesProps {
  label: string;
  name: string;
  helperText?: React.ReactNode;
  message?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  isError?: boolean;
  isRequired?: boolean;
  hasPasswordToggle?: boolean;
}

export interface FieldsetProps extends React.ComponentPropsWithRef<"fieldset">, BaseMarginProps {
  LegendSlot?: React.ReactNode;
}
