"use client";
import React from "react";
import Layout from "../components/Layout";

interface RootLayoutProps {
  children: React.ReactNode;
}
// export default function RootLayout({ children }: RootLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = useCallback(() => {
//     setSidebarOpen((prev) => !prev);
//   }, []);

//   const { data: userData } = useQuery({
//     queryKey: ["userData"],
//     queryFn: async () => {
//       const response = await axios.get("/user/me");
//       return response.data;
//     },
//     staleTime: Infinity,
//     refetchOnWindowFocus: false,
//     retry: false,
//   });

//   return (
//     <html lang="en">
//       <Head>
//         <meta charSet="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>{APP_NAME}-student</title>
//         <meta
//           name="description"
//           content="A modern dashboard for teachers at Skhool, facilitating student management, performance tracking, and access to AI-powered resources. Designed for Indian schools to digitalize their workflow."
//         />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <body className="bg-base-200 antialiased">
//         <div className="flex h-screen bg-base-200 font-sans">

//         </div>
//       </body>
//     </html>
//   );
// }

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
