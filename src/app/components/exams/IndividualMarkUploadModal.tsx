"use client";
import React, { useState, useEffect } from "react";
import { X, Save, User } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import { Student, Exam } from "../../types/types";

interface IndividualMarkUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  examId: string;
  studentId?: string;
}

interface SubjectMarks {
  subjectId: string;
  subjectName: string;
  marks: string;
  totalMarks: number;
  remarks: string;
}

export const IndividualMarkUploadModal: React.FC<
  IndividualMarkUploadModalProps
> = ({ open, onClose, onSuccess, examId, studentId }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId || "");
  const [subjectMarks, setSubjectMarks] = useState<SubjectMarks[]>([]);
  const [generalRemarks, setGeneralRemarks] = useState("");

  const queryClient = useQueryClient();
  const exam: Exam = queryClient.getQueryData(["exam", examId]);

  // Fetch students for the class
  const { data: students = [] } = useQuery({
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
    enabled: !!exam?.className && open,
  });

  // Fetch subjects for the class
  const { data: subjects = [] } = useQuery({
    queryKey: ["classSubjects", exam?.className],
    queryFn: async () => {
      if (!exam?.className) return [];
      const response = await axiosInstance.get(
        `/subject/?className=${exam.className}`
      );
      return response.data;
    },
    enabled: !!exam?.className && open,
  });

  // Fetch existing marks for the selected student
  const { data: existingMarks = [] } = useQuery({
    queryKey: ["studentMarks", examId, selectedStudentId],
    queryFn: async () => {
      if (!selectedStudentId) return [];
      const response = await axiosInstance.get(
        `/api/exams/${examId}/results?studentId=${selectedStudentId}`
      );
      return response.data;
    },
    enabled: !!selectedStudentId && open,
  });

  // Initialize subject marks when subjects are loaded
  useEffect(() => {
    if (subjects.length > 0) {
      const initialMarks = subjects.map((subject: any) => ({
        subjectId: subject.id,
        subjectName: subject.name,
        marks: "",
        totalMarks: subject.totalMarks || exam?.totalMarks || 100,
        remarks: "",
      }));
      setSubjectMarks(initialMarks);
    }
  }, [subjects, exam?.totalMarks]);

  // Update marks with existing data
  useEffect(() => {
    if (existingMarks.length > 0 && subjectMarks.length > 0) {
      const updatedMarks = subjectMarks.map((subject) => {
        const existing = existingMarks.find(
          (mark: any) => mark.subjectId === subject.subjectId
        );
        if (existing) {
          return {
            ...subject,
            marks: existing.marksObtained.toString(),
            remarks: existing.remarks || "",
          };
        }
        return subject;
      });
      setSubjectMarks(updatedMarks);
    }
  }, [existingMarks]);

  const saveMarksMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.post(
        `/api/exams/${examId}/results`,
        data.subjects
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Marks saved successfully!");
      onSuccess();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save marks");
    },
  });

  const handleMarksChange = (subjectId: string, value: string) => {
    const subject = subjectMarks.find((s) => s.subjectId === subjectId);
    if (
      subject &&
      (value === "" ||
        (!isNaN(Number(value)) &&
          Number(value) >= 0 &&
          Number(value) <= subject.totalMarks))
    ) {
      setSubjectMarks((prev) =>
        prev.map((s) =>
          s.subjectId === subjectId ? { ...s, marks: value } : s
        )
      );
    }
  };

  const handleRemarksChange = (subjectId: string, value: string) => {
    setSubjectMarks((prev) =>
      prev.map((s) =>
        s.subjectId === subjectId ? { ...s, remarks: value } : s
      )
    );
  };

  const calculateGrade = (marksObtained: number, totalMarks: number) => {
    const percentage = (marksObtained / totalMarks) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  const handleSave = () => {
    if (!selectedStudentId) {
      toast.error("Please select a student");
      return;
    }

    const marksToSave = subjectMarks
      .filter((subject) => subject.marks !== "")
      .map((subject) => ({
        subjectId: subject.subjectId,
        marksObtained: Number(subject.marks),
        percentage: (Number(subject.marks) / subject.totalMarks) * 100,
        grade: calculateGrade(Number(subject.marks), subject.totalMarks),
        remarks: subject.remarks,
        studentId: selectedStudentId,
        examId: examId,
        totalMarks: subject.totalMarks,
      }));

    if (marksToSave.length === 0) {
      toast.error("Please enter marks for at least one subject");
      return;
    }

    saveMarksMutation.mutate({
      subjects: marksToSave,
    });
  };

  const resetForm = () => {
    setSelectedStudentId(studentId || "");
    setSubjectMarks([]);
    setGeneralRemarks("");
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Individual Mark Upload
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Exam Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-1">{exam?.name}</h3>
            <p className="text-sm text-blue-800">
              {exam?.subject} - {exam?.className} {exam?.section} | Total Marks:{" "}
              {exam?.totalMarks}
            </p>
          </div>

          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student *
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Choose a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstname} {student.lastname} (Roll: {student.rollNo}
                  ) - {student.studentId}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Student Info */}
          {selectedStudent && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {selectedStudent.firstname} {selectedStudent.lastname}
                </p>
                <p className="text-sm text-gray-600">
                  Roll: {selectedStudent.rollNo} | ID:{" "}
                  {selectedStudent.studentId}
                </p>
              </div>
            </div>
          )}

          {/* Subject Marks */}
          {selectedStudentId && subjectMarks.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Subject-wise Marks
              </h3>
              <div className="space-y-4">
                {subjectMarks.map((subject) => {
                  const grade = subject.marks
                    ? calculateGrade(Number(subject.marks), subject.totalMarks)
                    : "";

                  return (
                    <div
                      key={subject.subjectId}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {subject.subjectName}
                        </label>
                        <p className="text-xs text-gray-500">
                          Max: {subject.totalMarks}
                        </p>
                      </div>

                      <div className="md:col-span-1">
                        <label className="block text-xs text-gray-600 mb-1">
                          Marks Obtained
                        </label>
                        <input
                          type="number"
                          value={subject.marks}
                          onChange={(e) =>
                            handleMarksChange(subject.subjectId, e.target.value)
                          }
                          placeholder="0"
                          min="0"
                          max={subject.totalMarks}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="block text-xs text-gray-600 mb-1">
                          Grade
                        </label>
                        <div className="flex items-center h-10">
                          {grade && (
                            <span
                              className={`px-3 py-1 text-sm font-medium rounded-full ${
                                grade === "A+" || grade === "A"
                                  ? "bg-green-100 text-green-800"
                                  : grade === "B+" || grade === "B"
                                  ? "bg-blue-100 text-blue-800"
                                  : grade === "C" || grade === "D"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {grade}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">
                          Remarks
                        </label>
                        <input
                          type="text"
                          value={subject.remarks}
                          onChange={(e) =>
                            handleRemarksChange(
                              subject.subjectId,
                              e.target.value
                            )
                          }
                          placeholder="Optional remarks..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* General Remarks */}
          {selectedStudentId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                General Remarks
              </label>
              <textarea
                value={generalRemarks}
                onChange={(e) => setGeneralRemarks(e.target.value)}
                placeholder="Optional general remarks for the student..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedStudentId || saveMarksMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saveMarksMutation.isPending ? "Saving..." : "Save Marks"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
