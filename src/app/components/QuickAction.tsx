
import React from 'react';
import { CalendarDaysIcon, DocumentChartBarIcon, MegaphoneIcon, BookOpenIcon } from '@/app/components/icons'; 

const actions = [
  { name: 'Mark Attendance', icon: CalendarDaysIcon, color: 'skhool-blue' },
  { name: 'Add Grades', icon: DocumentChartBarIcon, color: 'skhool-orange' },
  { name: 'New Announcement', icon: MegaphoneIcon, color: 'red' },
  { name: 'Upload Resource', icon: BookOpenIcon, color: 'teal' },
];

const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      {actions.map((action) => (
        <button
          key={action.name}
          type="button"
          className={`flex flex-col items-center justify-center p-4 bg-${action.color}-500 hover:bg-${action.color}-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-${action.color}-500 focus:ring-opacity-75 h-32`}
        >
          <action.icon className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium text-center">{action.name}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
    