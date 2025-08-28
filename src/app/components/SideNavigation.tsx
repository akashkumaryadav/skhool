// components/MarketingSidebar.tsx
"use client";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookA,
  BookCopy,
  Bot,
  CalendarCheck2,
  ChartBarIncreasing,
  Cog,
  LayoutDashboard,
  MoreHorizontal,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavItem as NavItemType, Teacher } from "../types/types";
import { usePathname } from "next/navigation";
import { accountNavItems, mainNavItems } from "../lib/navigationRoutes";

// Define prop types
interface SidebarProps {
  mode?: "light" | "dark";
  collapsed?: boolean;
  role?: "teacher" | "student" | "admin";
  toggleSidebar?: () => void;
}

// Define nav item types

// Helper component for navigation items to keep the main component clean
const NavItem: React.FC<
  NavItemType & { collapsed?: boolean; mode?: "light" | "dark" }
> = ({
  icon: Icon,
  name,
  href,
  current,
  notificationCount,
  collapsed = true,
  mode,
}) => {
  const isDark = mode === "dark";
  const baseClasses = "flex items-center p-2 rounded-lg cursor-pointer";
  const hoverClasses = isDark ? "hover:bg-blue-700" : "hover:bg-gray-100";
  const textClasses = current
    ? isDark
      ? "text-white font-semibold"
      : "text-gray-900 font-semibold"
    : isDark
    ? "text-gray-300"
    : "text-gray-600";

  return (
    <Link href={href}>
      <span className={`${baseClasses} ${hoverClasses} ${textClasses}`}>
        <Icon
          className={`w-5 h-5 transition-transform duration-300 ${
            current ? "scale-105" : ""
          }`}
        />
        {!collapsed && <span className="ml-4 text-sm">{name}</span>}
        {!collapsed && notificationCount && (
          <span
            className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
              name === "Notifications"
                ? "bg-green-400 text-green-900"
                : "bg-yellow-400 text-yellow-900"
            }`}
          >
            {notificationCount}
          </span>
        )}
      </span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  mode = "light",
  collapsed = true,
  role = "teacher",
  toggleSidebar = () => {},
}) => {
  const queryClient = useQueryClient();
  const currentPathName = usePathname();

  const currentUser = queryClient.getQueryData<Teacher>(["currentUser"]);
  const isDark = mode === "dark";

  console.log({ currentUser });

  const containerClasses = `flex flex-col hidden sm:hidden md:flex h-full transition-width duration-300 ${
    isDark ? "bg-blue-800 text-white" : "bg-white text-gray-800"
  } ${collapsed ? "w-20" : "w-72"} shadow-lg`;

  return (
    <div className={containerClasses}>
      {/* Top section */}
      <div
        className={`p-4 flex-grow flex flex-col ${
          collapsed ? "items-center" : ""
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          } mb-4`}
        >
          {/* {!collapsed && (
            <Search
              className={`w-5 h-5 ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            />
          )} */}
        </div>

        {/* Personal/Business Toggle
        {!collapsed && (
          <div
            className={`p-1 rounded-lg flex text-sm font-semibold my-4 ${
              isDark ? "bg-blue-900" : "bg-gray-100"
            }`}
          >
            <button
              className={`w-1/2 py-2 rounded-md ${
                isDark ? "bg-white text-blue-800" : "bg-blue-500 text-white"
              }`}
            >
              PERSONAL
            </button>
            <button
              className={`w-1/2 py-2 rounded-md ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              BUSINESS
            </button>
          </div>
        )} */}

        {/* Main Navigation */}
        <nav className="space-y-2">
          {mainNavItems.map(
            (item) =>
              (currentUser?.role === item?.role ||
                currentUser?.roles === item?.role) && (
                <NavItem
                  key={item.name}
                  {...item}
                  current={currentPathName === item.href}
                  collapsed={collapsed}
                  mode={mode}
                />
              )
          )}
        </nav>

        {/* Divider and Account section */}
        <hr
          className={`my-4 ${isDark ? "border-blue-700" : "border-gray-200"}`}
        />
        {!collapsed && (
          <p className="px-2 mb-2 text-xs font-semibold uppercase text-gray-400">
            Account
          </p>
        )}

        <nav className="space-y-2">
          {accountNavItems.map(
            (item) =>
              (currentUser?.role === item?.role ||
                currentUser?.roles === item?.roles) && (
                <NavItem
                  key={item.name}
                  {...item}
                  current={currentPathName === item.href}
                  collapsed={collapsed}
                  mode={mode}
                />
              )
          )}
        </nav>
      </div>

      {/* Bottom User Profile */}
      <div
        className={`p-3 border-t ${
          isDark ? "border-blue-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2 justify-center align-middle">
          {/* <Menu className="w-7 h-7" onClick={toggleSidebar} /> */}
          {!collapsed && (
            <span className="flex justify-center align-middle items-center gap-2">
              <Image
                src="https://cdnbbsr.s3waas.gov.in/s32d2ca7eedf739ef4c3800713ec482e1a/uploads/2023/04/2023042118.svg"
                alt="school-logo"
                width={120}
                height={120}
                className="h-12 w-12"
              />
              <span className="font-bold text-lg flex flex-col justify-center items-center scale-[0.75]">
                <span className="text-xs font-normal text-gray-400">
                  Powered by
                </span>
                <Image
                  src="/images/logo-dark.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-12 w-12"
                />
                <span className="text-xs font-normal text-gray-400">v1.0</span>
              </span>
            </span>
          )}
        </div>
        <div
          className={`p-2 rounded-lg flex items-center ${
            isDark ? "bg-blue-900" : "bg-gray-50"
          } ${collapsed ? "justify-center" : ""}`}
        >
          <Image
            src={
              currentUser?.profilePic ||
              `https://avatar.iran.liara.run/username?username=${currentUser?.firstname.toLowerCase()}`
            }
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-semibold">{currentUser?.firstname}</p>
              <p className="text-xs text-gray-400">
                {currentUser?.organizationEmail || currentUser?.personalEmail}
              </p>
            </div>
          )}
          {!collapsed && (
            <MoreHorizontal className="ml-auto w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
