// app/student/grades/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { StudentComprehensiveGrades } from "../../types/types";
import { DocumentChartBarIcon, ChartBarIcon } from "../../constants";
import DashboardCard from "../../components/DashboardCard";

// Mock Data - Using the same structure as teacher's grade page but will filter for logged-in student
// We will use 's1' as the default student for this demo page since auth is removed.
const MOCK_ALL_STUDENT_GRADES: StudentComprehensiveGrades[] = [
  {
    id: "s1",
    studentId: "SKL001",
    firstname: "Aarav",
    lastname: "Sharma",
    className: "7th",
    section: "B",
    rollNo: 1,
    gender: "Male",
    dateOfBirth: "2011-05-15",
    parentName: "Mr. Rajesh Sharma",
    parentContact: "9876543210",
    profilePic: "https://picsum.photos/seed/aarav/40/40",
    performance: {
      "Mid-Term 1": {
        Maths: {
          marksObtained: 85,
          totalMarks: 100,
          percentage: 85,
          gradeLetter: "A",
        },
        Science: {
          marksObtained: 78,
          totalMarks: 100,
          percentage: 78,
          gradeLetter: "B+",
        },
        English: {
          marksObtained: 92,
          totalMarks: 100,
          percentage: 92,
          gradeLetter: "A+",
        },
        "Social Studies": {
          marksObtained: 80,
          totalMarks: 100,
          percentage: 80,
          gradeLetter: "A",
        },
      },
      "Final Exam": {
        Maths: {
          marksObtained: 90,
          totalMarks: 100,
          percentage: 90,
          gradeLetter: "A+",
        },
        Science: {
          marksObtained: 82,
          totalMarks: 100,
          percentage: 82,
          gradeLetter: "A",
        },
        English: {
          marksObtained: 88,
          totalMarks: 100,
          percentage: 88,
          gradeLetter: "A",
        },
        "Social Studies": {
          marksObtained: 85,
          totalMarks: 100,
          percentage: 85,
          gradeLetter: "A",
        },
      },
    },
  },
  // Add another student's data if needed for testing, but 's1' will be the primary for display
  {
    id: "s2",
    studentId: "SKL002",
    firstname: "Priya",
    lastname: "Singh",
    className: "8th",
    section: "A",
    rollNo: 5,
    gender: "Female",
    dateOfBirth: "2010-03-20",
    parentName: "Mrs. Anita Singh",
    parentContact: "anita.singh@example.com",
    profilePic: "https://picsum.photos/seed/priya/40/40",
    performance: {
      "Mid-Term 1": {
        Maths: {
          marksObtained: 75,
          totalMarks: 100,
          percentage: 75,
          gradeLetter: "B+",
        },
        Science: {
          marksObtained: 88,
          totalMarks: 100,
          percentage: 88,
          gradeLetter: "A",
        },
      },
      "Final Exam": {
        Maths: {
          marksObtained: 80,
          totalMarks: 100,
          percentage: 80,
          gradeLetter: "A",
        },
        Science: {
          marksObtained: 92,
          totalMarks: 100,
          percentage: 92,
          gradeLetter: "A+",
        },
      },
    },
  },
];

const MOCK_EXAM_TYPES_FOR_STUDENT_S1 = MOCK_ALL_STUDENT_GRADES[0]
  ? Object.keys(MOCK_ALL_STUDENT_GRADES[0].performance)
  : ["Mid-Term 1", "Final Exam"];

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
  const [selectedExamType, setSelectedExamType] = useState<string>(
    MOCK_EXAM_TYPES_FOR_STUDENT_S1[0]
  );

  // Use the first student ('s1') as the demo student since auth is removed.
  const studentData =
    MOCK_ALL_STUDENT_GRADES.find((s) => s.id === "s1") || null;

  const performanceForSelectedExam = useMemo(() => {
    if (!studentData || !studentData.performance[selectedExamType]) {
      return {
        subjectGrades: [],
        overallPercentage: 0,
        overallGradeLetter: "N/A",
      };
    }

    const examGrades = studentData.performance[selectedExamType];
    const subjectGradesArray = Object.entries(examGrades).map(
      ([subject, gradeData]) => ({
        subject,
        ...gradeData,
      })
    );

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
      overallPercentage,
      overallGradeLetter: generateGradeLetter(overallPercentage),
    };
  }, [studentData, selectedExamType]);

  if (!studentData) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <DocumentChartBarIcon className="w-10 h-10 text-skhool-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">
          My Grades ({studentData.firstname} {studentData.lastname})
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
          value={selectedExamType}
          onChange={(e) => setSelectedExamType(e.target.value)}
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
        >
          {Object.keys(studentData.performance).map((exam) => (
            <option key={exam} value={exam}>
              {exam}
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
                      {grade.percentage.toFixed(2)}%
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          grade.gradeLetter === "A+" ||
                          grade.gradeLetter === "A"
                            ? "bg-green-100 text-green-800"
                            : grade.gradeLetter === "B+" ||
                              grade.gradeLetter === "B"
                            ? "bg-blue-100 text-blue-800"
                            : grade.gradeLetter === "C+" ||
                              grade.gradeLetter === "C"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {grade.gradeLetter}
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
