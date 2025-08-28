"use client";
import React, { useState, useRef } from "react";
import { X, Upload, Download, AlertCircle, CheckCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import { BulkUploadResult } from "../../types/types";

interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedExam, setSelectedExam] = useState("");
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: exams = [] } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const response = await axiosInstance.get("/exams");
      return response.data;
    },
    enabled: open,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, examId }: { file: File; examId: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("examId", examId);
      
      const response = await axiosInstance.post("/exams/bulk-upload-marks", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data: BulkUploadResult) => {
      setUploadResult(data);
      if (data.failed === 0) {
        toast.success(`Successfully uploaded marks for ${data.success} students!`);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        toast.warning(`Uploaded ${data.success} records, ${data.failed} failed`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload marks");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
        toast.error("Please select a CSV or Excel file");
        return;
      }
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !selectedExam) {
      toast.error("Please select both file and exam");
      return;
    }

    uploadMutation.mutate({ file: selectedFile, examId: selectedExam });
  };

  const downloadTemplate = async () => {
    try {
      const response = await axiosInstance.get("/exams/download-template", {
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "marks_upload_template.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download template");
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setSelectedExam("");
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Bulk Upload Marks</h2>
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
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Download the template file and fill in the marks</li>
              <li>• Ensure student IDs match exactly with system records</li>
              <li>• Marks should be numeric values only</li>
              <li>• Save the file as CSV or Excel format</li>
            </ul>
          </div>

          {/* Download Template */}
          <div>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>

          {/* Select Exam */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Exam *
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Choose an exam</option>
              {exams.map((exam: any) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name} - {exam.subject} ({exam.className} {exam.section})
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV or Excel files only</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50"
                  >
                    Choose File
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {uploadResult.failed === 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                <h3 className="font-medium text-gray-900">Upload Results</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-800">Successful</p>
                  <p className="text-2xl font-bold text-green-900">{uploadResult.success}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-800">Failed</p>
                  <p className="text-2xl font-bold text-red-900">{uploadResult.failed}</p>
                </div>
              </div>

              {uploadResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {uploadResult.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-700">
                        Row {error.row}: {error.error} (Student ID: {error.studentId})
                      </p>
                    ))}
                  </div>
                </div>
              )}
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
              {uploadResult?.failed === 0 ? "Close" : "Cancel"}
            </button>
            {!uploadResult && (
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedExam || uploadMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload Marks"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
