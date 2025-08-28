// app/page.tsx
"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  CalendarPlus,
  ClipboardPlus,
  UserPlus,
} from "lucide-react";
import React from "react";
import { AdminDasboardRightPanel } from "../components/AdminDashboardRightPanel";
import { AttendanceCard } from "../components/common/AttendanceCard";
import { StatCard } from "../components/common/StatCard";
import { StudentDirectory } from "../components/StudentDirectory";
import axios from "../lib/axiosInstance"; // Adjust the path as necessary
import { Teacher } from "../types/types";
import { AssignmentsOverview } from "../components/AssignmentOverview";
import { TeacherRightSidebar } from "../components/TeacherRightSidebar";
import { MyClasses } from "../components/common/MyClassCards";

const classes = [
  {
    subject: "Mathematics",
    grade: "10th Grade",
    students: 32,
    color: "border-blue-500",
  },
  {
    subject: "Physics",
    grade: "10th Grade",
    students: 28,
    color: "border-purple-500",
  },
  {
    subject: "Algebra II",
    grade: "11th Grade",
    students: 25,
    color: "border-teal-500",
  },
];

const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<Teacher>(["currentUser"]);
  const { data: classData } = useQuery({
    queryKey: ["classData", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      const response = await axios.get(`/teacher/${currentUser.id}/classes`, {
        withCredentials: true,
      });
      return response.data;
    },
  });
  console.log({ currentUser, classData });

  return (
    <span className="flex flex-col gap-2">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Teacher Dashboard
          </h1>
          <p className="text-gray-500">Welcome, {currentUser?.firstname}</p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
            <CalendarDays size={16} />
            My Schedule
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700">
            <ClipboardPlus size={16} />
            Create Assignment
          </button>
        </div>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Stat Cards - Reusing the StatCard component with different data */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard title="My Students" value="85" />
            <StatCard title="Classes Assigned" value="3" />
            <StatCard title="Assignments to Grade" value="1" />
            <StatCard title="Upcoming Events" value="2" />
          </div>

          {/* My Classes Widget */}
          <MyClasses />

          {/* Assignments Overview Widget */}
          <AssignmentsOverview />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <TeacherRightSidebar />
        </div>
      </main>
    </span>
  );
};

export default DashboardPage;
