import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  //add support to handle bearer token also

  const jsessionToken =
    req.cookies.get("auth_token")?.value ||
    req.cookies.get("JSESSIONID")?.value;
  const userToken = req.cookies.get("USER")?.value || jsessionToken;
  const { pathname } = req.nextUrl;

  console.log("Middleware triggered for request:", req.url);

  // If accessing root path, allow through

  // // If no session cookies, redirect to landing page
  // if (!userToken || !jsessionToken) {
  //   console.log("No session cookies found, redirecting to landing page");
  //   if (pathname === "/auth/login") {
  //     return NextResponse.next();
  //   }
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // Parse user token to get role information
  let user;
  try {
    try {
      user = userToken
        ? JSON.parse(Buffer.from(userToken, "base64").toString("utf-8"))
        : null;
    } catch {
      console.error("Failed to parse user token:");
      user = JSON.parse(atob(userToken.split(".")[1]));
    }
  } catch (error) {
    console.error("Failed to parse user token:", error);
    // If token is invalid, redirect to landing page
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isAuthenticated = user && user.email;

  console.log("User is authenticated:", isAuthenticated);

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to landing page");
    if (pathname === "/auth/login") {
      return NextResponse.next();
    }
    if (pathname == "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Extract role from token (format: 'ROLE_admin', 'ROLE_teacher', 'ROLE_student')
  const currentRole =
    user?.roles[0]?.split("_")[1]?.toLowerCase() ||
    user?.[0]?.split("_")[1]?.toLowerCase(); // Extract role: 'admin', 'teacher', 'student'

  console.log("Current user role:", currentRole);

  if (pathname === "/") {
    if (pathname.startsWith("/") && isAuthenticated) {
      console.log("User is authenticated, redirecting to role-specific route");

      switch (currentRole) {
        case "admin":
          return NextResponse.redirect(new URL("/admin", req.url));
        case "teacher":
          return NextResponse.redirect(new URL("/teacher", req.url));
        case "student":
          return NextResponse.redirect(new URL("/student", req.url));
      }
    }
    return NextResponse.next();
  }

  // Define role-based route patterns
  const roleRoutes = {
    admin: "/admin",
    teacher: "/teacher",
    student: "/student",
    default: "/",
  };

  // Check if user is accessing the correct role-based route
  const expectedRoute = roleRoutes[currentRole as keyof typeof roleRoutes];
  console.log("Expected route:", expectedRoute);
  if (!expectedRoute) {
    console.log("Unknown role, redirecting to landing page");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is accessing a role-based route that doesn't match their role
  if (pathname.startsWith("/admin") && currentRole !== "admin") {
    console.log(
      `Non-admin user trying to access admin route, redirecting to ${expectedRoute}`
    );
    return NextResponse.redirect(new URL(expectedRoute, req.url));
  }

  if (pathname.startsWith("/teacher") && currentRole !== "teacher") {
    console.log(
      `Non-teacher user trying to access teacher route, redirecting to ${expectedRoute}`
    );
    return NextResponse.redirect(new URL(expectedRoute, req.url));
  }

  if (pathname.startsWith("/student") && currentRole !== "student") {
    console.log(
      `Non-student user trying to access student route, redirecting to ${expectedRoute}`
    );
    return NextResponse.redirect(new URL(expectedRoute, req.url));
  }

  // If user is authenticated and accessing correct role route, allow through
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/teacher/:path*",
    "/student/:path*",
    "/admin/:path*",
    "/auth/login",
    "/",
  ],
};
