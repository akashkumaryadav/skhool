// lib/navigation.ts

import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  BookCopy,
  BookA,
  Cog,
  Bot,
  FileText,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SiteRoute } from "../components/commandPallete/CommandPallete";

// Define the type for our navigation items
export interface NavItemType {
  name: string;
  href: string;
  icon: LucideIcon;
  current?: boolean;
  role: "teacher" | "student" | "admin";
}

// --- YOUR PROVIDED NAVIGATION DATA ---

export const mainNavItems: NavItemType[] = [
  // Teacher Routes
  {
    name: "Dashboard",
    href: "/teacher",
    icon: LayoutDashboard,
    current: true,
    role: "teacher",
  },
  { name: "Students", href: "/teacher/students", icon: Users, role: "teacher" },
  {
    name: "Attendance",
    href: "/teacher/attendance",
    icon: CalendarCheck2,
    role: "teacher",
  },
  {
    name: "Grades/Performance",
    href: "/teacher/grades",
    icon: Users,
    role: "teacher",
  }, // Assuming a different icon was intended
  {
    name: "Learning Resources",
    href: "/teacher/resources",
    icon: BookCopy,
    role: "teacher",
  },

  // Student Routes
  {
    name: "Student Dashboard",
    href: "/student/",
    icon: LayoutDashboard,
    role: "student",
  },
  {
    name: "My Courses",
    href: "/student/courses",
    icon: BookA,
    role: "student",
  },
  { name: "My Grades", href: "/student/grades", icon: Users, role: "student" },
  {
    name: "My Attendance",
    href: "/student/attendance",
    icon: CalendarCheck2,
    role: "student",
  },
  {
    name: "View Resources",
    href: "/student/resources",
    icon: BookA,
    role: "student",
  },
  {
    name: "Student Settings",
    href: "/student/settings",
    icon: Cog,
    role: "student",
  },

  // Admin Routes
  {
    name: "Admin Dashboard",
    href: "/admin/",
    icon: LayoutDashboard,
    current: true,
    role: "admin",
  },
  {
    name: "Manage Teachers",
    href: "/admin/teachers",
    icon: Users,
    role: "admin",
  },
  {
    name: "Manage Students",
    href: "/admin/students",
    icon: Users,
    role: "admin",
  },
  {
    name: "Exam Management",
    href: "/admin/exams",
    icon: FileText,
    role: "admin",
  },
  {
    name: "Exam Analytics",
    href: "/admin/exams/dashboard",
    icon: BarChart3,
    role: "admin",
  },
  {
    name: "Schedule Management",
    href: "/admin/manage/schedule",
    icon: Users,
    role: "admin",
  },
];

export const accountNavItems: NavItemType[] = [
  { name: "AI Helper", href: "/teacher/ai-helper", icon: Bot, role: "teacher" },
  { name: "Settings", href: "/teacher/settings", icon: Cog, role: "teacher" },
  { name: "AI Helper", href: "/admin/ai-helper", icon: Bot, role: "admin" },
  { name: "Settings", href: "/admin/settings", icon: Cog, role: "admin" },
];

// --- PROCESS AND EXPORT A SINGLE, UNIFIED LIST FOR THE AI ---

// Combine all routes into a single array
export const allNavItems = [...mainNavItems, ...accountNavItems];

// Transform the combined array into the simple { path, name, description } format
// that our AI system expects.
export const AppRoutesForAI: SiteRoute[] = allNavItems.map((item) => ({
  path: item.href,
  name: item.name,
  // The 'name' is descriptive enough to also be used as the description for the AI.
  description: `Navigate to ${item.name} page for the ${item.role} role.`,
}));
