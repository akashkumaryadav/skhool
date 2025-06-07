"use client"
import React from 'react';

interface TableProps {
  columns: { header: string; accessor: string }[];
  data: any[];
}

// const Table: React.FC<TableProps> = ({ columns, data }) => {
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             {columns.map((column) => (
//               <th key={column.accessor} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {column.header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {data.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {columns.map((column) => (
//                 <td key={column.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {row[column.accessor]}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;

import Link from 'next/link';
import BarChart from '@/app/components/charts/BarChart';
import LineChart from '@/app/components/charts/LineChart';
import Table from '@/app/components/Table'; // Import the Table component
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/app/lib/api/api';

export default function TeacherDashboard() { // Renamed function to match file name convention
  const { data: userData, isLoading, isError } = useQuery({ queryKey: ['userData'], queryFn: fetchUser });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

      {/* Quick Access Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/teacher/attendance/mark">
          <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold mb-2">Mark Attendance</h2>
            <p className="text-gray-600">Quickly mark student attendance for your classes.</p>
          </div>
        </Link>

        <Link href="/teacher/reports/students">
          <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold mb-2">Student Reports</h2>
            <p className="text-gray-600">View and generate reports on student performance.</p>
          </div>
        </Link>

        <Link href="/teacher/schedule">
          <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold mb-2">Schedules</h2>
            <p className="text-gray-600">Access your class and meeting schedules.</p>
          </div>
        </Link>

        <Link href="/teacher/attendance/my">
          <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold mb-2">My Attendance</h2>
            <p className="text-gray-600">View your personal attendance records.</p>
          </div>
        </Link>

        <Link href="/teacher/calendar">
          <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold mb-2">Calendar</h2>
            <p className="text-gray-600">See important dates, events, and deadlines.</p>
          </div>
        </Link>
      </div>

      {/* Schedule Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Schedule</h2>
        {/* Dummy Timetable Data */}
        <Table
          columns={[
            { header: 'Time', accessor: 'time' },
            { header: 'Monday', accessor: 'monday' },
            { header: 'Tuesday', accessor: 'tuesday' },
            { header: 'Wednesday', accessor: 'wednesday' },
            { header: 'Thursday', accessor: 'thursday' },
            { header: 'Friday', accessor: 'friday' },
          ]}
          data={[
            { time: '8:00 - 9:00', monday: 'Math', tuesday: 'Science', wednesday: 'History', thursday: 'Math', friday: 'English' },
            { time: '9:00 - 10:00', monday: 'Science', tuesday: 'Math', wednesday: 'English', thursday: 'History', friday: 'Science' },
            { time: '10:00 - 11:00', monday: 'English', tuesday: 'History', wednesday: 'Math', thursday: 'Science', friday: 'Math' },
            { time: '11:00 - 12:00', monday: 'History', tuesday: 'English', wednesday: 'Science', thursday: 'English', friday: 'History' },
          ]}
        />
      </div>

      {/* User Data Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Information</h2>
        {isLoading && <p>Loading user data...</p>}
        {isError && <p>Error fetching user data.</p>}
        {userData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            {/* Add other user data fields as needed */}
          </div>
        )}
      </div>


      {/* Performance Metrics Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Example Bar Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Student Performance Overview</h3>
            <BarChart data={{ labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], datasets: [{ label: 'Average Score', data: [65, 59, 80, 81, 56], backgroundColor: 'rgba(75, 192, 192, 0.6)' }] }} />
          </div>

          {/* Example Line Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">My Teaching Performance Trend</h3>
            <LineChart data={{ labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], datasets: [{ label: 'Engagement Level', data: [50, 60, 75, 70], borderColor: '#3b82f6', fill: false }] }} />
          </div>
        </div>
        {/* Add more performance metrics or charts as needed */}
      </div>
    </div>
  );
}