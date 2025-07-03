"use client";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/SideNavigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useCallback, useState } from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await axios.get("/api/user/me");
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <div className="flex h-screen bg-base-200 font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        role="teacher"
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} currentUser={userData || {}} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
