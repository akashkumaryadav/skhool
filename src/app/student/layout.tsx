"use client";
import React from "react";
import SidebarNavigation from "@/app/components/SideNavigation";
import Header from "@/app/components/Header";
import { APP_NAME } from "@/app/constants"; // Assuming APP_NAME is defined in constants
import Head from "next/head"; // Keep for specific head tags if needed beyond metadata
import { useCallback, useState } from "react";
import axios from "../lib/axiosInstance"; // Adjust the path as necessary
import { useQuery } from "@tanstack/react-query";

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
      const response = await axios.get("/user/me");
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{APP_NAME}-student</title>
        <meta
          name="description"
          content="A modern dashboard for teachers at Skhool, facilitating student management, performance tracking, and access to AI-powered resources. Designed for Indian schools to digitalize their workflow."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-base-200 antialiased">
        <div className="flex h-screen bg-base-200 font-sans">
          <SidebarNavigation
            collapsed={!sidebarOpen}
            toggleSidebar={toggleSidebar}
            role="student"
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header
              toggleSidebar={toggleSidebar}
              currentUser={userData || {}}
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-200 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
