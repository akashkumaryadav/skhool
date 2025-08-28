import React from "react";
import "@/styles/globals.css"; // Import global styles including Tailwind directives
import Providers from "./providers";
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
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

// export const metadata = {
//   title: "Skhool - AI-Powered School Management",
//   description:
//     "Revolutionize your school management with Skhool. AI tools for attendance, grades, resources, and more.",
//   openGraph: {
//     title: "Skhool - AI-Powered School Management",
//     description:
//       "Revolutionize your school management with Skhool. AI tools for attendance, grades, resources, and more.",
//     url: "https://skhool.co.in",
//     siteName: "Skhool",
//     images: [
//       {
//         url: "/og-image.png",
//         width: 1200,
//         height: 630,
//         alt: "Skhool - AI-Powered School Management",
//       },
//     ],
//     locale: "en_IN",
//     type: "website",
//   },
// };
// export const revalidate = 60;
