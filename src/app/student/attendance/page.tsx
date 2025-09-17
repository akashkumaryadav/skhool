// app/student/attendance/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { AttendanceStatus, Student } from "../../types/types"; // Adjust the import path as needed
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "../../constants";
import DashboardCard from "../../components/DashboardCard";
import { useQueryClient } from "@tanstack/react-query";

// Mock attendance data for a student (e.g., for 's1' - Aarav Sharma)
// This will be displayed for any user accessing this page since auth is removed.
// const mockStudentAttendanceRecord: {
//   date: string;
//   status: AttendanceStatus;
// }[] = [
//   { date: "2023-11-01", status: AttendanceStatus.PRESENT },
//   { date: "2023-11-02", status: AttendanceStatus.PRESENT },
//   { date: "2023-11-03", status: AttendanceStatus.ABSENT },
//   { date: "2023-11-04", status: AttendanceStatus.PRESENT },
//   { date: "2023-11-05", status: AttendanceStatus.LATE },
//   { date: "2023-11-06", status: AttendanceStatus.PRESENT },
//   { date: "2023-11-07", status: AttendanceStatus.PRESENT },
//   { date: "2023-11-08", status: AttendanceStatus.PRESENT },
//   { date: "2023-11-09", status: AttendanceStatus.PRESENT },
//   { date: "2023-11-10", status: AttendanceStatus.ABSENT },
//   { date: "2023-11-11", status: AttendanceStatus.PRESENT },
//   { date: "2023-11-12", status: AttendanceStatus.PRESENT },
//   { date: "2023-11-13", status: AttendanceStatus.PRESENT },
//   { date: "2023-11-14", status: AttendanceStatus.LATE },
//   { date: "2023-11-15", status: AttendanceStatus.PRESENT },
//   // Add more data for a month or so
//   { date: "2023-10-15", status: AttendanceStatus.PRESENT },
//   { date: "2023-10-16", status: AttendanceStatus.PRESENT },
//   { date: "2023-10-17", status: AttendanceStatus.PRESENT },
//   { date: "2023-10-18", status: AttendanceStatus.PRESENT },
//   { date: "2023-10-19", status: AttendanceStatus.ABSENT },
//   { date: "2023-10-20", status: AttendanceStatus.PRESENT },
// ];

const getStatusIconAndColor = (status: AttendanceStatus) => {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return {
        icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
        color: "text-green-700 bg-green-100",
        label: "Present",
      };
    case AttendanceStatus.ABSENT:
      return {
        icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
        color: "text-red-700 bg-red-100",
        label: "Absent",
      };
    case AttendanceStatus.LATE:
      return {
        icon: <ClockIcon className="w-5 h-5 text-yellow-500" />,
        color: "text-yellow-700 bg-yellow-100",
        label: "Late",
      };
    default: // NOT_MARKED or other
      return {
        icon: <CalendarDaysIcon className="w-5 h-5 text-gray-400" />,
        color: "text-gray-600 bg-gray-100",
        label: "Not Marked",
      };
  }
};

const StudentAttendancePage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-indexed
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<Student>(["currentUser"]);
  const { trend } = queryClient.getQueryData([
    "studentAttendance",
    currentUser?.id,
  ]);

  const displayedAttendance = useMemo(() => {
    return trend
      ?.filter((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getFullYear() === currentYear &&
          recordDate.getMonth() === currentMonth
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [currentMonth, currentYear]);

  const attendanceSummary = useMemo(() => {
    const totalDays = displayedAttendance.length;
    const presentDays = displayedAttendance.filter(
      (r) => r.status === AttendanceStatus.PRESENT
    ).length;
    const absentDays = displayedAttendance.filter(
      (r) => r.status === AttendanceStatus.ABSENT
    ).length;
    const lateDays = displayedAttendance.filter(
      (r) => r.status === AttendanceStatus.LATE
    ).length;
    const percentage =
      totalDays > 0
        ? (((presentDays + lateDays * 0.5) / totalDays) * 100).toFixed(1)
        : "0.0";
    return { totalDays, presentDays, absentDays, lateDays, percentage };
  }, [displayedAttendance]);

  const changeMonth = (offset: number) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const monthYearDisplay = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long", year: "numeric" }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <CalendarDaysIcon className="w-10 h-10 text-skhool-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>
      </div>

      <DashboardCard title={`Attendance Summary for: ${monthYearDisplay}`}>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            &lt; Prev Month
          </button>
          <h3 className="text-lg font-semibold text-skhool-blue-700">
            {monthYearDisplay}
          </h3>
          <button
            onClick={() => changeMonth(1)}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Next Month &gt;
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
          <div>
            <p className="text-2xl font-bold text-green-600">
              {attendanceSummary.presentDays}
            </p>
            <p className="text-xs text-gray-500">Present</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">
              {attendanceSummary.absentDays}
            </p>
            <p className="text-xs text-gray-500">Absent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-500">
              {attendanceSummary.lateDays}
            </p>
            <p className="text-xs text-gray-500">Late</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {attendanceSummary.percentage}%
            </p>
            <p className="text-xs text-gray-500">Attendance %</p>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Daily Record">
        {displayedAttendance.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {displayedAttendance.map((record) => {
              const { icon, color, label } = getStatusIconAndColor(
                record.status
              );
              return (
                <div
                  key={record.date}
                  className={`flex items-center justify-between p-3 rounded-lg border ${color
                    .split(" ")[1]
                    .replace("bg-", "border-")}`}
                >
                  <div className="flex items-center">
                    {icon}
                    <span className="ml-3 text-sm font-medium text-gray-800">
                      {new Date(record.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${color}`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-5">
            No attendance records found for {monthYearDisplay}.
          </p>
        )}
      </DashboardCard>
      <p className="text-xs text-center text-gray-500 mt-4">
        Please contact your class teacher for any discrepancies in your
        attendance record.
      </p>
    </div>
  );
};

export default StudentAttendancePage;
