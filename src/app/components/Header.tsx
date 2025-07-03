"use client";
import React, { useState } from "react";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
} from "@/app/components/icons"; // Ensure icons are correctly imported/defined in constants.tsx
import { User } from "@/app/types/types"; // Adjust the import path as necessary
import Image from "next/image";

interface HeaderProps {
  toggleSidebar: () => void;
  currentUser: Record<string, any>;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, currentUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Placeholder user data
  //   const currentUser: User = {
  //     name: 'Mrs. Sharma',
  //     avatarUrl: 'https://picsum.photos/seed/teacher1/100/100',
  //     role: 'Teacher'
  //   };

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-skhool-blue-500 lg:hidden"
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            {/* Search (optional, can be expanded) */}
            <div className="hidden md:block ml-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students, resources..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700 hidden sm:block">
              Welcome,{" "}
              <span className="font-semibold">{currentUser.firstname}</span>!
            </span>
            {/* Notification Bell */}
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skhool-blue-500">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <div>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skhool-blue-500"
                  id="user-menu-button"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                    src={
                      currentUser.avatarUrl ||
                      "https://picsum.photos/seed/default-avatar/100/100"
                    }
                    alt={currentUser.firstname || "User Avatar"}
                  />
                </button>
              </div>
              {dropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
