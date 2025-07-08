// components/dashboard/StudentDirectory.tsx
import { MoreHorizontal, Pencil } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Student } from "../types/types";

// Define some mock data
const students: Student[] = [
    {
        firstname: "Arun",
        lastname: "Kumar",
        bio: "A diligent student with a keen interest in science.",
        className: "10th",
        section: "A",
        dateOfBirth: "2008-05-15",
        gender: "Male",
        guardian: "Ravi Kumar",
        guardianContact: "9876543210",
        address: "123 Main St, Chennai",
        id: "1",
        rollNo: 101,
        stream: "Science",
        studentId: "STU001",
        attendancePercentage: 95,
        extraCurricular: ["Football", "Science Club"],
        organization: "ABC High School",
        organizationEmail: "abc@highschool.in",
        overallGrade: "A",
        feesPaid: "Paid",
    },
    {
        firstname: "Meera",
        lastname: "Sharma",
        bio: "An enthusiastic learner with a passion for arts.",
        className: "9th",
        section: "B",
        dateOfBirth: "2009-08-22",
        gender: "Female",
        guardian: "Suresh Sharma",
        guardianContact: "9876543211",
        address: "456 Elm St, Mumbai",
        id: "2",
        rollNo: 102,
        stream: "Arts",
        studentId: "STU002",
        attendancePercentage: 92,
        extraCurricular: ["Painting", "Drama Club"],
        organization: "XYZ High School",
        organizationEmail: "xyz@highschool.in",
        overallGrade: "A-",
        feesPaid: "Paid",
    },
    {
        firstname: "Rahul",
        lastname: "Verma",
        bio: "A tech-savvy student with a love for coding.",
        className: "11th",
        section: "C",
        dateOfBirth: "2007-03-10",
        gender: "Male",
        guardian: "Anil Verma",
        guardianContact: "9876543212",
        address: "789 Pine St, Delhi",
        id: "3",
        rollNo: 103,
        stream: "Computer Science",
        studentId: "STU003",
        attendancePercentage: 88,
        extraCurricular: ["Coding Club", "Robotics"],
        organization: "LMN High School",
        organizationEmail: "lmn@highschool.in",
        overallGrade: "B+",
        feesPaid: "Pending",
    },
    {
        firstname: "Sneha",
        lastname: "Patel",
        bio: "A bright student excelling in mathematics.",
        className: "12th",
        section: "A",
        dateOfBirth: "2006-11-05",
        gender: "Female",
        guardian: "Rajesh Patel",
        guardianContact: "9876543213",
        address: "321 Oak St, Ahmedabad",
        id: "4",
        rollNo: 104,
        stream: "Mathematics",
        studentId: "STU004",
        attendancePercentage: 97,
        extraCurricular: ["Math Club", "Debate Team"],
        organization: "PQR High School",
        organizationEmail: "pqr@highschool.in",
        overallGrade: "A+",
        feesPaid: "Paid",
    },
    {
        firstname: "Amit",
        lastname: "Singh",
        bio: "A sports enthusiast with a talent for cricket.",
        className: "10th",
        section: "D",
        dateOfBirth: "2008-01-18",
        gender: "Male",
        guardian: "Vijay Singh",
        guardianContact: "9876543214",
        address: "654 Maple St, Jaipur",
        id: "5",
        rollNo: 105,
        stream: "General",
        studentId: "STU005",
        attendancePercentage: 85,
        extraCurricular: ["Cricket Team", "Athletics"],
        organization: "STU High School",
        organizationEmail: "stu@highschool.in",
        overallGrade: "B",
        feesPaid: "Pending",
    },
];

export const StudentDirectory = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 text-lg">Student Directory</h3>
        <button className="text-sm text-gray-600 border rounded-lg px-3 py-1.5 hover:bg-gray-50">
          Filter & Short
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="py-2 pr-4">Student Name</th>
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
        </table>
      </div>
    </div>
  );
};
