// src/app/components/SideNavigation.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClipboardDocumentListIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx'; // Import clsx for conditional classes


const SideNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // New state for expanded/collapsed on large screens
  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); 
  };

  const toggleExpansion = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };


  const teacherNavItems = [
    { name: 'Mark Attendance', href: '/teacher/attendance', icon: ClipboardDocumentListIcon },
    { name: 'Student Reports', href: '/teacher/reports', icon: DocumentTextIcon },
    { name: 'Schedules', href: '/teacher/schedule', icon: CalendarIcon },
    { name: 'My Attendance', href: '/teacher/my-attendance', icon: ClockIcon },
    { name: 'Calendar', href: '/teacher/calendar', icon: CalendarIcon }, // You might want a different icon here if Calendar is already used for Schedules
  ];

  return (
    <div className="flex h-screen">
      {/* Hamburger menu for small screens */}
      <div className="md:hidden fixed top-0 left-0 z-20" style={{ position: 'fixed', top: 0, left: 0 }}>
        <button onClick={toggleMenu} className="p-4 focus:outline-none">
          {isSidebarExpanded ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Side navigation */}
      <div
        className={clsx(
          "flex flex-col bg-gray-800 text-white fixed inset-y-0 left-0 z-10 transform transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0 md:static md:h-screen',
          isSidebarExpanded ? 'md:w-64' : 'md:w-20'
        )}
      >
        <div className={clsx("flex items-center h-16 px-4", isSidebarExpanded ? 'justify-between' : 'justify-center')}>
          {isSidebarExpanded && <span className="text-2xl font-semibold">Teacher Menu</span>}
          <button onClick={toggleMenu} className="md:hidden focus:outline-none">
            <XMarkIcon className="h-6 w-6" />
          </button>
          {/* Toggle button for large screens */}
          <button onClick={toggleExpansion} className="hidden md:block focus:outline-none">
            {isSidebarExpanded ? <ChevronLeftIcon className="h-6 w-6" /> : <ChevronRightIcon className="h-6 w-6" />}
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {teacherNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-gray-700 group",
                !isSidebarExpanded && 'justify-center'
              )}
            >
              {<item.icon className={clsx("h-6 w-6", isSidebarExpanded ? 'mr-2' : '')} />}
              <span className={clsx(!isSidebarExpanded && "hidden group-hover:block absolute left-full ml-2 bg-gray-700 text-white text-xs rounded py-1 px-2")}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
        {/* Toggle button for large screens */}
        <div className="hidden md:flex justify-end p-4">
          <button onClick={toggleExpansion} className="text-gray-400 hover:text-white focus:outline-none">
            {isSidebarExpanded ? <ChevronLeftIcon className="h-6 w-6" /> : <ChevronRightIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Overlay for smaller screens when menu is open */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-10 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      <div className={`flex-1 overflow-y-auto p-6 md:ml-2`}>
        {/* Page content goes here */}
      </div>
    </div>
  );
}

export default SideNavigation;