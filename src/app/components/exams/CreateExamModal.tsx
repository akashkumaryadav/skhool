"use client";
import React, { useState } from "react";
import { X, Calendar, Clock, Users, BookOpen } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ExamType, Exam } from "../../types/types";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";

interface CreateExamModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editMode?: boolean;
  examData?: Exam;
}

export const CreateExamModal: React.FC<CreateExamModalProps> = ({
  open,
  onClose,
  onSuccess,
  editMode = false,
  examData,
}) => {
  const [formData, setFormData] = useState({
    name: examData?.name || "",
    description: examData?.description || "",
    subject: examData?.subject || "",
    className: examData?.className || "",
    section: examData?.section || "",
    totalMarks: examData?.totalMarks?.toString() || "",
    passingMarks: examData?.passingMarks?.toString() || "",
    examDate: examData?.examDate || "",
    duration: examData?.duration?.toString() || "",
    examType: examData?.examType || ExamType.UNIT_TEST,
  });

  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await axiosInstance.get("/classes");
      return response.data;
    },
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await axiosInstance.get("/subjects");
      return response.data;
    },
  });

  const createExamMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editMode && examData) {
        const response = await axiosInstance.put(`/exams/${examData.id}`, data);
        return response.data;
      } else {
        const response = await axiosInstance.post("/exams", data);
        return response.data;
      }
    },
    onSuccess: () => {
      toast.success(editMode ? "Exam updated successfully!" : "Exam created successfully!");
      onSuccess();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || (editMode ? "Failed to update exam" : "Failed to create exam"));
    },
  });

  const resetForm = () => {
    if (!editMode) {
      setFormData({
        name: "",
        description: "",
        subject: "",
        className: "",
        section: "",
        totalMarks: "",
        passingMarks: "",
        examDate: "",
        duration: "",
        examType: ExamType.UNIT_TEST,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.subject || !formData.className || !formData.examDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (Number(formData.passingMarks) > Number(formData.totalMarks)) {
      toast.error("Passing marks cannot be greater than total marks");
      return;
    }

    createExamMutation.mutate({
      ...formData,
      totalMarks: Number(formData.totalMarks),
      passingMarks: Number(formData.passingMarks),
      duration: Number(formData.duration),
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{editMode ? "Edit Exam" : "Create New Exam"}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter exam name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type
                </label>
                <select
                  value={formData.examType}
                  onChange={(e) => handleInputChange("examType", e.target.value as ExamType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Object.values(ExamType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter exam description (optional)"
              />
            </div>
          </div>

          {/* Class & Subject */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Class & Subject
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject: any) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  value={formData.className}
                  onChange={(e) => handleInputChange("className", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((cls: any) => (
                    <option key={cls.id} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => handleInputChange("section", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., A, B, C"
                />
              </div>
            </div>
          </div>

          {/* Marks & Duration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Marks & Duration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Marks *
                </label>
                <input
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => handleInputChange("totalMarks", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="100"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Marks *
                </label>
                <input
                  type="number"
                  value={formData.passingMarks}
                  onChange={(e) => handleInputChange("passingMarks", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="35"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="180"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Date *
              </label>
              <input
                type="date"
                value={formData.examDate}
                onChange={(e) => handleInputChange("examDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createExamMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createExamMutation.isPending ? (editMode ? "Updating..." : "Creating...") : (editMode ? "Update Exam" : "Create Exam")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
