// components/dashboard/StudentDirectory.tsx
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Student } from "../types/types";
import {
  ColumnDef,
  FilterCondition,
  GenericDataTable,
} from "./common/GenericTable";
import { useQuery } from "@tanstack/react-query";
import { translateAiFiltersToApiFilters } from "../lib/utils";
import axiosInstance from "../lib/axiosInstance";

const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "firstname",
    header: "Name",
    isFilterable: true,
    filterType: "text",
    cell: (row) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <Image
            className="h-10 w-10 rounded-full object-cover"
            src={
              row.profilePic ||
              `https://avatar.iran.liara.run/username?username=${row?.firstname.toLowerCase()}`
            }
            alt={`${row.firstname}-pic`}
            width={40}
            height={40}
          />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {row.firstname} {row.lastname}
          </div>
          <div className="text-sm text-gray-500">{row.gender}</div>
        </div>
      </div>
    ),
  },
  { accessorKey: "id", header: "Student ID" },
  {
    accessorKey: "className",
    header: "Class",
    isFilterable: true,
    filterType: "category",
    filterOptions: ["10th", "11th", "12th"],
  },
  {
    accessorKey: "section",
    header: "Section",
    isFilterable: true,
    filterType: "category",
    filterOptions: ["A", "B", "C"],
  },
  { accessorKey: "rollNo", header: "Roll No." },
  {
    accessorKey: "guardian",
    header: "Guardian",
    isFilterable: true,
    filterType: "text",
  },
];

export const StudentDirectory = () => {
  const [aiFilters, setAiFilters] = useState<FilterCondition[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0); // API is 0-indexed
  const [pageSize, setPageSize] = useState(10);

  const filterableSchema = useMemo(
    () =>
      columns
        .filter((c) => c.isFilterable)
        .map((c) => ({
          accessorKey: c.accessorKey,
          header: c.header,
          filterType: c.filterType,
          filterOptions: c.filterOptions,
        })),
    []
  );

  // Data Fetching with React Query, triggered by page, pageSize, or aiFilters
  const { data, isFetching } = useQuery({
    queryKey: ["students", page, pageSize, aiFilters],
    queryFn: async () => {
      const apiFilters = translateAiFiltersToApiFilters(aiFilters);
      const response = await axiosInstance.post(
        `/student/get_students`,
        { pageNumber: page, pageSize, filters: apiFilters },
        { withCredentials: true }
      );
      return response.data;
    },
    placeholderData: (prevData) => prevData,
  });

  const students: Student[] = data?.students || [];
  const totalElements = data?.totalElements || 0;

  // AI Search Logic
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.length < 3) {
        setAiFilters([]);
        return;
      }
      const response = await fetch("/api/ai-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, schema: filterableSchema }),
      });
      const generatedFilters: FilterCondition[] = await response.json();
      setAiFilters(generatedFilters);
      setPage(0); // Reset to first page on new search
    }, 800);
    return () => clearTimeout(handler);
  }, [searchQuery, filterableSchema]);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 text-lg">Student Directory</h3>
        <button className="text-sm text-gray-600 border rounded-lg px-3 py-1.5 hover:bg-gray-50">
          Filter & Short
        </button>
      </div> */}
      <div className="overflow-x-auto">
        <GenericDataTable
          title="Students Directory"
          data={students}
          columns={columns}
          ctaButton={[]}
          onSearchQueryChange={handleSearchQueryChange}
          isAiProcessing={isFetching}
          aiFilters={aiFilters}
          totalCount={totalElements}
          onPageChange={(newPage) => setPage(newPage - 1)}
          onItemsPerPageChange={setPageSize}
        />
        {/* <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500">
               
              <th className="py-2 px-4">Parents Names</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Class</th>
              <th className="py-2 px-4">Grade</th>
              <th className="py-2 px-4">Fee Status</th>
              <th className="py-2 pl-4">Edit</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="py-3 pr-4 flex items-center gap-3">
                  <Image
                    src={
                      student.profilePic ||
                      `https://avatar.iran.liara.run/username?username=${student.firstname.toLowerCase()}`
                    }
                    alt={student.firstname + " " + student.lastname}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-semibold text-gray-800">
                    {student.firstname} {student.lastname}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{student.guardian}</td>
                <td className="py-3 px-4 text-gray-600">
                  {student.guardianContact}
                </td>
                <td className="py-3 px-4 text-gray-600">{student.className}</td>
                <td className="py-3 px-4 text-gray-600">
                  {student.overallGrade}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      student?.feesPaid === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.feesPaid}
                  </span>
                </td>
                <td className="py-3 pl-4 text-gray-500">
                  <div className="flex items-center gap-2">
                    <MoreHorizontal size={18} />
                    <Pencil size={16} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
    </div>
  );
};
