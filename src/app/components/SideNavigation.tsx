
import React from 'react';
import { NavItem } from '@/app/types/types'; // Adjust the import path as necessary
import { 
  HomeIcon, UsersIcon, CalendarDaysIcon, DocumentChartBarIcon, 
  BookOpenIcon, SparklesIcon, Cog6ToothIcon, XMarkIcon, ChatBubbleLeftRightIcon
} from '@/app/components/icons'; // Ensure icons are correctly imported/defined in constants.tsx

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const navigationItems: NavItem[] = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Students', href: '#', icon: UsersIcon },
  { name: 'Attendance', href: '#', icon: CalendarDaysIcon },
  { name: 'Grades/Performance', href: '#', icon: DocumentChartBarIcon },
  { name: 'Learning Resources', href: '#', icon: BookOpenIcon },
  { name: 'AI Helper', href: '#', icon: ChatBubbleLeftRightIcon }, // Changed from Sparkles to Chat specific
  { name: 'Settings', href: '#', icon: Cog6ToothIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
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
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-skhool-blue-800 text-white transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
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
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                ${
                  item.current
                    ? 'bg-skhool-blue-900 text-white shadow-lg'
                    : 'text-skhool-blue-100 hover:bg-skhool-blue-700 hover:text-white'
                }`}
            >
              <item.icon className="h-6 w-6 mr-3" aria-hidden="true" />
              {item.name}
            </a>
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
    