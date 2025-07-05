// app/grades/page.tsx
"use client";

import { ArrowDownTrayIcon, PlusCircleIcon } from "@/app/components/icons";
import {
  StudentComprehensiveGrades,
  StudentPerformanceSummary,
} from "@/app/types/types";
import { useQuery } from "@tanstack/react-query";
import axios from "../../lib/axiosInstance"; // Adjust the path as necessary
import Link from "next/link";
import React, { useMemo, useState } from "react";

const GradesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<string>("");

  const { data: studentGrades = [], isLoading } = useQuery({
    queryKey: [
      "studentPerformanceData",
      selectedClass,
      selectedSection,
      selectedExamType,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `/grades/summary?studentClass=${selectedClass}&section=${selectedSection}&term=${selectedExamType}`,
        { withCredentials: true }
      );
      return response.data;
    },
    placeholderData: [],
    refetchOnWindowFocus: false,
  });

  const filteredStudentGrades = useMemo(() => {
    return studentGrades.filter((student: StudentComprehensiveGrades) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [studentGrades, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Student Grades & Performance
        </h1>
        <div className="flex gap-2">
          <Link
            href="grades/add"
            className="flex items-center bg-primary hover:bg-skhool-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 focus:ring-opacity-75"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add New Grades
          </Link>
          <button
            onClick={() => {}}
            className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white shadow rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="relative">
            <label
              htmlFor="search-student-grade"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Student
            </label>
            <input
              type="text"
              id="search-student-grade"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="select-class"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Class
            </label>
            <select
              id="select-class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            >
              <option value="">Select Class</option>
              {/* Options for classes will be dynamically populated */}
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>
          </div>
          <div className="relative">
            <label
              htmlFor="select-section"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Section
            </label>
            <select
              id="select-section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            >
              <option value="">Select Section</option>
              {/* Options for sections will be dynamically populated */}
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
          <div className="relative">
            <label
              htmlFor="select-exam-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Exam Type
            </label>
            <select
              id="select-exam-type"
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            >
              <option value="">Select Exam Type</option>
              {/* Options for exam types will be dynamically populated */}
              <option value="Term 1">Midterm Exam</option>
              <option value="2">Final Exam</option>
              <option value="unit-test">Unit Test</option>
              <option value="project">Project</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
              <option value="practical">Practical Exam</option>
              <option value="oral">Oral Exam</option>
              <option value="final">Final Exam</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll No
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overall Percentage
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Marks
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Loading performance data...
                </td>
              </tr>
            ) : filteredStudentGrades.length > 0 ? (
              filteredStudentGrades.map(
                (student: StudentPerformanceSummary) => (
                  <tr
                    key={student.studentId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      {student.studentName}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.rollNo}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {student.overallPercentage}%
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.totalObtainedMarks}/{student.overAllMarks}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() =>
                          alert(`View report for ${student.studentName}`)
                        }
                        className="text-skhool-blue-600 hover:text-skhool-blue-800 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 rounded"
                        title="View Full Report"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No student performance data found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesPage;
