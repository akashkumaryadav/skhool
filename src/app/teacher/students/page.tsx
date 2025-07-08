// app/students/page.tsx
"use client";

import React, { useState } from "react";
import { Student } from "@/app/types/types"; // Adjusted path
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  EyeIcon,
} from "@/app/components/icons"; // Adjusted path
import { useQuery } from "@tanstack/react-query";
import axios from "../../lib/axiosInstance"; // Adjust the path as necessary
import Image from "next/image";
import CustomDrawer from "@/app/components/common/Drawer";
import { Input, Select } from "antd";

const StudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);

  //give type to data
  // Using React Query to fetch students data

  const getFilter = () => {
    const filters: Array<Record<string, string>> = [];
    if (searchTerm) {
      filters.push({
        field: "firstname",
        value: searchTerm,
        condition: "AND",
        operator: "LIKE",
      });
      //   filters.push({
      //     field: "fullname",
      //     value: searchTerm,
      //     condition: "AND",
      //     operator: "LIKE",
      //   });
    }
    if (selectedClass) {
      filters.push({
        field: "className",
        value: selectedClass,
        condition: "AND",
        operator: "EQUALS",
      });
    }
    if (selectedSection) {
      filters.push({
        field: "section",
        value: selectedSection,
        condition: "AND",
        operator: "EQUALS",
      });
    }
    return filters;
  };

  const fetchStudents = async (page: number, pageSize: number, filters) => {
    const response = await axios.post(
      `/student/get_students`,
      {
        pageNumber: page,
        pageSize: pageSize,
        filters,
      },
      { withCredentials: true }
    );
    return response.data;
  };
  // Using useQuery to fetch students data
  // Adjust the endpoint and parameters as needed
  const { data, isLoading } = useQuery<any>({
    queryKey: [
      "students",
      page,
      pageSize,
      searchTerm,
      selectedClass,
      selectedSection,
    ],
    queryFn: async () => await fetchStudents(page, pageSize, getFilter()),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: false,
  });

  const students: Student[] = data?.students || [];
  const totalElements = data?.totalElements || 0;

  //   const { data, error, isLoading } = useQuery({
  //     queryKey: ["students"],
  //     queryFn: async () => {
  //       return axios
  //         .post("/api/student/get_students", { pageNumber: page, pageSize })
  //         .then((res) => res.data); // Adjust the endpoint as needed
  //     },
  //     staleTime: 1000 * 60 * 5, // 5 minutes
  //     refetchOnWindowFocus: false,
  //     retry: false,
  //   });

  //   const filteredStudents = students?.filter((student) => {
  //     const nameMatch = `${student.firstname} ${student.lastname}`
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase());
  //     const classMatch = selectedClass ? student.class === selectedClass : true;
  //     const sectionMatch = selectedSection
  //       ? student.section === selectedSection
  //       : true;
  //     return nameMatch && classMatch && sectionMatch;
  //   });

  const uniqueClasses = Array.from(
    new Set(students?.map((s) => s.className))
  ).sort();
  const uniqueSections = Array.from(
    new Set(students?.map((s) => s.section))
  ).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Students Management
        </h1>
        <div className="flex gap-2">
          {}
          <button
            onClick={() => setOpen(true)} // Placeholder
            className="flex items-center bg-primary hover:bg-skhool-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 focus:ring-opacity-75"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add Student
          </button>
          <button
            onClick={() => alert("Export Data Clicked!")} // Placeholder
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
            <label
              htmlFor="search-student"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Student
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 pt-5 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search-student"
              name="firstname"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="filter-class"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Class
            </label>
            <select
              id="filter-class"
              value={selectedClass}
              name="className"
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="filter-section"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Section
            </label>
            <select
              id="filter-section"
              value={selectedSection}
              name="section"
              onChange={(e) => setSelectedSection(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            >
              <option value="">All Sections</option>
              {uniqueSections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
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
                Student ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Class
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Roll No.
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Parent Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students?.length ? (
              students?.map((student: Student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={
                            student.profilePic ||
                            `https://ui-avatars.com/api/?name=${student.firstname}+${student.lastname}&background=random`
                          }
                          alt={
                            `${student.firstname} ${student.lastname}` ||
                            "Student Avatar"
                          }
                          width={40}
                          height={40}
                          // unoptimized={!!student.profilePic as any}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstname} {student.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.gender}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.className} - {student.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.rollNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{student.guardian}</div>
                    <div>{student.guardianContact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => alert(`View ${student.firstname}`)}
                      className="text-skhool-blue-600 hover:text-skhool-blue-800 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 rounded"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => alert(`Edit ${student.firstname}`)}
                      className="text-skhool-orange-500 hover:text-skhool-orange-700 focus:outline-none focus:ring-2 focus:ring-skhool-orange-500 rounded"
                      title="Edit Student"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {isLoading ? (
                  <td className="px-6 py-12 text-center text-gray-500">
                    Loading...
                  </td>
                ) : (
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No students found matching your criteria.
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <CustomDrawer
        open={open}
        onClose={() => setOpen(false)}
        enableHeader
        header="Add Student"
        enableFooter
        children={
          <div className="">
            <form>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="firstname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <Input
                    
                    type="text"
                    id="firstname"
                    name="firstname"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <Input
                    type="text"
                    id="lastname"
                    name="lastname"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="className"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Class
                  </label>
                  <Select
                    id="className"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
                    options={uniqueClasses.map((c) => ({
                      label: c,
                      value: c,
                    }))}
                    value={selectedClass}
                    onChange={(value) => setSelectedClass(value)}
                    placeholder="Select class"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="section"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Section
                  </label>
                  <Select
                    id="section"
                    options={uniqueSections.map((s) => ({
                      label: s,
                      value: s,
                    }))}
                    value={selectedSection}
                    onChange={(value) => setSelectedSection(value)}
                    placeholder="Select section"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
                   />
                </div>
              </div>
            </form>
          </div>
        }
        actions={[
          
          {
            label: "Cancel",
            onClick: () => setOpen(false),
            variant: "outlined",
            className: "border border-gray-300 text-gray-700 hover:bg-gray-50",
          },
          {
            label: "Save",
            onClick: () => {
              alert("Save Student Clicked!"); // Placeholder
              setOpen(false);
            },
            variant: "filled",
            className: "bg-blue-600 text-white hover:bg-blue-700",
          },
        ]}
      />
    </div>
  );
};

export default StudentsPage;
