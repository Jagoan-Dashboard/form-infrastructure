import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            retry: 1,
            onError: (error) => {
              console.error('🚨 Mutation Error:', error);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}