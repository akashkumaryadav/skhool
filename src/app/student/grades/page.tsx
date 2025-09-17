// app/student/grades/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Student } from "../../types/types";
import { DocumentChartBarIcon, ChartBarIcon } from "../../constants";
import DashboardCard from "../../components/DashboardCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axiosInstance";

const generateGradeLetter = (percentage: number): string => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C+";
  if (percentage >= 40) return "C";
  if (percentage >= 33) return "D";
  return "F";
};

const StudentGradesPage: React.FC = () => {
  const [selectedExamType, setSelectedExamType] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<Student>(["currentUser"]);

  const { data: exams } = useQuery({
    queryKey: ["examTypesForStudent", currentUser?.classId],
    queryFn: async () =>
      (
        await axiosInstance.get("/api/exams/", {
          params: { classId: currentUser.classId },
        })
      ).data,
    initialData: [],
  });

  const { data: examGrades } = useQuery({
    queryKey: ["examGradesForStudent", selectedExamType],
    queryFn: async () =>
      (
        await axiosInstance.get(`/api/exams/${selectedExamType}/results`, {
          params: { studentId: currentUser.id },
        })
      ).data,
    initialData: [],
    enabled: !!selectedExamType,
  });

  React.useEffect(() => {
    if (!selectedExamType) {
      setSelectedExamType(exams?.[0]?.id);
    }
  }, [exams, selectedExamType]);

  const performanceForSelectedExam = useMemo(() => {
    if (!currentUser || !examGrades || !selectedExamType) {
      return {
        subjectGrades: [],
        overallPercentage: 0,
        overallGradeLetter: "N/A",
      };
    }

    const subjectGradesArray = examGrades?.map((grade) => ({
      subject: grade.subjectName,
      ...grade,
    }));

    let totalMarksObtained = 0;
    let totalMaxMarks = 0;
    subjectGradesArray.forEach((sg) => {
      totalMarksObtained += sg.marksObtained;
      totalMaxMarks += sg.totalMarks;
    });

    const overallPercentage =
      totalMaxMarks > 0
        ? parseFloat(((totalMarksObtained / totalMaxMarks) * 100).toFixed(2))
        : 0;

    return {
      subjectGrades: subjectGradesArray,
      overallPercentage: overallPercentage || 0,
      overallGradeLetter: generateGradeLetter(overallPercentage) || "",
    };
  }, [currentUser, examGrades, selectedExamType]);

  if (!currentUser) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl text-center">
        <DocumentChartBarIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <h1 className="text-xl font-semibold text-gray-700">
          Grades Not Available
        </h1>
        <p className="text-gray-500 mt-1">
          We couldn&apos;t find grade information for the demo student.
        </p>
      </div>
    );
  }

  console.log({ exams, performanceForSelectedExam });

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <DocumentChartBarIcon className="w-10 h-10 text-skhool-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">
          My Grades ({currentUser.firstname} {currentUser.lastname})
        </h1>
      </div>

      {/* Exam Type Filter */}
      <div className="p-4 bg-white shadow rounded-lg max-w-md">
        <label
          htmlFor="filter-exam-type-student"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Exam
        </label>
        <select
          id="filter-exam-type-student"
          value={selectedExamType || ""}
          onChange={(e) => setSelectedExamType(e.target.value)}
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
        >
          {exams?.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grades Overview Card */}
      <DashboardCard
        title={`Performance: ${selectedExamType}`}
        icon={<ChartBarIcon className="w-7 h-7 text-indigo-500" />}
      >
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700">
            Overall Summary
          </h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
            <p className="text-lg">
              Total Percentage:{" "}
              <span className="font-bold text-skhool-blue-600">
                {performanceForSelectedExam.overallPercentage.toFixed(2)}%
              </span>
            </p>
            <p className="text-lg">
              Overall Grade:
              <span
                className={`ml-2 px-2.5 py-0.5 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  performanceForSelectedExam.overallGradeLetter === "A+" ||
                  performanceForSelectedExam.overallGradeLetter === "A"
                    ? "bg-green-100 text-green-800"
                    : performanceForSelectedExam.overallGradeLetter === "B+" ||
                      performanceForSelectedExam.overallGradeLetter === "B"
                    ? "bg-blue-100 text-blue-800"
                    : performanceForSelectedExam.overallGradeLetter === "C+" ||
                      performanceForSelectedExam.overallGradeLetter === "C"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {performanceForSelectedExam.overallGradeLetter}
              </span>
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Subject-wise Grades
        </h3>
        {performanceForSelectedExam.subjectGrades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subject
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Marks Obtained
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Marks
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Percentage
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceForSelectedExam.subjectGrades.map((grade) => (
                  <tr
                    key={grade.subject}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {grade.subject}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {grade.marksObtained}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {grade.totalMarks}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {grade.percentage?.toFixed(2)}%
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          grade.grade === "A+" || grade.grade === "A"
                            ? "bg-green-100 text-green-800"
                            : grade.grade === "B+" || grade.grade === "B"
                            ? "bg-blue-100 text-blue-800"
                            : grade.grade === "C+" || grade.grade === "C"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {grade.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No grades found for this exam type.</p>
        )}
      </DashboardCard>
      <p className="text-xs text-center text-gray-500 mt-4">
        Note: Grades are subject to review. Contact your teacher for any
        clarifications.
      </p>
    </div>
  );
};

export default StudentGradesPage;
