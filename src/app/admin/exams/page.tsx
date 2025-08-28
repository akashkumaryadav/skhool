"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, FileText, BarChart3, Upload } from "lucide-react";
import { ExamList } from "../../components/exams/ExamList";
import { CreateExamModal } from "../../components/exams/CreateExamModal";
import { ExamAnalytics } from "../../components/exams/ExamAnalytics";
import { BulkUploadModal } from "../../components/exams/BulkUploadModal";
import axiosInstance from "../../lib/axiosInstance";
import { Exam } from "../../types/types";

const ExamsPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  const { data: exams = [], isLoading, refetch } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const response = await axiosInstance.get("/exams");
      return response.data as Exam[];
    },
  });

  const { data: examStats } = useQuery({
    queryKey: ["examStats"],
    queryFn: async () => {
      const response = await axiosInstance.get("/exams/stats");
      return response.data;
    },
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
          <p className="text-gray-500 mt-1">Create, manage, and analyze exams</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => setBulkUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Upload size={16} />
            Bulk Upload Marks
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={16} />
            Create Exam
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{examStats?.totalExams || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{examStats?.completedExams || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{examStats?.scheduledExams || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Score</p>
              <p className="text-2xl font-bold text-gray-900">{examStats?.averageScore || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam List */}
        <div className="lg:col-span-2">
          <ExamList 
            exams={exams} 
            isLoading={isLoading} 
            onExamSelect={setSelectedExamId}
            onRefresh={refetch}
          />
        </div>

        {/* Analytics Panel */}
        <div className="lg:col-span-1">
          <ExamAnalytics selectedExamId={selectedExamId} />
        </div>
      </div>

      {/* Modals */}
      <CreateExamModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          refetch();
        }}
      />

      <BulkUploadModal
        open={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        onSuccess={() => {
          setBulkUploadOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default ExamsPage;
