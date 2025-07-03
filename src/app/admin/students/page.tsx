// app/admin/students/page.tsx
"use client";

import React, { useState } from 'react';
import { Student } from '../../types/types';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '../../constants';
import StudentFormModal from '../../components/StudentFormModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

const mockStudents: Partial<Student>[] = [
  { id: 's1', firstname: 'Aarav', lastname: 'Sharma', className: '6th', section: 'A', rollNo: 1, gender: 'Male', dateOfBirth: '2012-05-15', guardian: 'Mr. Rajesh Sharma', guardianContact: '9876543210', profilePic: 'https://picsum.photos/seed/aarav/40/40' },
  { id: 's2',  firstname: 'Priya', lastname: 'Singh', className: '7th', section: 'B', rollNo: 5, gender: 'Female', dateOfBirth: '2011-03-20', guardian: 'Mrs. Anita Singh', guardianContact: 'anita.singh@example.com', profilePic: 'https://picsum.photos/seed/priya/40/40' },
  { id: 's3',  firstname: 'Rohan', lastname: 'Verma', className: '6th', section: 'A', rollNo: 2, gender: 'Male', dateOfBirth: '2012-08-10', guardian: 'Mr. Suresh Verma', guardianContact: '9988776655', profilePic: 'https://picsum.photos/seed/rohan/40/40' },
  { id: 's4',  firstname: 'Sneha', lastname: 'Patel', className: '8th', section: 'C', rollNo: 12, gender: 'Female', dateOfBirth: '2010-11-25', guardian: 'Mr. Dinesh Patel', guardianContact: 'dinesh.patel@example.com', profilePic: 'https://picsum.photos/seed/sneha/40/40' },
  { id: 's5',  firstname: 'Vikram', lastname: 'Kumar', className: '7th', section: 'B', rollNo: 8, gender: 'Male', dateOfBirth: '2011-01-30', guardian: 'Mrs. Sunita Kumar', guardianContact: '9123456789', profilePic: 'https://picsum.photos/seed/vikram/40/40' },
];

const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Partial<Student>[]>(mockStudents);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Partial<Student> | null>(null);

  const handleOpenAddModal = () => {
    setSelectedStudent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (student: Partial<Student>) => {
    setSelectedStudent(student);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (student: Partial<Student>) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSaveStudent = (studentData: Partial<Student>) => {
    if (selectedStudent) { // Editing
      setStudents(students.map(s => s.id === studentData.id ? studentData : s));
    } else { // Adding
      setStudents([studentData, ...students]);
    }
    handleCloseModals();
    console.log("Saved student:", studentData);
  };

  const handleDeleteStudent = () => {
    if (selectedStudent) {
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      handleCloseModals();
      console.log("Deleted student:", selectedStudent);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Manage Students</h1>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center bg-primary hover:bg-skhool-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 focus:ring-opacity-75"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add New Student
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Contact</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={student.profilePic || `https://ui-avatars.com/api/?name=${student.firstname}+${student.lastname}&background=random`} alt={`${student.firstname} ${student.lastname}`} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.firstname} {student.lastname}</div>
                        <div className="text-sm text-gray-500">{student.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.className} - {student.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{student.guardian}</div>
                    <div>{student.guardianContact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-4">
                    <button onClick={() => handleOpenEditModal(student)} className="text-skhool-blue-600 hover:text-skhool-blue-800 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 rounded p-1" title="Edit Student">
                      <PencilIcon className="w-5 h-5"/>
                    </button>
                    <button onClick={() => handleOpenDeleteModal(student)} className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1" title="Delete Student">
                      <TrashIcon className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSave={handleSaveStudent}
        studentToEdit={selectedStudent}
      />

      {selectedStudent && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleDeleteStudent}
          itemName={`${selectedStudent.firstname} ${selectedStudent.lastname}`}
          itemType="student"
        />
      )}
    </>
  );
};

export default AdminStudentsPage;
