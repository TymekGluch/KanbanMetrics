export interface LayoutContextValue {
  navigationSpace: string;
  contentSpace: string;
}

export type LayoutProviderProps = React.PropsWithChildren<{
  initialValue?: LayoutContextValue;
}>;

export interface LayoutContextType {
  value: LayoutContextValue;
  setValue: React.Dispatch<React.SetStateAction<LayoutContextValue>>;
  isRestored: boolean;
}
