"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { AdminDasboardRightPanel } from "../components/AdminDashboardRightPanel";
import { AttendanceCard } from "../components/common/AttendanceCard";
import { StatCard } from "../components/common/StatCard";
import { StudentDirectory } from "../components/StudentDirectory";
import { ExamDashboardWidget } from "../components/exams/ExamDashboardWidget";
import axios from "../lib/axiosInstance"; // Adjust the path as necessary
import { Teacher, User } from "../types/types";
import AddStudent from "../components/AddStudent";
import axiosInstance from "../lib/axiosInstance";
import moment from "moment";
import { translateAiFiltersToApiFilters } from "../lib/utils";
import { FilterCondition } from "../components/common/GenericTable";

const DashboardPage: React.FC = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: studentCount } = useQuery({
    queryKey: ["studentCount"],
    queryFn: async () => (await axiosInstance.get("/student/count")).data,
    placeholderData: {},
  });
  const { data: teacherCount } = useQuery({
    queryKey: ["teacherCount"],
    queryFn: async () => (await axiosInstance.get("/teacher/count")).data,
    placeholderData: {},
  });
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => (await axiosInstance.get("/user/me")).data,
    placeholderData: {},
  });
  const { data: classData } = useQuery({
    queryKey: ["classData", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      const response = await axiosInstance.get(
        `/teacher/${currentUser.id}/classes`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
  });
  console.log({ currentUser, classData });

  const { data: attendanceCount } = useQuery({
    queryKey: ["attendanceCount"],
    queryFn: async () =>
      (
        await axiosInstance.get("/student/attendance-count", {
          params: { start: moment().format("YYYY-MM-DD") },
        })
      ).data,
    placeholderData: {},
  });

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
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
            onClick={() => setOpen(true)}
          >
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
            <StatCard title="Total Students" value={studentCount.count || 0} />
            <StatCard title="Total Teachers" value={teacherCount.count} />
            <StatCard title="Working Staff" value="38" />
            <StatCard title="This Month Events" value="15" />
          </div>

          {/* Attendance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <AttendanceCard
              title="Student Attendance"
              present={attendanceCount.PRESENT}
              absent={attendanceCount.LATE}
              color="text-orange-500"
            />
            <AttendanceCard
              title="Teachers Attendance"
              present={attendanceCount.PRESENT}
              absent={100}
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

          {/* Exam Management Widget */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <ExamDashboardWidget />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <AdminDasboardRightPanel />
          <AddStudent
            bulkUpload={false}
            open={open}
            onClose={() => setOpen(false)}
          />
        </div>
      </main>
    </span>
  );
};

export default DashboardPage;
