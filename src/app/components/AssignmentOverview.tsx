// components/teacher/AssignmentsOverview.tsx
import { MoreHorizontal, Pencil } from 'lucide-react';
import React from 'react';

const assignments = [
  { name: 'Chapter 5 Problems', class: 'Mathematics', due: '25 July 2022', submitted: 28, total: 32 },
  { name: 'Lab Report: Optics', class: 'Physics', due: '28 July 2022', submitted: 15, total: 28 },
  { name: 'Quadratic Equations Worksheet', class: 'Algebra II', due: '02 Aug 2022', submitted: 0, total: 25 },
];

const SubmissionProgress = ({ submitted, total }: { submitted: number; total: number }) => {
  const percentage = total > 0 ? (submitted / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="text-xs font-semibold text-gray-600">{submitted}/{total}</span>
    </div>
  );
};

export const AssignmentsOverview = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-bold text-gray-800 text-lg mb-4">Assignments Overview</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="py-2 pr-4">Assignment</th>
              <th className="py-2 px-4">Class</th>
              <th className="py-2 px-4">Due Date</th>
              <th className="py-2 px-4 w-1/4">Submissions</th>
              <th className="py-2 pl-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((item, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="py-3 pr-4 font-semibold text-gray-800">{item.name}</td>
                <td className="py-3 px-4 text-gray-600">{item.class}</td>
                <td className="py-3 px-4 text-gray-600">{item.due}</td>
                <td className="py-3 px-4">
                  <SubmissionProgress submitted={item.submitted} total={item.total} />
                </td>
                <td className="py-3 pl-4 text-gray-500">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <MoreHorizontal size={18} />
                    <Pencil size={16} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};