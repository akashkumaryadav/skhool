"use client";
// app/students/page.tsx
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import {
  ColumnDef,
  GenericDataTable,
} from "@/app/components/common/GenericTable";

// lib/student-data.ts
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
// Define the type for a student object
type Student = (typeof studentData)[0];

// Define the columns for the Student table
const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Student Name",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Image
          src={`https://avatar.iran.liara.run/username?username=${row?.name.toLowerCase()}`}
          alt={row.name}
          width={40}
          height={40}
          className="rounded-full"
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
    isFilterable: true,
    filterOptions: ["Paid", "Unpaid"], // <-- Provide options
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
    isFilterable: true, // <-- Enable filtering
    filterOptions: ["Google", "Facebook", "Swell"], // <-- Provide options
    cell: (row) => (
      <div className="flex items-center gap-2">
        {/* In a real app, you'd have a map of logos */}
        <Image
          src={`https://logo.clearbit.com/${row.guardianCompany.toLowerCase()}.com`}
          alt={row.guardianCompany}
          width={16}
          height={16}
          className="rounded-sm"
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
        {/* Using a placeholder avatar for the guardian */}
        <Image
          src={`/next.svg`}
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
  const handleAddStudent = () => {
    alert("Opening form to add a new student...");
    // Here you would typically open a modal or navigate to a new page
  };

  return (
    <div className="bg-gray-100 p-0 m-0 flex items-start justify-center">
      <div className="w-full">
        <GenericDataTable
          title={`${studentData.length} Students`}
          data={studentData}
          columns={columns}
          ctaButton={{
            text: "Add Student",
            onClick: handleAddStudent,
          }}
        />
      </div>
    </div>
  );
}
