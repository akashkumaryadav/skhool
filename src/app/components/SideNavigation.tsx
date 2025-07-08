import React from "react";
import { NavItem } from "@/app/types/types"; // Adjust the import path as necessary
import {
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  DocumentChartBarIcon,
  BookOpenIcon,
  SparklesIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
} from "@/app/components/icons"; // Ensure icons are correctly imported/defined in constants.tsx
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  role?: string; // Optional prop to differentiate between teacher and student views
}

const navigationItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/teacher/",
    icon: HomeIcon,
    current: true,
    role: "teacher", // Added role to differentiate
  },
  { name: "Students", href: "/teacher/students", icon: UsersIcon , role: "teacher" },
  { name: "Attendance", href: "/teacher/attendance", icon: CalendarDaysIcon, role: "teacher" },
  {
    name: "Grades/Performance",
    href: "/teacher/grades",
    icon: DocumentChartBarIcon,
    role: "teacher",
  },
  {
    name: "Learning Resources",
    href: "/teacher/resources",
    icon: BookOpenIcon,
    role: "teacher",
  },
  {
    name: "AI Helper",
    href: "/teacher/ai-helper",
    icon: ChatBubbleLeftRightIcon,
    role: "teacher",
  }, // Changed from Sparkles to Chat specific
  { name: "Settings", href: "/teacher/settings", icon: Cog6ToothIcon , role: "teacher" },

  {
    name: "Student Dashboard",
    href: "/student/dashboard",
    icon: HomeIcon,
    role: "student",
  },
  {
    name: "My Courses",
    href: "/student/courses",
    icon: AcademicCapIcon,
    role: "student",
  },
  {
    name: "My Grades",
    href: "/student/grades",
    icon: DocumentChartBarIcon,
    role: "student",
  },
  {
    name: "My Attendance",
    href: "/student/attendance",
    icon: CalendarDaysIcon,
    role: "student",
  },
  {
    name: "View Resources",
    href: "/student/resources",
    icon: BookOpenIcon,
    role: "student",
  },
  {
    name: "Student Settings",
    href: "/student/settings",
    icon: Cog6ToothIcon,
    role: "student",
  },
  // for admins
  {
    name: "Admin Dashboard",
    href: "/admin/",
    icon: HomeIcon,
    current: true,
    role: "admin",
  },
  { name: "Manage Teachers", href: "/admin/teachers", icon: UsersIcon, role: "admin" },
  { name: "Manage Students", href: "/admin/students", icon: UsersIcon, role: "admin" },
  {
    name: "Admin AI Helper",
    href: "/admin/ai-helper",
    icon: ChatBubbleLeftRightIcon,
    role: "admin",
  }, // Changed from Sparkles to Chat specific
  { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon, role: "admin" },

];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, role }) => {
  const [selected, setSelected] = React.useState<string>(
    navigationItems.find((item) => item.current)?.name || ""
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-neutral text-white transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-skhool-blue-700">
          <a href="#" className="flex items-center space-x-2">
            <SparklesIcon className="h-8 w-8 text-skhool-orange-500" />
            <span className="text-2xl font-bold">{`Skhool`}</span>
          </a>
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems
            .filter((n) => n.role === role)
            .map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setSelected(item.name);
                }}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                ${
                  selected === item.name
                    ? "bg-base-100 text-base-content shadow-lg"
                    : "text-skhool-blue-100 hover:bg-skhool-blue-700 hover:text-white"
                }`}
              >
                <item.icon className="h-6 w-6 mr-3" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
        </nav>

        <div className="px-6 py-4 border-t border-skhool-blue-700">
          <p className="text-xs text-skhool-blue-300">
            &copy; {new Date().getFullYear()} Skhool.co.in
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
