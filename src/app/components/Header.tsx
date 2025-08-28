"use client";
import {
  MagnifyingGlassIcon
} from "@/app/components/icons"; // Ensure icons are correctly imported/defined in constants.tsx
import { Menu } from "lucide-react";
import React from "react";

interface HeaderProps {
  toggleSidebar: () => void;
  currentUser?: Record<string, any>;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center w-full justify-between">
            <button
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-skhool-blue-500"
              aria-label="Open sidebar"
            >
              <Menu onClick={toggleSidebar} className="h-6 w-6" />
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
        </div>
      </div>
    </header>
  );
};

export default Header;
