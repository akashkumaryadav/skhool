// app/grades/page.tsx
"use client";

import {
  ArrowDownTrayIcon,
  ChartBarIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusCircleIcon,
} from "@/app/components/icons";
import {
  Student,
  StudentComprehensiveGrades,
  StudentPerformanceSummary,
  SubjectGrade,
} from "@/app/types/types";
import Image from "next/image";
import React, { useMemo, useState } from "react";

// Mock Data
const mockStudentsBase: Student[] = [
  // Class 6A
  {
    id: "s1",
    studentIdNo: "SKL001",
    firstName: "Aarav",
    lastName: "Sharma",
    class: "6th",
    section: "A",
    rollNumber: 1,
    gender: "Male",
    dateOfBirth: "2012-05-15",
    parentName: "Mr. Rajesh Sharma",
    parentContact: "9876543210",
    avatarUrl: "https://picsum.photos/seed/aarav/40/40",
  },
  {
    id: "s3",
    studentIdNo: "SKL003",
    firstName: "Rohan",
    lastName: "Verma",
    class: "6th",
    section: "A",
    rollNumber: 2,
    gender: "Male",
    dateOfBirth: "2012-08-10",
    parentName: "Mr. Suresh Verma",
    parentContact: "9988776655",
    avatarUrl: "https://picsum.photos/seed/rohan/40/40",
  },
  {
    id: "s6",
    studentIdNo: "SKL006",
    firstName: "Ishaan",
    lastName: "Mehta",
    class: "6th",
    section: "A",
    rollNumber: 3,
    gender: "Male",
    dateOfBirth: "2012-02-12",
    parentName: "Mr. Alok Mehta",
    parentContact: "9876500000",
    avatarUrl: "https://picsum.photos/seed/ishaan/40/40",
  },
  {
    id: "s7",
    studentIdNo: "SKL007",
    firstName: "Myra",
    lastName: "Joshi",
    class: "6th",
    section: "A",
    rollNumber: 4,
    gender: "Female",
    dateOfBirth: "2012-09-30",
    parentName: "Mrs. Kavita Joshi",
    parentContact: "k.joshi@example.com",
    avatarUrl: "https://picsum.photos/seed/myra/40/40",
  },
  // Class 7B
  {
    id: "s2",
    studentIdNo: "SKL002",
    firstName: "Priya",
    lastName: "Singh",
    class: "7th",
    section: "B",
    rollNumber: 5,
    gender: "Female",
    dateOfBirth: "2011-03-20",
    parentName: "Mrs. Anita Singh",
    parentContact: "anita.singh@example.com",
    avatarUrl: "https://picsum.photos/seed/priya/40/40",
  },
  {
    id: "s5",
    studentIdNo: "SKL005",
    firstName: "Vikram",
    lastName: "Kumar",
    class: "7th",
    section: "B",
    rollNumber: 8,
    gender: "Male",
    dateOfBirth: "2011-01-30",
    parentName: "Mrs. Sunita Kumar",
    parentContact: "9123456789",
    avatarUrl: "https://picsum.photos/seed/vikram/40/40",
  },
  {
    id: "s8",
    studentIdNo: "SKL008",
    firstName: "Aditi",
    lastName: "Rao",
    class: "7th",
    section: "B",
    rollNumber: 6,
    gender: "Female",
    dateOfBirth: "2011-07-14",
    parentName: "Mr. Mohan Rao",
    parentContact: "9112233445",
    avatarUrl: "https://picsum.photos/seed/aditi/40/40",
  },
  // Class 8C
  {
    id: "s4",
    studentIdNo: "SKL004",
    firstName: "Sneha",
    lastName: "Patel",
    class: "8th",
    section: "C",
    rollNumber: 12,
    gender: "Female",
    dateOfBirth: "2010-11-25",
    parentName: "Mr. Dinesh Patel",
    parentContact: "dinesh.patel@example.com",
    avatarUrl: "https://picsum.photos/seed/sneha/40/40",
  },
  {
    id: "s9",
    studentIdNo: "SKL009",
    firstName: "Arjun",
    lastName: "Reddy",
    class: "8th",
    section: "C",
    rollNumber: 10,
    gender: "Male",
    dateOfBirth: "2010-04-05",
    parentName: "Mr. Krishna Reddy",
    parentContact: "9000011111",
    avatarUrl: "https://picsum.photos/seed/arjun/40/40",
  },
];

const MOCK_SUBJECTS = ["Maths", "Science", "English", "History", "Hindi"];
const MOCK_EXAM_TYPES = ["Mid-Term 1", "Mid-Term 2", "Final Exam"];
const MOCK_TOTAL_MARKS = 100;

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

const mockStudentComprehensiveGrades: StudentComprehensiveGrades[] =
  mockStudentsBase.map((student) => {
    const performance: StudentComprehensiveGrades["performance"] = {};
    MOCK_EXAM_TYPES.forEach((examType) => {
      performance[examType] = {};
      MOCK_SUBJECTS.forEach((subject) => {
        const marksObtained =
          Math.floor(Math.random() * (MOCK_TOTAL_MARKS - 40 + 1)) + 40; // Marks between 40 and 100
        const percentage = parseFloat(
          ((marksObtained / MOCK_TOTAL_MARKS) * 100).toFixed(2)
        );
        performance[examType][subject] = {
          marksObtained,
          totalMarks: MOCK_TOTAL_MARKS,
          percentage,
          gradeLetter: generateGradeLetter(percentage),
        };
      });
    });
    return { ...student, performance };
  });

