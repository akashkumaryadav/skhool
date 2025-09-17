// app/student/dashboard/page.tsx
"use client";

import React from "react";
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  MegaphoneIcon,
} from "../constants";
import DashboardCard from "../components/DashboardCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/app/types/types";
import axiosInstance from "@/app/lib/axiosInstance";
import Router from "next/router";
import Link from "next/link";

// Mock data for student dashboard
const mockStudentSummary = {
  attendancePercentage: 92,
  unreadAnnouncements: 3,
  studentName: "Demo Student",
  studentClass: "7th",
  studentSection: "B",
  avatarUrl: "https://picsum.photos/seed/demostudent/100/100",
};

const StudentDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const currentUser: Student = queryClient.getQueryData(["currentUser"]);
  console.log({ currentUser });

  const { data: attendanceData } = useQuery({
    queryKey: ["studentAttendance", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      const response = await axiosInstance.get(
        `/student/${currentUser.id}/attendance`
      );
      return response.data;
    },
    enabled: !!currentUser?.id,
    initialData: {},
  });

  const { data: gradesData } = useQuery({
    queryKey: ["studentGrades", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      const response = await axiosInstance.get(
        `/student/${currentUser.id}/recent-grades`
      );
      return response.data;
    },
    enabled: !!currentUser?.id,
    initialData: {},
  });

  const { data: assignmentsData } = useQuery({
    queryKey: ["studentAssignments", currentUser?.classId],
    queryFn: async () => {
      if (!currentUser?.classId) return null;
      const response = await axiosInstance.get(
        `/api/assignments/class/${currentUser.classId}/${currentUser.section}/section`
      );
      return response.data;
    },
    enabled: !!currentUser?.classId,
    initialData: [],
  });

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <img
            src={currentUser.profilePic || mockStudentSummary.avatarUrl}
            alt="Student Avatar"
            className="w-24 h-24 rounded-full object-cover mb-4 sm:mb-0 sm:mr-6 shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {currentUser.firstname}
            </h1>
            <p className="text-gray-600 mt-1">
              Here&apos;s a quick overview of your academic activities.
            </p>
            <p className="mt-1 text-sm text-skhool-blue-600 font-medium">
              Class: {currentUser.className} - {currentUser.section}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Attendance Summary */}
        <DashboardCard
          title="My Attendance"
          icon={<CalendarDaysIcon className="w-7 h-7 text-green-500" />}
        >
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">
              {attendanceData.overallPercentage?.toFixed(2)}%
            </p>
            <p className="text-sm text-gray-500">Overall Attendance</p>
            <Link
              href={"/student/attendance"}
              // className="mt-3 text-sm text-skhool-blue-600 hover:underline"
            >
              View Details
            </Link>
          </div>
        </DashboardCard>

        {/* Recent Grades */}
        <DashboardCard
          title="Recent Grades"
          icon={<ChartBarIcon className="w-7 h-7 text-indigo-500" />}
        >
          {gradesData?.length > 0 ? (
            <ul className="space-y-2">
              {gradesData.slice(0, 3).map((grade) => (
                <li
                  key={grade.id}
                  className="text-sm p-2 bg-indigo-50 rounded-md"
                >
                  <span className="font-semibold text-indigo-700">
                    {grade.subjectName}
                  </span>
                  ({grade.exam?.name}):{" "}
                  <span className="font-bold">{grade.grade}</span> (
                  {grade.marksObtained})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No recent grades to display.
            </p>
          )}
          <Link href={"/student/grades"}>View All Grades</Link>
        </DashboardCard>

        {/* Upcoming Assignments */}
        <DashboardCard
          title="Upcoming Assignments"
          icon={<AcademicCapIcon className="w-7 h-7 text-red-500" />}
        >
          {assignmentsData.length > 0 ? (
            <ul className="space-y-2">
              {assignmentsData.map((assign) => (
                <li
                  key={assign.id}
                  className="text-sm p-2 bg-red-50 rounded-md"
                >
                  <span className="font-semibold text-red-700">
                    {assign.title}
                  </span>
                  ({assign.subjectName})
                  <p className="text-xs text-red-600">
                    Due in: {assign.dueDate}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No upcoming assignments.</p>
          )}
          <button
            onClick={() => alert("Navigate to Assignments page (placeholder)")}
            className="mt-3 text-sm text-skhool-blue-600 hover:underline"
          >
            View All Assignments
          </button>
        </DashboardCard>

        {/* Quick link to Learning Resources */}
        <DashboardCard
          title="Learning Resources"
          icon={<BookOpenIcon className="w-7 h-7 text-teal-500" />}
        >
          <p className="text-sm text-gray-600 mb-3">
            Explore study materials, videos, and notes uploaded by your
            teachers.
          </p>
          <button
            onClick={() => (window.location.href = "/student/resources")}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out"
          >
            Go to Resources
          </button>
        </DashboardCard>

        {/* School Announcements Teaser */}
        <DashboardCard
          title="Announcements"
          icon={<MegaphoneIcon className="w-7 h-7 text-skhool-orange-500" />}
        >
          <p className="text-sm text-gray-600">
            You have{" "}
            <span className="font-bold text-skhool-orange-600">
              {mockStudentSummary.unreadAnnouncements} unread announcements
            </span>
            . Stay updated with the latest school news.
          </p>
          <button
            onClick={() =>
              alert("Navigate to Announcements page (placeholder)")
            }
            className="mt-3 text-sm text-skhool-blue-600 hover:underline"
          >
            View Announcements
          </button>
        </DashboardCard>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
