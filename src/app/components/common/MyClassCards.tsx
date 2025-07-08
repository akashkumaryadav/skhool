// components/teacher/MyClasses.tsx
import React from 'react';

const classes = [
  { subject: 'Mathematics', grade: '10th Grade', students: 32, color: 'border-blue-500' },
  { subject: 'Physics', grade: '10th Grade', students: 28, color: 'border-purple-500' },
  { subject: 'Algebra II', grade: '11th Grade', students: 25, color: 'border-teal-500' },
];

export const MyClasses = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-bold text-gray-800 text-lg mb-4">My Classes</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classes.map((cls, index) => (
          <div key={index} className={`p-4 rounded-lg border-l-4 ${cls.color} bg-gray-50`}>
            <p className="font-bold text-gray-800">{cls.subject}</p>
            <p className="text-sm text-gray-600">{cls.grade}</p>
            <p className="text-sm text-gray-500 mt-2">{cls.students} Students</p>
          </div>
        ))}
      </div>
    </div>
  );
};