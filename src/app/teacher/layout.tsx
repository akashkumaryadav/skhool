"use client";
import React from "react";
import Sidebar from "@/app/components/SideNavigation";
import Header from "@/app/components/Header";
import { APP_NAME } from "@/app/constants"; // Assuming APP_NAME is defined in constants
import Head from "next/head"; // Keep for specific head tags if needed beyond metadata
import { useCallback, useState } from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{APP_NAME}-teachers</title>
        <meta
          name="description"
          content="A modern dashboard for teachers at Skhool, facilitating student management, performance tracking, and access to AI-powered resources. Designed for Indian schools to digitalize their workflow."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-gray-100 antialiased">
        <div className="flex h-screen bg-blue-600 font-sans">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header toggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
