type OmittedSelectProps = Omit<React.ComponentPropsWithRef<"select">, "children">;

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends OmittedSelectProps {
  options: Array<SelectOption>;
  label: string;
  onChoose?: (option: SelectOption) => void;
  withSearch?: boolean;
  helperText?: string;
  error?: string;
  isError?: boolean;
  isRequired?: boolean;
}
