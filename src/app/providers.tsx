"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { ReactNode } from 'react';

// Define a default query function that will receive the query key
const defaultQueryFn = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${queryKey[0] as string}`,
  )
  return data
}

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: defaultQueryFn,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}