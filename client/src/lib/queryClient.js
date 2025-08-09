import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Increase staleTime to reduce unnecessary refetches
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Remove refetchInterval to prevent constant polling
      // Only refetch when needed or when window regains focus

      // Increase cache time
      gcTime: 10 * 60 * 1000, // 10 minutes

      // Smarter retry logic
      retry: (failureCount, error) => {
        // Don't retry client errors (4xx)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry server errors (5xx) up to 3 times
        return failureCount < 3;
      },

      // Enable refetch on window focus for real-time data
      refetchOnWindowFocus: true,
      refetchOnMount: false,

      // Add suspense support
      suspense: false,
    },
    mutations: {
      retry: 1, // Allow one retry for mutations
    },
  },
});
