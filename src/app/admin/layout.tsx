import React from "react";
import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="bg-base-200 antialiased">
      <div className="flex h-screen bg-base-200 font-sans">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Layout>{children}</Layout>
        </div>
      </div>
    </div>
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
