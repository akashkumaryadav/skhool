// app/layout.tsx
"use client"; // This is a client component because it manages sidebar state

import Header from "@/app/components/Header";
import Sidebar from "@/app/components/SideNavigation";
import { APP_NAME } from "@/app/constants"; // Assuming APP_NAME is defined in constants
import Head from "next/head"; // Keep for specific head tags if needed beyond metadata
import React, { useCallback, useState } from "react";
import "../app/styles/globals.css"; // Import global styles including Tailwind directives
import Providers from "./providers";

// Metadata can be exported statically for Server Components,
// but for dynamic titles or if layout is client component, manage via Head or useEffect
// For a client root layout, dynamic metadata might be more complex.
// Next.js recommends static metadata where possible.
// Let's set a basic static metadata approach here for title.
// For more complex scenarios, refer to Next.js documentation on metadata.

// export const metadata = {
//   title: 'Skhool - Teacher Dashboard',
//   description: 'A modern dashboard for teachers at Skhool, facilitating student management, performance tracking, and access to AI-powered resources. Designed for Indian schools to digitalize their workflow.',
// };

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
        {/* For Next.js 13+ App Router, title and meta tags are often handled by the Metadata API */}
        {/* However, if you need direct control or have specific tags, Head can still be used. */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{APP_NAME}</title>
        <meta
          name="description"
          content="A modern dashboard for teachers at Skhool, facilitating student management, performance tracking, and access to AI-powered resources. Designed for Indian schools to digitalize their workflow."
        />
        <link rel="icon" href="/favicon.ico" /> {/* Example favicon */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-gray-100 antialiased">
        <Providers>
          <div className="flex h-screen bg-blue-600 font-sans">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header toggleSidebar={toggleSidebar} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
