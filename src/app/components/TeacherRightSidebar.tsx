// components/teacher/TeacherRightSidebar.tsx
import { Bell, BookCheck } from 'lucide-react';
import React from 'react';
import { AttendanceCard } from './common/AttendanceCard';

const TodaysSchedule = () => (
    <div className="p-4 bg-white rounded-xl shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Today&apos;s Schedule</h3>
        <div className="space-y-4">
            <div className="flex gap-4">
                <p className="text-sm font-semibold text-gray-500 w-16">09:00 AM</p>
                <div className="flex-1 border-l-2 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-800">Mathematics - 10th</p>
                    <p className="text-xs text-gray-500">Room 201</p>
                </div>
            </div>
            <div className="flex gap-4">
                <p className="text-sm font-semibold text-gray-500 w-16">11:00 AM</p>
                <div className="flex-1 border-l-2 border-purple-500 pl-4">
                    <p className="font-semibold text-gray-800">Physics - 10th</p>
                    <p className="text-xs text-gray-500">Lab 3</p>
                </div>
            </div>
            <div className="flex gap-4">
                <p className="text-sm font-semibold text-gray-500 w-16">01:00 PM</p>
                <div className="flex-1 border-l-2 border-gray-300 pl-4">
                    <p className="font-semibold text-gray-800">Lunch Break</p>
                </div>
            </div>
        </div>
    </div>
);

const UpcomingDeadlines = () => (
    <div className="p-4 bg-white rounded-xl shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Upcoming Deadlines</h3>
        <div className="space-y-3">
             <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <div className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center rounded-lg">
                    <Bell size={20}/>
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-800">Physics Lab Reports Due</p>
                    <p className="text-xs text-gray-500">28th July 2022</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-lg">
                    <BookCheck size={20}/>
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-800">Grade Submissions</p>
                    <p className="text-xs text-gray-500">30th July 2022</p>
                </div>
            </div>
        </div>
    </div>
);


export const TeacherRightSidebar = () => {
  return (
    <div className="space-y-6">
      <TodaysSchedule />
      {/* We can reuse the AttendanceCard for the teacher's own attendance! */}
      <AttendanceCard
        title="My Attendance (July)" 
        present={20} 
        absent={1} 
        color="text-teal-500"
      />
      <UpcomingDeadlines />
    </div>
  )
}