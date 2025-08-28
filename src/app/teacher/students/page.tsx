"use client"; // This page is interactive, so it must be a client component

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import {
  ColumnDef,
  GenericDataTable,
} from "@/app/components/common/GenericTable";

export const studentData = [
  {
    id: 1,
    name: "Darlene Robertson",
    lastActive: "Today at 4:30 PM",
    email: "bill.sanders@example.com",
    phone: "(907) 555-0101",
    feeStatus: "Paid",
    guardianCompany: "Google",
    guardian: "Chad Thunderclock",
    avatar: "/images/avatars/avatar1.png",
  },
  {
    id: 2,
    name: "Guy Hawkins",
    lastActive: "Today at 4:30 PM",
    email: "michelle.rivera@example.com",
    phone: "(319) 555-0115",
    feeStatus: "Unpaid",
    guardianCompany: "Facebook",
    guardian: "Chad Thunderclock",
    avatar: "/images/avatars/avatar2.png",
  },
  {
    id: 3,
    name: "Theresa Webb",
    lastActive: "Today at 4:30 PM",
    email: "nathan.roberts@example.com",
    phone: "(225) 555-0118",
    feeStatus: "Paid",
    guardianCompany: "Google",
    guardian: "Chad Thunderclock",
    avatar: "/images/avatars/avatar3.png",
  },
  {
    id: 4,
    name: "Robert Fox",
    lastActive: "Today at 4:30 PM",
    email: "alma.lawson@example.com",
    phone: "(217) 555-0113",
    feeStatus: "Paid",
    guardianCompany: "Facebook",
    guardian: "Chad Thunderclock",
    avatar: "/images/avatars/avatar4.png",
  },
  {
    id: 5,
    name: "Devon Lane",
    lastActive: "Today at 4:30 PM",
    email: "tanya.hill@example.com",
    phone: "(704) 555-0127",
    feeStatus: "Unpaid",
    guardianCompany: "Swell",
    guardian: "Chad Thunderclock",
    avatar: "/images/avatars/avatar5.png",
  },
];
// Define the type for a student object based on our data structure
type Student = (typeof studentData)[0];

// Define the columns for the Student table.
// This is where we configure how each column looks and behaves.
const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Student Name",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Image
          src={row.avatar}
          alt={row.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{row.name}</p>
          <p className="text-xs text-gray-500">{row.lastActive}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Contact",
    cell: (row) => (
      <div>
        <div className="flex items-center gap-2 text-gray-700">
          <Mail size={14} /> <span>{row.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 mt-1">
          <Phone size={14} /> <span>{row.phone}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "feeStatus",
    header: "Fee Status",
    isFilterable: true, // Enable dropdown filtering for this column
    filterOptions: ["Paid", "Unpaid"], // Provide the options for the dropdown
    cell: (row) => (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.feeStatus === "Paid"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.feeStatus}
      </span>
    ),
  },
  {
    accessorKey: "guardianCompany",
    header: "Guardian Company",
    isFilterable: true, // Enable dropdown filtering
    filterOptions: ["Google", "Facebook", "Swell"], // Provide the options
    cell: (row) => (
      <div className="flex items-center gap-2">
        {/* Using a service like clearbit to get company logos dynamically */}
        <Image
          src={`https://logo.clearbit.com/${row.guardianCompany.toLowerCase()}.com`}
          alt={row.guardianCompany}
          width={18}
          height={18}
          className="rounded-sm"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder-logo.png";
          }} // Fallback image
        />
        <span className="text-gray-700">{row.guardianCompany}</span>
      </div>
    ),
  },
  {
    accessorKey: "guardian",
    header: "Guardian",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Image
          src="/images/avatars/avatar-guardian.png" // Using a generic guardian avatar
          alt={row.guardian}
          width={28}
          height={28}
          className="rounded-full"
        />
        <span className="font-medium text-gray-800">{row.guardian}</span>
      </div>
    ),
  },
];

export default function StudentManagementPage() {
  // State for AI interaction is managed here, in the parent component.
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiFilters, setAiFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Define the schema for filterable columns, to be sent to the AI.
  // useMemo ensures this is calculated only once.
  const filterableSchema = useMemo(() => {
    return columns
      .filter((c) => c.isFilterable)
      .map((col) => ({
        accessorKey: col.accessorKey,
        header: col.header,
        filterOptions: col.filterOptions,
      }));
  }, []); // Empty dependency array means this runs only once.

  // This effect handles the debounced API call for the AI search.
  useEffect(() => {
    // Don't trigger AI for very short queries
    if (searchQuery.length < 3) {
      setAiFilters({}); // Clear previous AI filters
      return;
    }

    // Set up a timer to avoid making an API call on every keystroke
    const handler = setTimeout(async () => {
      setIsAiProcessing(true);
      try {
        const response = await fetch("/api/ai-filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            schema: filterableSchema,
          }),
        });

        if (!response.ok) throw new Error("AI filter request failed");

        const generatedFilters = await response.json();
        setAiFilters(generatedFilters);
      } catch (error) {
        console.error("Failed to fetch AI filters:", error);
        setAiFilters({}); // Reset on error
      } finally {
        setIsAiProcessing(false);
      }
    }, 800); // 800ms debounce delay

    // Cleanup function to cancel the timer if the user types again
    return () => clearTimeout(handler);
  }, [searchQuery, filterableSchema]);

  // A memoized callback to update the search query state.
  // This is passed down to the GenericDataTable.
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Placeholder function for the "Add Student" button.
  const handleAddStudent = () => {
    alert("Opening form to add a new student...");
    // In a real app, this would open a modal or navigate to a "/students/new" page.
  };

  return (
    <div className="bg-gray-100 flex items-start justify-center">
      <div className="w-full max-w-screen-xl mx-auto">
        <GenericDataTable
          // --- Pass all necessary data and handlers down as props ---
          title={`${studentData.length} Students`}
          data={studentData}
          columns={columns}
          ctaButton={{
            text: "Add Student",
            onClick: handleAddStudent,
          }}
          onSearchQueryChange={handleSearchQueryChange}
          isAiProcessing={isAiProcessing}
          aiFilters={aiFilters}
        />
      </div>
    </div>
  );
}
