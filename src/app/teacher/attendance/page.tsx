// app/attendance/page.tsx
"use client";

import {
  CheckCircleIcon,
  UserCircleIcon,
  UsersIcon,
} from "@/app/components/icons"; // Adjusted path
import {
  AttendanceStatus,
  Student,
  StudentForAttendance,
} from "@/app/types/types"; // Adjusted path
import React, { useEffect, useMemo, useState } from "react";
import { animated, useTransition } from "react-spring"; // Standard import

// Mock Data
const mockStudentsData: Student[] = [
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

const classes = ["6th", "7th", "8th"];
const sections = ["A", "B", "C"];

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AttendancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    getTodayDateString()
  );
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]);
  const [selectedSection, setSelectedSection] = useState<string>(sections[0]);
  const [studentsForAttendance, setStudentsForAttendance] = useState<
    StudentForAttendance[]
  >([]);
  const [isLoading, setIsLoading] = useState(false); // For simulating data fetch

  // Simulate fetching students based on filters
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = mockStudentsData
        .filter(
          (s) => s.class === selectedClass && s.section === selectedSection
        )
        .map((student) => ({
          ...student,
          attendanceStatus: AttendanceStatus.NOT_MARKED, // Default status
          key: student.id, // Unique key for react-spring
        }));
      setStudentsForAttendance(filtered);
      setIsLoading(false);
    }, 500);
  }, [selectedDate, selectedClass, selectedSection]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentsForAttendance((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? { ...student, attendanceStatus: status }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setStudentsForAttendance((prevStudents) =>
      prevStudents.map((student) => ({
        ...student,
        attendanceStatus: AttendanceStatus.PRESENT,
      }))
    );
  };

  const saveAttendance = () => {
    // In a real app, this would send data to the backend
    console.log("Saving attendance:", {
      date: selectedDate,
      class: selectedClass,
      section: selectedSection,
      attendance: studentsForAttendance.map((s) => ({
        studentId: s.id,
        status: s.attendanceStatus,
      })),
    });
    alert("Attendance saved! (Check console for data)");
  };

  const transitions = useTransition(studentsForAttendance, {
    key: (item: StudentForAttendance) => item.key,
    from: { opacity: 0, transform: "translateY(20px) scale(0.95)" },
    enter: { opacity: 1, transform: "translateY(0px) scale(1)" },
    leave: {
      opacity: 0,
      transform: "translateY(-20px) scale(0.95)",
      position: "absolute",
      width: "100%",
    },
    trail: 50, // Stagger animation
    config: { tension: 220, friction: 20 },
  });

  const attendanceCounts = useMemo(() => {
    return studentsForAttendance.reduce(
      (acc, student) => {
        if (student.attendanceStatus === AttendanceStatus.PRESENT)
          acc.present++;
        else if (student.attendanceStatus === AttendanceStatus.ABSENT)
          acc.absent++;
        else if (student.attendanceStatus === AttendanceStatus.LATE) acc.late++;
        else acc.notMarked++;
        return acc;
      },
      { present: 0, absent: 0, late: 0, notMarked: 0 }
    );
  }, [studentsForAttendance]);

  const renderStudentRow = (student: StudentForAttendance) => (
    <div className="grid grid-cols-12 gap-2 items-center py-3 px-2 border-b border-gray-200">
      <div className="col-span-12 sm:col-span-4 flex items-center">
        {student.avatarUrl ? (
          <img
            src={student.avatarUrl}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
        ) : (
          <UserCircleIcon className="w-10 h-10 text-gray-400 mr-3" />
        )}
        <div>
          <p className="text-sm font-medium text-gray-800">
            {student.firstName} {student.lastName}
          </p>
          <p className="text-xs text-gray-500">Roll No: {student.rollNumber}</p>
        </div>
      </div>
      <div className="col-span-12 sm:col-span-8 flex flex-wrap gap-2 justify-start sm:justify-end mt-2 sm:mt-0">
        {[
          AttendanceStatus.PRESENT,
          AttendanceStatus.ABSENT,
          AttendanceStatus.LATE,
          AttendanceStatus.NOT_MARKED,
        ].map((statusOption) => (
          <button
            key={statusOption}
            onClick={() => handleStatusChange(student.id, statusOption)}
            title={`Mark as ${statusOption}`}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all duration-150 ease-in-out border
              ${
                student.attendanceStatus === statusOption
                  ? statusOption === AttendanceStatus.PRESENT
                    ? "bg-green-500 text-white border-green-500 shadow-md"
                    : statusOption === AttendanceStatus.ABSENT
                    ? "bg-red-500 text-white border-red-500 shadow-md"
                    : statusOption === AttendanceStatus.LATE
                    ? "bg-yellow-500 text-white border-yellow-500 shadow-md"
                    : "bg-gray-500 text-white border-gray-500 shadow-md" // NOT_MARKED
                  : statusOption === AttendanceStatus.PRESENT
                  ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                  : statusOption === AttendanceStatus.ABSENT
                  ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                  : statusOption === AttendanceStatus.LATE
                  ? "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200" // NOT_MARKED
              }`}
          >
            {statusOption.charAt(0).toUpperCase() +
              statusOption.slice(1).toLowerCase().replace("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Attendance Management
      </h1>

      {/* Filters */}
      <div className="p-4 bg-white shadow rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label
              htmlFor="attendance-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Date
            </label>
            <input
              type="date"
              id="attendance-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="attendance-class"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Class
            </label>
            <select
              id="attendance-class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            >
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="attendance-section"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Section
            </label>
            <select
              id="attendance-section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            >
              {sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary and Actions */}
      <div className="p-4 bg-white shadow rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex gap-x-4 gap-y-2 flex-wrap text-sm">
            <span className="font-semibold">Summary:</span>
            <span className="text-green-600">
              Present: {attendanceCounts.present}
            </span>
            <span className="text-red-500">
              Absent: {attendanceCounts.absent}
            </span>
            <span className="text-yellow-500">
              Late: {attendanceCounts.late}
            </span>
            <span className="text-gray-500">
              Not Marked: {attendanceCounts.notMarked}
            </span>
            <span className="text-gray-700">
              Total: {studentsForAttendance.length}
            </span>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={markAllPresent}
              disabled={isLoading || studentsForAttendance.length === 0}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-50"
            >
              <UsersIcon className="w-5 h-5 mr-2" />
              Mark All Present
            </button>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">
            Students for {selectedClass} - {selectedSection} on {selectedDate}
          </h3>
        </div>
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">
            Loading students...
          </div>
        ) : studentsForAttendance.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No students found for this class/section.
          </div>
        ) : (
          <div className="relative">
            {transitions((style, item) => (
              <animated.div style={style}>
                {renderStudentRow(item)}
              </animated.div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      {studentsForAttendance.length > 0 && !isLoading && (
        <div className="flex justify-end mt-6">
          <button
            onClick={saveAttendance}
            className="flex items-center bg-skhool-blue-600 hover:bg-skhool-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 focus:ring-opacity-75 transform hover:scale-105"
          >
            <CheckCircleIcon className="w-6 h-6 mr-2" />
            Save Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
