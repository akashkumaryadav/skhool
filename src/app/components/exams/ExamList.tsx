"use client";
import React, { useState } from "react";
import { Calendar, Clock, Users, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Exam, ExamStatus, ExamType } from "../../types/types";
import { CreateExamModal } from "./CreateExamModal";
import { GenericDataTable, ColumnDef } from "../common/GenericTable";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import moment from "moment";

interface ExamListProps {
  exams: Exam[];
  isLoading: boolean;
  onExamSelect: (examId: string) => void;
  onRefresh: () => void;
}

export const ExamList: React.FC<ExamListProps> = ({
  exams,
  isLoading,
  onExamSelect,
  onRefresh,
}) => {
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState<Exam | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: ExamStatus) => {
    switch (status) {
      case ExamStatus.SCHEDULED:
        return "bg-blue-100 text-blue-800";
      case ExamStatus.ONGOING:
        return "bg-yellow-100 text-yellow-800";
      case ExamStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case ExamStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: ExamType) => {
    switch (type) {
      case ExamType.FINAL_EXAM:
        return "bg-purple-100 text-purple-800";
      case ExamType.MID_TERM:
        return "bg-indigo-100 text-indigo-800";
      case ExamType.UNIT_TEST:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const deleteExamMutation = useMutation({
    mutationFn: async (examId: string) => {
      const response = await axiosInstance.delete(`/exams/${examId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Exam deleted successfully!");
      onRefresh();
      setDeleteConfirmOpen(false);
      setExamToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete exam");
    },
  });

  const handleViewDetails = (exam: Exam) => {
    router.push(`/admin/exams/${exam.id}`);
  };

  const handleEditExam = (exam: Exam) => {
    setExamToEdit(exam);
    setEditModalOpen(true);
  };

  const handleDeleteExam = (exam: Exam) => {
    setExamToDelete(exam);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (examToDelete) {
      deleteExamMutation.mutate(examToDelete.id);
    }
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  // Filter exams based on search query
  const filteredExams = exams.filter((exam) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      exam.name.toLowerCase().includes(searchLower) ||
      exam.subject.toLowerCase().includes(searchLower) ||
      exam.className.toLowerCase().includes(searchLower) ||
      exam.section.toLowerCase().includes(searchLower) ||
      exam.status.toLowerCase().includes(searchLower) ||
      exam.examType.toLowerCase().includes(searchLower)
    );
  });

  // Define columns for the GenericDataTable
  const columns: ColumnDef<Exam>[] = [
    {
      accessorKey: "name",
      header: "Exam Name",
      cell: (exam) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{exam.name}</span>
          <span className="text-sm text-gray-500">{exam.subject}</span>
        </div>
      ),
    },
    {
      accessorKey: "examType",
      header: "Type",
      cell: (exam) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(exam.examType)}`}>
          {exam.examType}
        </span>
      ),
      isFilterable: true,
      filterOptions: Object.values(ExamType),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (exam) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exam.status)}`}>
          {exam.status}
        </span>
      ),
      isFilterable: true,
      filterOptions: Object.values(ExamStatus),
    },
    {
      accessorKey: "className",
      header: "Class",
      cell: (exam) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{exam.className} {exam.section}</span>
        </div>
      ),
    },
    {
      accessorKey: "examDate",
      header: "Date",
      cell: (exam) => (
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{moment(exam.examDate).format("MMM DD, YYYY")}</span>
        </div>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: (exam) => (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{exam.duration} mins</span>
        </div>
      ),
    },
    {
      accessorKey: "totalMarks",
      header: "Marks",
      cell: (exam) => (
        <div className="text-sm">
          <div>Total: {exam.totalMarks}</div>
          <div className="text-gray-500">Pass: {exam.passingMarks}</div>
        </div>
      ),
    },
    {
      accessorKey: "id" as keyof Exam,
      header: "Actions",
      cell: (exam) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetails(exam)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEditExam(exam)}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="Edit Exam"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteExam(exam)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Exam"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Exams</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all your exams</p>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exams yet</h3>
          <p className="text-gray-500">Create your first exam to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <GenericDataTable
        title="Exams"
        data={filteredExams}
        columns={columns}
        ctaButton={[]}
        onSearchQueryChange={handleSearchQueryChange}
        totalCount={filteredExams.length}
      />

      
      {/* Edit Modal */}
      <CreateExamModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setExamToEdit(null);
        }}
        onSuccess={() => {
          setEditModalOpen(false);
          setExamToEdit(null);
          onRefresh();
        }}
        editMode={true}
        examData={examToEdit || undefined}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && examToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Exam</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{examToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setExamToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteExamMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteExamMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
