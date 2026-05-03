import { QueryClient } from "@tanstack/react-query";

const fiveMinutes = 1000 * 60 * 5;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: fiveMinutes,
    },
  },
});

export { queryClient };
