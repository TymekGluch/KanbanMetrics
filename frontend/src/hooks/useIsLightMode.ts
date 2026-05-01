"use client";

import React from "react";

export function useIsLightMode(): boolean {
  const [isLightMode, setIsLightMode] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    setIsLightMode(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsLightMode(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isLightMode;
}
