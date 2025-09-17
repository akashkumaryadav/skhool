"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Users, Award, Target } from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import { ExamAnalytics as ExamAnalyticsType } from "../../types/types";

interface ExamAnalyticsProps {
  selectedExamId: string | null;
}

export const ExamAnalytics: React.FC<ExamAnalyticsProps> = ({
  selectedExamId,
}) => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["examAnalytics", selectedExamId],
    queryFn: async () => {
      if (!selectedExamId) return null;
      const response = await axiosInstance.get(
        `/exams/${selectedExamId}/analytics`
      );
      return response.data as ExamAnalyticsType;
    },
    enabled: !!selectedExamId,
  });

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  if (!selectedExamId) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Analytics</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BarChart className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Select an exam to view analytics</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Analytics</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Analytics</h3>
        <p className="text-gray-500 text-center py-8">
          No analytics data available
        </p>
      </div>
    );
  }

  const gradeData = Object.entries(analytics.gradeDistribution).map(
    ([grade, count]) => ({
      grade,
      count,
    })
  );

  const performanceData = [
    { name: "Highest", value: analytics.highestMarks },
    { name: "Average", value: analytics.averageMarks },
    { name: "Lowest", value: analytics.lowestMarks },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Key Metrics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.studentsAppeared}
            </p>
            <p className="text-sm text-gray-500">Students Appeared</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.passPercentage.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Pass Rate</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.averageMarks.toFixed(1)}
            </p>
            <p className="text-sm text-gray-500">Average Score</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.highestMarks}
            </p>
            <p className="text-sm text-gray-500">Highest Score</p>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Performance Overview
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grade Distribution */}
      {gradeData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Grade Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={gradeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ grade, count }) => `${grade}: ${count}`}
              >
                {gradeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Comparison</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Class Average</span>
            <span className="font-medium text-gray-900">
              {analytics.classAverage.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Subject Average</span>
            <span className="font-medium text-gray-900">
              {analytics.subjectAverage.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Exam Average</span>
            <span className="font-medium text-gray-900">
              {analytics.averageMarks.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
