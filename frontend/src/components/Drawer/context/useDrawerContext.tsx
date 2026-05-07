"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface DrawerContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DrawerContext = React.createContext<DrawerContextValue>({
  isOpen: false,
  setIsOpen: () => {},
});

export function DrawerProvider(props: React.PropsWithChildren) {
  const { children } = props;

  const [isOpen, setIsOpen] = React.useState(false);

  const pathname = usePathname();

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const handleResize = () => {
      setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const value = React.useMemo(() => ({ isOpen, setIsOpen }), [isOpen]);

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}
