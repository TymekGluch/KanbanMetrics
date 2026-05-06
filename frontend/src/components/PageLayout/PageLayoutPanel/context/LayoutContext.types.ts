export interface LayoutContextValue {
  navigationSpace: number;
  contentSpace: number;
}

export type LayoutProviderProps = React.PropsWithChildren;

export interface LayoutContextType {
  value: LayoutContextValue;
  setValue: React.Dispatch<React.SetStateAction<LayoutContextValue>>;
}
