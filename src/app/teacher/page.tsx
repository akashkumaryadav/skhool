// app/page.tsx
"use client";
import React from "react";
import DashboardCard from "@/app/components/DashboardCard";
import StudentPerformanceChart from "@/app/components/StudentPerformanceChart";
import AttendanceOverview from "@/app/components/AttendanceOverview";
import QuickActions from "@/app/components/QuickAction";
import Announcements from "@/app/components/Announcements";
import LearningResourcesLink from "@/app/components/LearningResources";
import AIFaqWidget from "@/app/components/AIFaqWidget";
import {
  ChartBarIcon,
  CalendarDaysIcon,
  BoltIcon,
  MegaphoneIcon,
  BookOpenIcon,
  SparklesIcon,
  UsersIcon,
  PresentationChartLineIcon,
} from "@/app/components/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axiosInstance"; // Adjust the path as necessary
import { Teacher } from "../types/types";

const DashboardPage: React.FC = () => {
  const { data: userData } = useQuery<Teacher>({
    queryKey: ["userData"],
  });
  const { data: classData } = useQuery({
    queryKey: ["classData", userData?.id],
    queryFn: async () => {
      if (!userData?.id) return [];
      const response = await axios.get(`/teacher/${userData.id}/classes`, {
        withCredentials: true,
      });
      return response.data;
    },
  });
  console.log({ userData, classData });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {/* General Stats Cards */}
      <DashboardCard
        title="Total Students"
        icon={<UsersIcon className="w-8 h-8 text-skhool-blue-500" />}
      >
        <p className="text-3xl font-bold text-gray-700">350</p>
        <p className="text-sm text-green-500">+5 since last month</p>
      </DashboardCard>
      <DashboardCard
        title="Classes Assigned"
        icon={
          <PresentationChartLineIcon className="w-8 h-8 text-skhool-orange-500" />
        }
      >
        <p className="text-3xl font-bold text-gray-700">{classData?.length}</p>
        <p className="text-sm text-gray-500">
          Grades{" "}
          {classData?.map((c: { name: string; section: string }) =>
            c.name.concat(c.section).concat(" ")
          )}
        </p>
      </DashboardCard>

      <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
        <DashboardCard
          title="Attendance Overview"
          icon={<CalendarDaysIcon className="w-8 h-8 text-green-500" />}
        >
          <AttendanceOverview />
        </DashboardCard>
      </div>

      <div className="md:col-span-2 lg:col-span-3 xl:col-span-2">
        <DashboardCard
          title="Student Performance (Class Average)"
          icon={<ChartBarIcon className="w-8 h-8 text-indigo-500" />}
        >
          <StudentPerformanceChart />
        </DashboardCard>
      </div>

      <div className="md:col-span-2 lg:col-span-3 xl:col-span-2">
        <DashboardCard
          title="Quick Actions"
          icon={<BoltIcon className="w-8 h-8 text-yellow-500" />}
        >
          <QuickActions />
        </DashboardCard>
      </div>

      <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
        <DashboardCard
          title="School Announcements"
          icon={<MegaphoneIcon className="w-8 h-8 text-red-500" />}
        >
          <Announcements />
        </DashboardCard>
      </div>

      <div className="md:col-span-1 lg:col-span-1 xl:col-span-2">
        <DashboardCard
          title="Learning Resources"
          icon={<BookOpenIcon className="w-8 h-8 text-teal-500" />}
        >
          <LearningResourcesLink />
        </DashboardCard>
      </div>

      <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
        <DashboardCard
          title="AI-Powered FAQ"
          icon={<SparklesIcon className="w-8 h-8 text-purple-500" />}
        >
          <AIFaqWidget />
        </DashboardCard>
      </div>
    </div>
  );
};

export default DashboardPage;