const uniqueClasses = Array.from(
  new Set(mockStudentsBase.map((s) => s.class))
).sort();
const uniqueSections = Array.from(
  new Set(mockStudentsBase.map((s) => s.section))
).sort();
const tableSubjects = ["Maths", "Science", "English"]; // Subjects to display in table columns

const GradesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>(
    uniqueClasses[0] || ""
  );
  const [selectedSection, setSelectedSection] = useState<string>(
    uniqueSections[0] || ""
  );
  const [selectedExamType, setSelectedExamType] = useState<string>(
    MOCK_EXAM_TYPES[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  const studentPerformanceData = useMemo(() => {
    setIsLoading(true); // Simulate loading start
    const processedData: StudentPerformanceSummary[] =
      mockStudentComprehensiveGrades
        .filter(
          (student) =>
            (!selectedClass || student.class === selectedClass) &&
            (!selectedSection || student.section === selectedSection) &&
            `${student.firstName} ${student.lastName}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
        .map((student) => {
          const examGrades = student.performance[selectedExamType] || {};

          let totalMarksObtainedForExam = 0;
          let totalMaxMarksForExam = 0;

          Object.values(examGrades).forEach((grade: SubjectGrade) => {
            totalMarksObtainedForExam += grade.marksObtained;
            totalMaxMarksForExam += grade.totalMarks;
          });

          const overallExamPercentage =
            totalMaxMarksForExam > 0
              ? parseFloat(
                  (
                    (totalMarksObtainedForExam / totalMaxMarksForExam) *
                    100
                  ).toFixed(2)
                )
              : 0;

          return {
            ...student,
            key: `${student.id}-${selectedExamType}`,
            examGrades,
            overallExamPercentage,
            overallExamGradeLetter: generateGradeLetter(overallExamPercentage),
          };
        });

    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 300);
    return processedData;
  }, [selectedClass, selectedSection, selectedExamType, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Student Grades & Performance
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => alert("Add New Grades Clicked!")}
            className="flex items-center bg-skhool-blue-600 hover:bg-skhool-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 focus:ring-opacity-75"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add New Grades
          </button>
          <button
            onClick={() => alert("Export Performance Report Clicked!")}
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
            <div className="absolute inset-y-0 left-0 pl-3 pt-5 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search-student-grade"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="filter-grade-class"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Class
            </label>
            <select
              id="filter-grade-class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="filter-grade-section"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Section
            </label>
            <select
              id="filter-grade-section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            >
              <option value="">All Sections</option>
              {uniqueSections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="filter-exam-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Exam Type
            </label>
            <select
              id="filter-exam-type"
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            >
              {MOCK_EXAM_TYPES.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Student
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Class
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Overall (%)
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Overall Grade
              </th>
              {tableSubjects.map((subject) => (
                <th
                  key={subject}
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  {subject}
                </th>
              ))}
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6 + tableSubjects.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <ChartBarIcon className="w-8 h-8 mx-auto text-gray-400 animate-pulse" />
                  Loading performance data...
                </td>
              </tr>
            ) : studentPerformanceData.length > 0 ? (
              studentPerformanceData.map((studentPerf) => (
                <tr
                  key={studentPerf.key}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            studentPerf.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${studentPerf.firstName}+${studentPerf.lastName}&background=random`
                          }
                          alt={`${studentPerf.firstName} ${studentPerf.lastName}`}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {studentPerf.firstName} {studentPerf.lastName}
                        </div>
                        <div className="text-sm text-gray-500 md:hidden">
                          {studentPerf.class}-{studentPerf.section}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {studentPerf.studentIdNo}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {studentPerf.class} - {studentPerf.section}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                    {studentPerf.overallExamPercentage.toFixed(2)}%
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        studentPerf.overallExamGradeLetter === "A+" ||
                        studentPerf.overallExamGradeLetter === "A"
                          ? "bg-green-100 text-green-800"
                          : studentPerf.overallExamGradeLetter === "B+" ||
                            studentPerf.overallExamGradeLetter === "B"
                          ? "bg-blue-100 text-blue-800"
                          : studentPerf.overallExamGradeLetter === "C+" ||
                            studentPerf.overallExamGradeLetter === "C"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {studentPerf.overallExamGradeLetter}
                    </span>
                  </td>
                  {tableSubjects.map((subject) => {
                    const grade = studentPerf.examGrades[subject];
                    return (
                      <td
                        key={subject}
                        className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell"
                      >
                        {grade
                          ? `${grade.marksObtained}/${grade.totalMarks}`
                          : "N/A"}
                      </td>
                    );
                  })}
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() =>
                        alert(`View report for ${studentPerf.firstName}`)
                      }
                      className="text-skhool-blue-600 hover:text-skhool-blue-800 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 rounded"
                      title="View Full Report"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        alert(`Edit grades for ${studentPerf.firstName}`)
                      }
                      className="text-skhool-orange-500 hover:text-skhool-orange-700 focus:outline-none focus:ring-2 focus:ring-skhool-orange-500 rounded"
                      title="Edit Grades"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6 + tableSubjects.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No student performance data found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {studentPerformanceData.length > 0 && !isLoading && (
        <p className="text-sm text-gray-500 text-center">
          Showing {studentPerformanceData.length} students for{" "}
          {selectedExamType}.
        </p>
      )}
    </div>
  );
};

export default GradesPage;
