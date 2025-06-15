// app/student/dashboard/page.tsx
"use client";

import React from 'react';
import { AcademicCapIcon, BookOpenIcon, CalendarDaysIcon, ChartBarIcon, MegaphoneIcon } from '../constants';
import DashboardCard from '../components/DashboardCard'; 

// Mock data for student dashboard
const mockStudentSummary = {
  upcomingAssignments: [
    { id: 'assign1', title: 'Maths Chapter 3 Exercises', dueDate: '3 days', course: 'Mathematics' },
    { id: 'assign2', title: 'Science Project Proposal', dueDate: '1 week', course: 'Science' },
  ],
  recentGrades: [
    { id: 'grade1', course: 'English', exam: 'Mid-Term 1', grade: 'A', score: '85/100' },
    { id: 'grade2', course: 'History', exam: 'Class Test 2', grade: 'B+', score: '78/100' },
  ],
  attendancePercentage: 92,
  unreadAnnouncements: 3,
  studentName: "Demo Student",
  studentClass: "7th",
  studentSection: "B",
  avatarUrl: 'https://picsum.photos/seed/demostudent/100/100'
};

const StudentDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <img 
            src={mockStudentSummary.avatarUrl} 
            alt="Student Avatar" 
            className="w-24 h-24 rounded-full object-cover mb-4 sm:mb-0 sm:mr-6 shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {mockStudentSummary.studentName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here&apos;s a quick overview of your academic activities.
            </p>
            <p className="mt-1 text-sm text-skhool-blue-600 font-medium">
              Class: {mockStudentSummary.studentClass} - {mockStudentSummary.studentSection}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Attendance Summary */}
        <DashboardCard title="My Attendance" icon={<CalendarDaysIcon className="w-7 h-7 text-green-500" />}>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">{mockStudentSummary.attendancePercentage}%</p>
            <p className="text-sm text-gray-500">Overall Attendance</p>
            <button 
              onClick={() => window.location.href='/student/attendance'} 
              className="mt-3 text-sm text-skhool-blue-600 hover:underline"
            >
              View Details
            </button>
          </div>
        </DashboardCard>

        {/* Recent Grades */}
        <DashboardCard title="Recent Grades" icon={<ChartBarIcon className="w-7 h-7 text-indigo-500" />}>
          {mockStudentSummary.recentGrades.length > 0 ? (
            <ul className="space-y-2">
              {mockStudentSummary.recentGrades.map(grade => (
                <li key={grade.id} className="text-sm p-2 bg-indigo-50 rounded-md">
                  <span className="font-semibold text-indigo-700">{grade.course}</span> ({grade.exam}): <span className="font-bold">{grade.grade}</span> ({grade.score})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent grades to display.</p>
          )}
           <button 
              onClick={() => window.location.href='/student/grades'} 
              className="mt-3 text-sm text-skhool-blue-600 hover:underline"
            >
              View All Grades
            </button>
        </DashboardCard>

        {/* Upcoming Assignments */}
        <DashboardCard title="Upcoming Assignments" icon={<AcademicCapIcon className="w-7 h-7 text-red-500" />}>
          {mockStudentSummary.upcomingAssignments.length > 0 ? (
            <ul className="space-y-2">
              {mockStudentSummary.upcomingAssignments.map(assign => (
                <li key={assign.id} className="text-sm p-2 bg-red-50 rounded-md">
                  <span className="font-semibold text-red-700">{assign.title}</span> ({assign.course})
                  <p className="text-xs text-red-600">Due in: {assign.dueDate}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No upcoming assignments.</p>
          )}
           <button 
              onClick={() => alert("Navigate to Assignments page (placeholder)")} 
              className="mt-3 text-sm text-skhool-blue-600 hover:underline"
            >
              View All Assignments
            </button>
        </DashboardCard>
        
        {/* Quick link to Learning Resources */}
         <DashboardCard title="Learning Resources" icon={<BookOpenIcon className="w-7 h-7 text-teal-500" />}>
            <p className="text-sm text-gray-600 mb-3">Explore study materials, videos, and notes uploaded by your teachers.</p>
            <button 
              onClick={() => window.location.href='/student/resources'} 
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out"
            >
              Go to Resources
            </button>
        </DashboardCard>

        {/* School Announcements Teaser */}
        <DashboardCard title="Announcements" icon={<MegaphoneIcon className="w-7 h-7 text-skhool-orange-500" />}>
          <p className="text-sm text-gray-600">
            You have <span className="font-bold text-skhool-orange-600">{mockStudentSummary.unreadAnnouncements} unread announcements</span>. Stay updated with the latest school news.
          </p>
          <button 
            onClick={() => alert("Navigate to Announcements page (placeholder)")} 
            className="mt-3 text-sm text-skhool-blue-600 hover:underline"
          >
            View Announcements
          </button>
        </DashboardCard>
      </div>
    </div>
  );
};

export default StudentDashboardPage;