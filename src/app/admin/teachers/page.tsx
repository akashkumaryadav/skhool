// app/admin/teachers/page.tsx
"use client";

import React, { useState } from "react";
import { Teacher } from "../../types/types";
import { PlusCircleIcon, PencilIcon, TrashIcon } from "../../constants";
import TeacherFormModal from "../../components/TeacherFormModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useQuery } from "@tanstack/react-query";
import axios from "@/app/lib/axiosInstance";

const AdminTeachersPage: React.FC = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] =
    useState<Partial<Teacher> | null>(null);

  const {
    data: { teachers = [] },
    loading,
  } = useQuery<{
    totalPage: number;
    totalElements: number;
    teachers: Array<Teacher>;
  }>({
    queryKey: ["teachers"],
    queryFn: async () => {
      return axios
        .post("/admin/teachers/", {
          page: 0,
          pageSize: 100,
        })
        .then((res) => res.data);
    },
    staleTime: 1000 * 60 * 1, // 1 minutes
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
  console.log("Teachers data:", teachers);
  
  const handleOpenAddModal = () => {
    setSelectedTeacher(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (teacher: Partial<Teacher>) => {
    setSelectedTeacher(teacher);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (teacher: Partial<Teacher>) => {
    setSelectedTeacher(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleSaveTeacher = (teacherData: Partial<Teacher>) => {
    handleCloseModals();
    console.log("Saved teacher:", teacherData);
  };

  const handleDeleteTeacher = () => {
    // if (selectedTeacher) {
    //   setTeachers(teachers.filter((t) => t.id !== selectedTeacher.id));
    //   handleCloseModals();
    //   console.log("Deleted teacher:", selectedTeacher);
    // }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Manage Teachers</h1>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center bg-primary hover:bg-skhool-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 focus:ring-opacity-75"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add New Teacher
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Employee ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Subjects
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={
                            teacher.profilePic ||
                            `https://ui-avatars.com/api/?name=${teacher.firstname}+${teacher.lastname}&background=random`
                          }
                          alt={`${teacher.firstname} ${teacher.lastname}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {teacher.firstname} {teacher.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {teacher.qualification}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{teacher.personalEmail}</div>
                    <div>{teacher.contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-4">
                    <button
                      onClick={() => handleOpenEditModal(teacher)}
                      className="text-skhool-blue-600 hover:text-skhool-blue-800 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 rounded p-1"
                      title="Edit Teacher"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(teacher)}
                      className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                      title="Delete Teacher"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TeacherFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSave={handleSaveTeacher}
        teacherToEdit={selectedTeacher}
      />

      {selectedTeacher && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleDeleteTeacher}
          itemName={`${selectedTeacher.firstname} ${selectedTeacher.lastname}`}
          itemType="teacher"
        />
      )}
    </>
  );
};

export default AdminTeachersPage;
