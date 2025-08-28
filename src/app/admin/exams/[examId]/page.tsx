"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Upload, 
  BarChart3, 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  Target,
  BookOpen,
  Settings,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "../../../lib/axiosInstance";
import { toast } from "react-toastify";
import { Exam, ExamStatus, ExamType } from "../../../types/types";
import { CreateExamModal } from "../../../components/exams/CreateExamModal";
import { ReportTemplateManager } from "../../../components/exams/ReportTemplateManager";
import { StudentReportGenerator } from "../../../components/exams/StudentReportGenerator";
import moment from "moment";

const ExamDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [templateManagerOpen, setTemplateManagerOpen] = useState(false);
  const [reportGeneratorOpen, setReportGeneratorOpen] = useState(false);

  const { data: exam, isLoading, refetch } = useQuery({
    queryKey: ["exam", examId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/exams/${examId}`);
      return response.data as Exam;
    },
  });

  const { data: examStats } = useQuery({
    queryKey: ["examStats", examId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/exams/${examId}/stats`);
      return response.data;
    },
    enabled: !!exam,
  });

  const deleteExamMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/exams/${examId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Exam deleted successfully!");
      router.push("/admin/exams");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete exam");
    },
  });

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

  const handleDelete = () => {
    deleteExamMutation.mutate();
    setDeleteConfirmOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800">Exam not found</h2>
        <Link href="/admin/exams" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
          Back to Exams
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/exams"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{exam.name}</h1>
            <p className="text-gray-500 mt-1">
              {exam.subject} • {exam.className} {exam.section}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Exam Info Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Exam Details</h2>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(exam.status)}`}>
              {exam.status}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(exam.examType)}`}>
              {exam.examType}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Exam Date</p>
              <p className="font-medium text-gray-900">
                {moment(exam.examDate).format("MMM DD, YYYY")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium text-gray-900">{exam.duration} minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Marks</p>
              <p className="font-medium text-gray-900">{exam.totalMarks}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Passing Marks</p>
              <p className="font-medium text-gray-900">{exam.passingMarks}</p>
            </div>
          </div>
        </div>

        {exam.description && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{exam.description}</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {examStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Students Appeared</p>
                <p className="text-2xl font-bold text-gray-900">{examStats.studentsAppeared || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{examStats.averageMarks?.toFixed(1) || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pass Rate</p>
                <p className="text-2xl font-bold text-gray-900">{examStats.passPercentage?.toFixed(1) || 0}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Highest Score</p>
                <p className="text-2xl font-bold text-gray-900">{examStats.highestMarks || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href={`/admin/exams/${examId}/marks`}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Upload Marks</p>
              <p className="text-sm text-gray-500">Add or update student marks</p>
            </div>
          </Link>

          <button
            onClick={() => setReportGeneratorOpen(true)}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Generate Student Reports</p>
              <p className="text-sm text-gray-500">Create individual student reports</p>
            </div>
          </button>

          <button
            onClick={() => setTemplateManagerOpen(true)}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
          >
            <div className="p-2 bg-orange-100 rounded-lg">
              <Settings className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Templates</p>
              <p className="text-sm text-gray-500">Create and edit report templates</p>
            </div>
          </button>

          <Link
            href={`/admin/exams/dashboard?examId=${examId}`}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-500">Detailed performance insights</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Edit Modal */}
      <CreateExamModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          setEditModalOpen(false);
          refetch();
        }}
        editMode={true}
        examData={exam}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Exam</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{exam.name}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteExamMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteExamMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Template Manager */}
      <ReportTemplateManager
        open={templateManagerOpen}
        onClose={() => setTemplateManagerOpen(false)}
      />

      {/* Student Report Generator */}
      {exam && (
        <StudentReportGenerator
          open={reportGeneratorOpen}
          onClose={() => setReportGeneratorOpen(false)}
          exam={exam}
        />
      )}
    </div>
  );
};

export default ExamDetailPage;
