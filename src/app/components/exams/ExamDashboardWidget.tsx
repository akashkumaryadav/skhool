"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Link from "next/link";
import axiosInstance from "../../lib/axiosInstance";

export const ExamDashboardWidget: React.FC = () => {
  const { data: examStats } = useQuery({
    queryKey: ["examDashboardWidget"],
    queryFn: async () => {
      const response = await axiosInstance.get("/exams/dashboard/widget");
      return response.data;
    },
  });

  const { data: recentExams = [] } = useQuery({
    queryKey: ["recentExamsWidget"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/exams/");
      return response.data;
    },
  });

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const gradeData = examStats?.gradeDistribution || [];

  return (
    <div className="space-y-6">
      {/* Exam Stats Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Exam Overview</h3>
          <Link
            href="/admin/exams/dashboard"
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {examStats?.totalExams || 0}
            </p>
            <p className="text-xs text-gray-500">Total Exams</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {examStats?.studentsAssessed || 0}
            </p>
            <p className="text-xs text-gray-500">Students</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {examStats?.averageScore?.toFixed(1) || 0}%
            </p>
            <p className="text-xs text-gray-500">Avg Score</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
              <BarChart3 className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {examStats?.passRate?.toFixed(1) || 0}%
            </p>
            <p className="text-xs text-gray-500">Pass Rate</p>
          </div>
        </div>
      </div>

      {/* Grade Distribution & Recent Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4">
            Grade Distribution
          </h4>
          {gradeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={gradeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="count"
                  label={({ grade, count }) => `${grade}: ${count}`}
                  labelLine={false}
                  fontSize={10}
                >
                  {gradeData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No data available</p>
            </div>
          )}
        </div>

        {/* Recent Exams */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-800">
              Recent Exams
            </h4>
            <Link
              href="/admin/exams"
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentExams.length > 0 ? (
              recentExams.map((exam: any) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {exam.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {exam.subject} • {exam.className}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      exam.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : exam.status === "Ongoing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {exam.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No recent exams</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">
          Quick Actions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/exams"
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Create Exam</p>
              <p className="text-xs text-gray-500">Set up new exam</p>
            </div>
          </Link>

          <Link
            href="/admin/exams/reports"
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">View Reports</p>
              <p className="text-xs text-gray-500">Generate reports</p>
            </div>
          </Link>

          <Link
            href="/admin/exams/dashboard"
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Analytics</p>
              <p className="text-xs text-gray-500">View insights</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
