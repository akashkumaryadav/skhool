// app/admin/page.tsx
"use client";

import React from 'react';
import DashboardCard from '../components/DashboardCard';
import {
  UsersIcon,
  UserPlusIcon,
  MegaphoneIcon,
  BuildingLibraryIcon,
  CurrencyRupeeIcon,
  MagnifyingGlassIcon,
} from '../constants';

const AdminPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Students" className="bg-sky-50">
           <p className="text-4xl font-bold text-sky-600">350</p>
        </DashboardCard>
        <DashboardCard title="Total Teachers" className="bg-amber-50">
           <p className="text-4xl font-bold text-amber-600">25</p>
        </DashboardCard>
        <DashboardCard title="Classes" className="bg-rose-50">
           <p className="text-4xl font-bold text-rose-600">15</p>
        </DashboardCard>
        <DashboardCard title="Active Notices" className="bg-emerald-50">
           <p className="text-4xl font-bold text-emerald-600">3</p>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
            {/* User Management */}
            <DashboardCard title="User Management" icon={<UsersIcon className="w-8 h-8 text-skhool-blue-500" />}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a href="/admin/teachers" className="flex flex-col items-center justify-center p-4 bg-skhool-blue-100 hover:bg-skhool-blue-200 rounded-lg transition-colors text-center">
                        <UserPlusIcon className="w-10 h-10 text-skhool-blue-600 mb-2" />
                        <span className="font-semibold text-skhool-blue-800">Add Teacher</span>
                    </a>
                    <a href="/admin/students" className="flex flex-col items-center justify-center p-4 bg-green-100 hover:bg-green-200 rounded-lg transition-colors text-center">
                        <UsersIcon className="w-10 h-10 text-green-600 mb-2" />
                        <span className="font-semibold text-green-800">Manage Students</span>
                    </a>
                    <a href="/admin/teachers" className="flex flex-col items-center justify-center p-4 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors text-center">
                        <UsersIcon className="w-10 h-10 text-orange-600 mb-2" />
                        <span className="font-semibold text-orange-800">Manage Teachers</span>
                    </a>
                </div>
            </DashboardCard>
             {/* School Settings */}
            <DashboardCard title="School Settings" icon={<BuildingLibraryIcon className="w-8 h-8 text-gray-500" />}>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tuition-fees" className="block text-sm font-medium text-gray-700">Tuition Fees (Annual)</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input type="text" name="tuition-fees" id="tuition-fees" className="block w-full rounded-md border-gray-300 pl-10 focus:border-skhool-blue-500 focus:ring-skhool-blue-500 sm:text-sm" placeholder="e.g., 50000"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="transport-fees" className="block text-sm font-medium text-gray-700">Transport Fees (Monthly)</label>
                             <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input type="text" name="transport-fees" id="transport-fees" className="block w-full rounded-md border-gray-300 pl-10 focus:border-skhool-blue-500 focus:ring-skhool-blue-500 sm:text-sm" placeholder="e.g., 2000"/>
                            </div>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="reopen-date" className="block text-sm font-medium text-gray-700">Next School Re-opening Date</label>
                        <input type="date" name="reopen-date" id="reopen-date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-skhool-blue-500 focus:ring-skhool-blue-500 sm:text-sm"/>
                    </div>
                    <div className="flex justify-end">
                         <button type="submit" onClick={(e) => {e.preventDefault(); alert("Settings Saved!")}} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-skhool-blue-600 hover:bg-skhool-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skhool-blue-500">
                            Save Settings
                        </button>
                    </div>
                </form>
            </DashboardCard>
        </div>
        
        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
            {/* Search User */}
             <DashboardCard title="Find User" icon={<MagnifyingGlassIcon className="w-7 h-7 text-gray-500" />}>
                 <div className="relative">
                    <input type="search" placeholder="Search by name, ID, or contact..." className="block w-full pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"/>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </DashboardCard>

            {/* Communications */}
            <DashboardCard title="School Communications" icon={<MegaphoneIcon className="w-8 h-8 text-red-500" />}>
                <form className="space-y-4">
                     <div>
                        <label htmlFor="notice-title" className="block text-sm font-medium text-gray-700">Notice Title</label>
                        <input type="text" name="notice-title" id="notice-title" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-skhool-blue-500 focus:ring-skhool-blue-500 sm:text-sm" placeholder="e.g., Annual Sports Day"/>
                    </div>
                    <div>
                        <label htmlFor="notice-content" className="block text-sm font-medium text-gray-700">Message / Notice</label>
                        <textarea name="notice-content" id="notice-content" rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-skhool-blue-500 focus:ring-skhool-blue-500 sm:text-sm" placeholder="Enter the full details of the announcement..."></textarea>
                    </div>
                     <div className="flex justify-end">
                        <button type="submit" onClick={(e) => {e.preventDefault(); alert("Notice has been sent!")}} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Send Notice to All
                        </button>
                    </div>
                </form>
            </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;