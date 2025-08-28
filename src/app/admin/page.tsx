"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus, UserPlus } from "lucide-react";
import React from "react";
import { AdminDasboardRightPanel } from "../components/AdminDashboardRightPanel";
import { AttendanceCard } from "../components/common/AttendanceCard";
import { StatCard } from "../components/common/StatCard";
import { StudentDirectory } from "../components/StudentDirectory";
import axios from "../lib/axiosInstance"; // Adjust the path as necessary
import { Teacher } from "../types/types";

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
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Hi, {currentUser?.firstname} {currentUser?.lastname}
          </h1>
          <p className="text-gray-500">Welcome to Skhool.co.in</p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
            <CalendarPlus size={16} />
            Schedule Class
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700">
            <UserPlus size={16} />
            New Admission
          </button>
        </div>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value="5,252"
            />
            <StatCard
              title="Total Teachers"
              value="132"
            />
            <StatCard
              title="Working Staff"
              value="38"
            />
            <StatCard
              title="This Month Events"
              value="15"
            />
          </div>

          {/* Attendance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <AttendanceCard
              title="Student Attendance"
              present={4752}
              absent={437}
              color="text-orange-500"
            />
            <AttendanceCard
              title="Teachers Attendance"
              present={132}
              absent={4}
              color="text-pink-500"
            />
            <AttendanceCard
              title="Staff Attendance"
              present={32}
              absent={6}
              color="text-blue-500"
            />
          </div>

          {/* Student Directory */}
          <StudentDirectory />

          {/* Fees Collection Chart (Placeholder) */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-gray-800 text-lg">Fees Collection</h3>
            <p className="text-gray-500 mt-2">
              A beautiful bar chart component animated with react-spring would
              go here.
            </p>
            {/* You would place the <FeesCollectionChart /> here */}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <AdminDasboardRightPanel />
        </div>
      </main>
    </span>
  );
};

export default DashboardPage;
