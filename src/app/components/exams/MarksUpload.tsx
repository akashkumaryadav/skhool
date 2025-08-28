"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Save, Search, User } from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import { Student, ExamResult } from "../../types/types";

interface MarksUploadProps {
  examId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const MarksUpload: React.FC<MarksUploadProps> = ({
  examId,
  onClose,
  onSuccess,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [marks, setMarks] = useState<{ [studentId: string]: string }>({});
  const [remarks, setRemarks] = useState<{ [studentId: string]: string }>({});

  const { data: exam } = useQuery({
    queryKey: ["exam", examId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/exams/${examId}`);
      return response.data;
    },
  });

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["examStudents", examId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/exams/${examId}/students`);
      return response.data as Student[];
    },
  });

  const { data: existingResults = [] } = useQuery({
    queryKey: ["examResults", examId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/exams/${examId}/results`);
      return response.data as ExamResult[];
    },
  });

  const saveMarksMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.post(`/exams/${examId}/marks`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Marks saved successfully!");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save marks");
    },
  });

  // Initialize marks from existing results
  React.useEffect(() => {
    if (existingResults.length > 0) {
      const existingMarks: { [key: string]: string } = {};
      const existingRemarks: { [key: string]: string } = {};
      
      existingResults.forEach((result) => {
        existingMarks[result.studentId] = result.marksObtained.toString();
        if (result.remarks) {
          existingRemarks[result.studentId] = result.remarks;
        }
      });
      
      setMarks(existingMarks);
      setRemarks(existingRemarks);
    }
  }, [existingResults]);

  const filteredStudents = students.filter((student) =>
    `${student.firstname} ${student.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toString().includes(searchTerm)
  );

  const handleMarksChange = (studentId: string, value: string) => {
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= exam?.totalMarks)) {
      setMarks(prev => ({ ...prev, [studentId]: value }));
    }
  };

  const handleRemarksChange = (studentId: string, value: string) => {
    setRemarks(prev => ({ ...prev, [studentId]: value }));
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
    const resultsToSave = Object.entries(marks)
      .filter(([_, mark]) => mark !== "")
      .map(([studentId, mark]) => ({
        studentId,
        marksObtained: Number(mark),
        percentage: (Number(mark) / exam.totalMarks) * 100,
        grade: calculateGrade(Number(mark), exam.totalMarks),
        remarks: remarks[studentId] || "",
      }));

    if (resultsToSave.length === 0) {
      toast.error("Please enter marks for at least one student");
      return;
    }

    saveMarksMutation.mutate({ results: resultsToSave });
  };

  if (isLoading) {
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Upload Marks</h2>
          <p className="text-sm text-gray-500 mt-1">
            {exam?.name} - {exam?.subject} ({exam?.className} {exam?.section})
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Total Marks: <span className="font-medium">{exam?.totalMarks}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search students by name, ID, or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Students List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-1">Roll No</div>
          <div className="col-span-3">Student Name</div>
          <div className="col-span-2">Student ID</div>
          <div className="col-span-2">Marks</div>
          <div className="col-span-1">Grade</div>
          <div className="col-span-3">Remarks</div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredStudents.map((student) => {
            const studentMarks = marks[student.id] || "";
            const studentRemarks = remarks[student.id] || "";
            const grade = studentMarks ? calculateGrade(Number(studentMarks), exam?.totalMarks || 100) : "";

            return (
              <div key={student.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50">
                <div className="col-span-1 flex items-center">
                  <span className="text-sm font-medium text-gray-900">{student.rollNo}</span>
                </div>
                
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.firstname} {student.lastname}
                    </p>
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-600">{student.studentId}</span>
                </div>
                
                <div className="col-span-2 flex items-center">
                  <input
                    type="number"
                    value={studentMarks}
                    onChange={(e) => handleMarksChange(student.id, e.target.value)}
                    placeholder="0"
                    min="0"
                    max={exam?.totalMarks}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="col-span-1 flex items-center">
                  {grade && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      grade === 'A+' || grade === 'A' ? 'bg-green-100 text-green-800' :
                      grade === 'B+' || grade === 'B' ? 'bg-blue-100 text-blue-800' :
                      grade === 'C' || grade === 'D' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {grade}
                    </span>
                  )}
                </div>
                
                <div className="col-span-3 flex items-center">
                  <input
                    type="text"
                    value={studentRemarks}
                    onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                    placeholder="Optional remarks..."
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saveMarksMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saveMarksMutation.isPending ? "Saving..." : "Save Marks"}
        </button>
      </div>
    </div>
  );
};
