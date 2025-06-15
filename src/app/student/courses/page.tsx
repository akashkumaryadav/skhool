// app/student/courses/page.tsx
"use client";

import React from 'react';
import { StudentCourse } from '../../types/types';
import { AcademicCapIcon, BookOpenIcon, UsersIcon } from '../../constants';
import DashboardCard from '../../components/DashboardCard';

// Mock data for student courses
const mockStudentCourses: StudentCourse[] = [
  { 
    id: 'course1', 
    subjectName: 'Mathematics - Class 7B', 
    teacherName: 'Mrs. S. Gupta', 
    syllabusOverview: 'Algebra, Geometry, Data Handling. Full syllabus available on the portal.',
    nextClassTopic: 'Introduction to Polynomials',
    recentActivity: 'New worksheet on Linear Equations posted.',
    thumbnailUrl: 'https://picsum.photos/seed/maths7b/400/200'
  },
  { 
    id: 'course2', 
    subjectName: 'Science - Class 7B', 
    teacherName: 'Mr. A. Verma',
    syllabusOverview: 'Physics, Chemistry, Biology topics. Lab sessions every Friday.',
    nextClassTopic: 'Photosynthesis Deep Dive',
    recentActivity: 'Mid-term grades updated.',
    thumbnailUrl: 'https://picsum.photos/seed/science7b/400/200'
  },
  { 
    id: 'course3', 
    subjectName: 'English Literature - Class 7B', 
    teacherName: 'Ms. P. Jones',
    syllabusOverview: 'Shakespeare, Modern Poetry, Creative Writing.',
    nextClassTopic: 'Analyzing "The Road Not Taken"',
    recentActivity: 'Reading list for next month shared.',
    thumbnailUrl: 'https://picsum.photos/seed/english7b/400/200'
  },
  { 
    id: 'course4', 
    subjectName: 'Social Studies - Class 7B', 
    teacherName: 'Mr. R. Khan',
    syllabusOverview: 'Indian History, Civics, Geography.',
    nextClassTopic: 'The Mughal Empire',
    recentActivity: 'Map work assignment due next week.',
    thumbnailUrl: 'https://picsum.photos/seed/social7b/400/200'
  },
];

const StudentCoursesPage: React.FC = () => {
  // In a real app, filter courses based on the logged-in student's enrollment
  // Since auth is removed, we show all mock courses.
  const enrolledCourses = mockStudentCourses; 

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <AcademicCapIcon className="w-10 h-10 text-skhool-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
      </div>
      
      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(course => (
            <DashboardCard 
              key={course.id} 
              title={course.subjectName} 
              icon={<BookOpenIcon className="w-6 h-6 text-skhool-blue-500" />}
              className="hover:shadow-xl transition-shadow duration-300"
            >
              {course.thumbnailUrl && (
                <img 
                  src={course.thumbnailUrl} 
                  alt={`${course.subjectName} thumbnail`} 
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <strong className="font-medium text-gray-800">Teacher:</strong> {course.teacherName}
                </p>
                {course.syllabusOverview && (
                  <p className="text-gray-600">
                    <strong className="font-medium text-gray-800">Overview:</strong> {course.syllabusOverview.substring(0,100)}{course.syllabusOverview.length > 100 ? '...' : ''}
                  </p>
                )}
                {course.nextClassTopic && (
                  <p className="p-2 bg-indigo-50 text-indigo-700 rounded-md">
                    <strong className="font-medium">Next Topic:</strong> {course.nextClassTopic}
                  </p>
                )}
                {course.recentActivity && (
                  <p className="p-2 bg-green-50 text-green-700 rounded-md">
                    <strong className="font-medium">Recent Activity:</strong> {course.recentActivity}
                  </p>
                )}
                 <button 
                    onClick={() => alert(`Viewing details for ${course.subjectName}`)} 
                    className="mt-3 w-full text-sm text-white bg-skhool-blue-600 hover:bg-skhool-blue-700 py-2 rounded-md font-semibold transition-colors"
                  >
                    View Course Details
                  </button>
              </div>
            </DashboardCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white shadow rounded-lg">
          <UsersIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Found</h3>
          <p className="text-gray-500">You are not currently enrolled in any courses, or they haven&apos;t been assigned yet.</p>
        </div>
      )}
    </div>
  );
};

export default StudentCoursesPage;