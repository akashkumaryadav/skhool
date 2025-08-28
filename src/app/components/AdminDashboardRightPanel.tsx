// components/dashboard/RightSidebar.tsx
// This component will contain the Calendar, Activities, and Performance widgets.

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import React from 'react';

// A simplified, static calendar
const CalendarWidget = () => (
  <div className="p-4 bg-white rounded-xl shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-gray-800">My Progress</h3>
      <p className="font-semibold text-sm text-gray-700">JULY 2022</p>
    </div>
    <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
      <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span className="text-red-500">Su</span>
    </div>
    <div className="grid grid-cols-7 text-center text-sm">
      {/* Create a static representation of the calendar days */}
      {[...Array(4)].map((_, i) => <span key={`empty-${i}`} />)}
      {[...Array(31)].map((_, i) => {
        const day = i + 1;
        let className = "py-1";
        if ([1, 8, 9, 10, 11, 17, 18, 24, 25, 31].includes(day)) className += " text-red-500";
        if (day === 8) className += " bg-blue-500 text-white rounded-full";
        if (day === 13) className += " bg-pink-500 text-white rounded-full";
        if (day === 23) className += " bg-orange-400 text-white rounded-full";
        return <span key={day} className={className}>{day}</span>;
      })}
    </div>
    <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700">
      <Plus size={16}/> Add Event
    </button>
  </div>
);

const UpcomingActivities = () => (
    <div className="mt-6 p-4 bg-white rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Upcoming Activities</h3>
            <a href="#" className="text-sm text-indigo-600">See all</a>
        </div>
        <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-lg font-bold">8</div>
                <div>
                    <p className="font-semibold text-sm text-gray-800">Student Counselling</p>
                    <p className="text-xs text-gray-500">8th - 10th July 2021 • 11 A.M - 12 P.M</p>
                </div>
            </div>
             <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                <div className="w-10 h-10 bg-pink-500 text-white flex items-center justify-center rounded-lg font-bold">8</div>
                <div>
                    <p className="font-semibold text-sm text-gray-800">Teachers Meeting</p>
                    <p className="text-xs text-gray-500">8th - 10th July 2021 • 4 P.M - 5 P.M</p>
                </div>
            </div>
        </div>
    </div>
);

// We can make this one animated too, like the AttendanceCard
const ClassPerformance = () => (
    <div className="mt-6 p-4 bg-white rounded-xl shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Class Wise Performance</h3>
        {/* Simplified content */}
        <div className="text-center">
            <div className="inline-block relative w-32 h-32">
                 <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle className="text-orange-500" strokeWidth="10" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" transform="rotate(-90 50 50)" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <p className="text-2xl font-bold text-gray-800">75%</p>
                     <p className="text-sm text-gray-500">Good</p>
                 </div>
            </div>
            <div className="mt-4 flex justify-around text-sm">
                <div>
                    <p className="text-gray-500">Attendance Avg.</p>
                    <p className="font-bold text-lg text-gray-800">95%</p>
                </div>
                <div>
                    <p className="text-gray-500">Edu. Grade Avg.</p>
                    <p className="font-bold text-lg text-gray-800">B+</p>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-gray-500">
                <ChevronLeft size={20} />
                <span className="w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-full text-xs">1</span>
                <span className="text-xs">2</span>
                <span className="text-xs">3</span>
                <ChevronRight size={20} />
            </div>
        </div>
    </div>
);

export const AdminDasboardRightPanel = () => (
    <div className="space-y-6">
        <CalendarWidget />
        <UpcomingActivities />
        <ClassPerformance />
    </div>
);