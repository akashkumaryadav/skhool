"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactNode } from "react";
import axiosInstance from "./lib/axiosInstance";

// Define a default query function that will receive the query key
// const defaultQueryFn = async ({
//   queryKey,
// }: {
//   queryKey: readonly unknown[];
// }) => {
//   if (queryKey.includes("currentUser")) {
//     return { id: "placeholder", name: "Placeholder User" };
//   }
// };

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // queryFn: defaultQueryFn,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Init>{children}</Init>
    </QueryClientProvider>
  );
}

export function Init({ children }: { children: ReactNode }) {
  const { isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/me");
      if (response.data) {
        // seperate the "ROLE_teacher" Role and teacher
        const role = response.data.role?.split("_")?.[1] || response.data.roles || "";
        return {
          ...(response?.data || {}),
          role,
        };
      }
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });
  if (isLoading) {
    return <div>Loading....</div>;
  }
  return <>{children}</>;
}
