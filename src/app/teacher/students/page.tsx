// app/students/page.tsx
"use client";

import React, { useState } from 'react';
import { Student } from '@/app/types/types'; // Adjusted path
import { MagnifyingGlassIcon, PlusCircleIcon, ArrowDownTrayIcon, PencilIcon, EyeIcon } from '@/app/components/icons'; // Adjusted path

const mockStudents: Student[] = [
  {
    id: 's1',
    studentIdNo: 'SKL001',
    firstName: 'Aarav',
    lastName: 'Sharma',
    class: '6th',
    section: 'A',
    rollNumber: 1,
    gender: 'Male',
    dateOfBirth: '2012-05-15',
    parentName: 'Mr. Rajesh Sharma',
    parentContact: '9876543210',
    avatarUrl: 'https://picsum.photos/seed/aarav/40/40',
    attendancePercentage: 95,
    overallGrade: 'A+'
  },
  {
    id: 's2',
    studentIdNo: 'SKL002',
    firstName: 'Priya',
    lastName: 'Singh',
    class: '7th',
    section: 'B',
    rollNumber: 5,
    gender: 'Female',
    dateOfBirth: '2011-03-20',
    parentName: 'Mrs. Anita Singh',
    parentContact: 'anita.singh@example.com',
    avatarUrl: 'https://picsum.photos/seed/priya/40/40',
    attendancePercentage: 92,
    overallGrade: 'A'
  },
  {
    id: 's3',
    studentIdNo: 'SKL003',
    firstName: 'Rohan',
    lastName: 'Verma',
    class: '6th',
    section: 'A',
    rollNumber: 2,
    gender: 'Male',
    dateOfBirth: '2012-08-10',
    parentName: 'Mr. Suresh Verma',
    parentContact: '9988776655',
    avatarUrl: 'https://picsum.photos/seed/rohan/40/40',
    attendancePercentage: 88,
    overallGrade: 'B+'
  },
  {
    id: 's4',
    studentIdNo: 'SKL004',
    firstName: 'Sneha',
    lastName: 'Patel',
    class: '8th',
    section: 'C',
    rollNumber: 12,
    gender: 'Female',
    dateOfBirth: '2010-11-25',
    parentName: 'Mr. Dinesh Patel',
    parentContact: 'dinesh.patel@example.com',
    avatarUrl: 'https://picsum.photos/seed/sneha/40/40',
    attendancePercentage: 98,
    overallGrade: 'A+'
  },
   {
    id: 's5',
    studentIdNo: 'SKL005',
    firstName: 'Vikram',
    lastName: 'Kumar',
    class: '7th',
    section: 'B',
    rollNumber: 8,
    gender: 'Male',
    dateOfBirth: '2011-01-30',
    parentName: 'Mrs. Sunita Kumar',
    parentContact: '9123456789',
    avatarUrl: 'https://picsum.photos/seed/vikram/40/40',
    attendancePercentage: 90,
    overallGrade: 'A'
  },
];


const StudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const filteredStudents = mockStudents.filter(student => {
    const nameMatch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const classMatch = selectedClass ? student.class === selectedClass : true;
    const sectionMatch = selectedSection ? student.section === selectedSection : true;
    return nameMatch && classMatch && sectionMatch;
  });

  const uniqueClasses = Array.from(new Set(mockStudents.map(s => s.class))).sort();
  const uniqueSections = Array.from(new Set(mockStudents.map(s => s.section))).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Students Management</h1>
        <div className="flex gap-2">
           <button 
            onClick={() => alert('Add New Student Clicked!')} // Placeholder
            className="flex items-center bg-skhool-blue-600 hover:bg-skhool-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 focus:ring-opacity-75"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add Student
          </button>
          <button 
            onClick={() => alert('Export Data Clicked!')} // Placeholder
            className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="p-4 bg-white shadow rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="relative">
            <label htmlFor="search-student" className="block text-sm font-medium text-gray-700 mb-1">Search Student</label>
            <div className="absolute inset-y-0 left-0 pl-3 pt-5 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search-student"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="filter-class" className="block text-sm font-medium text-gray-700 mb-1">Filter by Class</label>
            <select
              id="filter-class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filter-section" className="block text-sm font-medium text-gray-700 mb-1">Filter by Section</label>
            <select
              id="filter-section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            >
              <option value="">All Sections</option>
              {uniqueSections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No.</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Contact</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={student.avatarUrl || `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=random`} alt={`${student.firstName} ${student.lastName}`} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                        <div className="text-sm text-gray-500">{student.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.studentIdNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class} - {student.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{student.parentName}</div>
                    <div>{student.parentContact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => alert(`View ${student.firstName}`)} className="text-skhool-blue-600 hover:text-skhool-blue-800 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 rounded" title="View Details">
                      <EyeIcon className="w-5 h-5"/>
                    </button>
                    <button onClick={() => alert(`Edit ${student.firstName}`)} className="text-skhool-orange-500 hover:text-skhool-orange-700 focus:outline-none focus:ring-2 focus:ring-skhool-orange-500 rounded" title="Edit Student">
                      <PencilIcon className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No students found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filteredStudents.length > 0 && (
         <p className="text-sm text-gray-500 text-center">Showing {filteredStudents.length} of {mockStudents.length} students.</p>
      )}
    </div>
  );
};

export default StudentsPage;
