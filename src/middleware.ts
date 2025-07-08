import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const baseTeacherRoute = "/teacher";
const baseStudentRoute = "/student";
const baseAdminRoute = "/admin";

const loginRoute = `${process.env.API_URL}/auth/login`;

export function middleware(req: NextRequest) {
//   const userToken = req.cookies.get("USER")?.value;

//   console.error("Middleware triggered for request:", req.url);
//   const jsessionToken = req.cookies.get("JSESSIONID")?.value;
//     console.error("JSESSIONID cookie value:", jsessionToken);
//     console.error("USER cookie value:", userToken);

//   if (!userToken || !jsessionToken) {
//     console.log('login route=',loginRoute)
//     // If userToken or jsessionToken is not present, redirect to login page
//     return NextResponse.redirect(`${loginRoute}?redirect=${req.url}`);
//   }

//   // convert the above userToken base64 string to JSON object
//   let user;
//   try {
//     user = userToken
//       ? JSON.parse(Buffer.from(userToken, "base64").toString("utf-8"))
//       : null;
//   } catch (error) {
//     console.error("Failed to parse user token:", error);
//     user = null;
//   }
//   const isAuthenticated = user && user?.length > 0;
//   // 'ROLE_teacher'
//   const currentRole = user?.[0].split("_")[1]; // Extract the role from the token, e.g., 'teacher', 'student', 'admin'

//   if (!isAuthenticated && req.url!=='/') {
//     // If user is not authenticated, redirect to login page
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   console.log("User is authenticated:", user);
//     console.log("Current role:", currentRole);

//   // if user is logged in but trying to access the page that is not allowed for thier role, redirect to the base route of their role
//   if (
//     currentRole === "teacher" &&
//     req.nextUrl.pathname.startsWith(baseStudentRoute)
//   ) {
//     // If the user is a teacher and trying to access student routes, redirect to teacher dashboard
//     return NextResponse.redirect(new URL(baseTeacherRoute, req.url));
//   }
//   if (
//     currentRole === "student" &&
//     req.nextUrl.pathname.startsWith(baseTeacherRoute)
//   ) {
//     // If the user is a student and trying to access teacher routes, redirect to student dashboard
//     return NextResponse.redirect(new URL(baseStudentRoute, req.url));
//   }
//   if (
//     currentRole === "admin" &&
//     req.nextUrl.pathname.startsWith(baseStudentRoute)
//   ) {
//     // If the user is an admin and trying to access student routes, redirect to admin dashboard
//     return NextResponse.redirect(new URL(baseAdminRoute, req.url));
//   }
//   if (
//     currentRole === "admin" &&
//     req.nextUrl.pathname.startsWith(baseTeacherRoute)
//   ) {
//     // If the user is an admin and trying to access teacher routes, redirect to admin dashboard
//     return NextResponse.redirect(new URL(baseAdminRoute, req.url));
//   }

//   // If the user is authenticated and accessing the correct route, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher/:path*", "/student/:path*", "/admin/:path*"],
};
