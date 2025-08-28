"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Student } from "@/app/types/types";
import {
  ColumnDef,
  FilterCondition,
  GenericDataTable,
} from "@/app/components/common/GenericTable";
import axiosInstance from "@/app/lib/axiosInstance";
import AddStudent from "@/app/components/AddStudent";
import { translateAiFiltersToApiFilters } from "@/app/lib/utils";

// Define Columns for the GenericDataTable
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

export default function StudentsPage() {
  const [aiFilters, setAiFilters] = useState<FilterCondition[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0); // API is 0-indexed
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState<boolean>(false);
  const [bulkUpload, setBulkUpload] = useState<boolean>(false);

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

  


  const handleClose = () => {
    setOpen(false);
    setBulkUpload(false);
  };

  return (
    <div>
      <GenericDataTable
        title="Students Management"
        data={students}
        columns={columns}
        ctaButton={[
          {
            text: "Add Student",
            onClick: () => setOpen(true),
          },
          {
            text: "Bulk Upload",
            onClick: () => {
              setOpen(true);
              setBulkUpload(true);
            },
          },
        ]}
        onSearchQueryChange={handleSearchQueryChange}
        isAiProcessing={isFetching}
        aiFilters={aiFilters}
        totalCount={totalElements}
        onPageChange={(newPage) => setPage(newPage - 1)}
        onItemsPerPageChange={setPageSize}
      />
      <AddStudent bulkUpload={bulkUpload} open={open} onClose={handleClose} />
    </div>
  );
}
