
import React from 'react';

const AttendanceOverview: React.FC = () => {
  const attendanceData = {
    totalStudents: 120,
    present: 115,
    absent: 5,
    late: 2,
  };
  const presentPercentage = ((attendanceData.present / attendanceData.totalStudents) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-green-600">{presentPercentage}%</p>
          <p className="text-xs text-gray-500">Present Today</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-500">{attendanceData.absent}</p>
          <p className="text-xs text-gray-500">Absent</p>
        </div>
        <div className="sm:col-span-1 col-span-2 sm:mt-0 mt-2">
           <p className="text-2xl font-bold text-yellow-500">{attendanceData.late}</p>
          <p className="text-xs text-gray-500">Late</p>
        </div>
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="w-full bg-skhool-blue-600 hover:bg-skhool-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 focus:ring-opacity-75"
        >
          View Detailed Attendance
        </button>
      </div>
       <p className="text-xs text-gray-400 text-center mt-2">Last updated: Just now</p>
    </div>
  );
};

export default AttendanceOverview;
    