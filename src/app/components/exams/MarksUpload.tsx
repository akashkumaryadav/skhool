"use client";
import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Users, User, Award } from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import { Student, ExamResult, Exam } from "../../types/types";
import { GenericDataTable, ColumnDef } from "../common/GenericTable";
import { IndividualMarkUploadModal } from "./IndividualMarkUploadModal";
import { BulkUploadModal } from "./BulkUploadModal";

interface MarksUploadProps {
  examId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface StudentMarkData {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: number;
  marksObtained: number | null;
  totalMarks: number;
  percentage: number | null;
  grade: string;
  remarks: string;
  status: "Not Attempted" | "Completed" | "Partial";
}

export const MarksUpload: React.FC<MarksUploadProps> = ({
  examId,
  onClose,
  onSuccess,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showIndividualModal, setShowIndividualModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>();

  const queryClient = useQueryClient();
  const exam: Exam = queryClient.getQueryData(["exam", examId]);

  // Fetch students for the class
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ["examStudents", exam?.className],
    queryFn: async () => {
      if (!exam?.className) return [];
      const response = await axiosInstance.post(`/student/get_students`, {
        filters: [
          {
            field: "className",
            operator: "EQUALS",
            value: exam.className,
            condition: "AND",
          },
        ],
        pageSize: 1000,
        pageNumber: 0,
      });
      return response.data?.students as Student[];
    },
    enabled: !!exam?.className,
  });

  const { data: existingResults = [], isLoading: resultsLoading } = useQuery({
    queryKey: ["examResults", examId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/exams/${examId}/results`);
      return response.data as ExamResult[];
    },
  });

  // Combine student data with exam results
  const studentMarkData: StudentMarkData[] = useMemo(() => {
    return students.map((student) => {
      const result = existingResults.find((r) => r.studentId === student.id);
      return {
        id: student.id,
        studentId: student.studentId,
        studentName: `${student.firstname} ${student.lastname}`,
        rollNo: student.rollNo,
        marksObtained: result?.marksObtained || null,
        totalMarks: exam?.totalMarks || 100,
        percentage: result?.percentage || null,
        grade: result?.grade || "",
        remarks: result?.remarks || "",
        status: result ? "Completed" : "Not Attempted",
      };
    });
  }, [students, existingResults, exam?.totalMarks]);

  // Define columns for the GenericTable
  const columns: ColumnDef<StudentMarkData>[] = [
    {
      accessorKey: "rollNo",
      header: "Roll No",
      cell: (row) => (
        <span className="font-medium text-gray-900">{row.rollNo}</span>
      ),
    },
    {
      accessorKey: "studentName",
      header: "Student Name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.studentName}</p>
            <p className="text-sm text-gray-500">{row.studentId}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "marksObtained",
      header: "Marks Obtained",
      cell: (row) => (
        <div className="text-center">
          {row.marksObtained !== null ? (
            <span className="font-medium text-gray-900">
              {row.marksObtained}/{row.totalMarks}
            </span>
          ) : (
            <span className="text-gray-400">Not entered</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "percentage",
      header: "Percentage",
      cell: (row) => (
        <div className="text-center">
          {row.percentage !== null ? (
            <span className="font-medium text-gray-900">
              {row.percentage.toFixed(1)}%
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: (row) => (
        <div className="text-center">
          {row.grade ? (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                row.grade === "A+" || row.grade === "A"
                  ? "bg-green-100 text-green-800"
                  : row.grade === "B+" || row.grade === "B"
                  ? "bg-blue-100 text-blue-800"
                  : row.grade === "C" || row.grade === "D"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {row.grade}
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.status === "Completed"
              ? "bg-green-100 text-green-800"
              : row.status === "Partial"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status}
        </span>
      ),
      isFilterable: true,
      filterOptions: ["Not Attempted", "Completed", "Partial"],
    },
    {
      accessorKey: "remarks",
      header: "Remarks",
      cell: (row) => (
        <span className="text-sm text-gray-600 truncate max-w-32 block">
          {row.remarks || "-"}
        </span>
      ),
    },
  ];

  const handleIndividualUpload = (studentId?: string) => {
    setSelectedStudentId(studentId);
    setShowIndividualModal(true);
  };

  const handleModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["examResults", examId] });
    setShowIndividualModal(false);
    setShowBulkModal(false);
    onSuccess();
  };

  if (studentsLoading || resultsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Student Marks</h2>
            <p className="text-sm text-gray-500 mt-1">
              {exam?.name} - {exam?.subject} ({exam?.className} {exam?.section})
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-gray-600">
                Total Marks:{" "}
                <span className="font-medium">{exam?.totalMarks}</span>
              </span>
              <span className="text-gray-600">
                Students: <span className="font-medium">{students.length}</span>
              </span>
              <span className="text-gray-600">
                Completed:{" "}
                <span className="font-medium">{existingResults.length}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleIndividualUpload()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100"
            >
              <UserPlus className="w-4 h-4" />
              Individual Upload
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <Users className="w-4 h-4" />
              Bulk Upload
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-xl font-bold text-gray-900">
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {existingResults.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {students.length - existingResults.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average</p>
                <p className="text-xl font-bold text-gray-900">
                  {existingResults.length > 0
                    ? (
                        existingResults.reduce(
                          (sum, r) => sum + r.marksObtained,
                          0
                        ) / existingResults.length
                      ).toFixed(1)
                    : "0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GenericTable */}
        <GenericDataTable
          title="Student Marks Overview"
          data={studentMarkData}
          columns={columns}
          ctaButton={
            [
              // {
              //   text: "Individual Upload",
              //   onClick: () => handleIndividualUpload(),
              // },
              // {
              //   text: "Bulk Upload",
              //   onClick: () => setShowBulkModal(true),
              // },
            ]
          }
          onSearchQueryChange={setSearchQuery}
          totalCount={studentMarkData.length}
        />
      </div>

      {/* Modals */}
      <IndividualMarkUploadModal
        open={showIndividualModal}
        onClose={() => setShowIndividualModal(false)}
        onSuccess={handleModalSuccess}
        examId={examId}
        studentId={selectedStudentId}
      />

      <BulkUploadModal
        open={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};
