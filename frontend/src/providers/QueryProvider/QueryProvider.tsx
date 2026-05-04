"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const fiveMinutes = 1000 * 60 * 5;

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider(props: QueryProviderProps) {
  const { children } = props;

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: fiveMinutes,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
