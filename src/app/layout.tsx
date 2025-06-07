// app/layout.tsx

import { APP_NAME } from "@/app/constants"; // Assuming APP_NAME is defined in constants
import Head from "next/head"; // Keep for specific head tags if needed beyond metadata
import React from "react";
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
        {/* Removed custom font link as it is now in _document.tsx */}
      </Head>
      <body className="bg-gray-100 antialiased">
        <Providers>
          <div className="flex h-screen bg-blue-600 font-sans">
            <div className="flex-1 flex flex-col overflow-hidden">
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-0 m-0">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

export const metadata = {
  title: "Skhool - AI-Powered School Management",
  description:
    "Revolutionize your school management with Skhool. AI tools for attendance, grades, resources, and more.",
  openGraph: {
    title: "Skhool - AI-Powered School Management",
    description:
      "Revolutionize your school management with Skhool. AI tools for attendance, grades, resources, and more.",
    url: "https://skhool.co.in",
    siteName: "Skhool",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Skhool - AI-Powered School Management",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};
export const revalidate = 60;
