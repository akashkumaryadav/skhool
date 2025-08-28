"use client";
import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  FileText, 
  Download, 
  Users, 
  Search, 
  Filter,
  X,
  Eye,
  Settings,
  Printer,
  Mail,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import { ReportTemplate, Student, Exam, ReportGenerationRequest } from "../../types/types";
import html2pdf from "html2pdf.js";

interface StudentReportGeneratorProps {
  open: boolean;
  onClose: () => void;
  exam: Exam;
}

export const StudentReportGenerator: React.FC<StudentReportGeneratorProps> = ({
  open,
  onClose,
  exam,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  // Fetch available templates
  const { data: templates = [] } = useQuery({
    queryKey: ["reportTemplates", "student_report"],
    queryFn: async () => {
      const response = await axiosInstance.get("/report-templates?type=student_report");
      return response.data as ReportTemplate[];
    },
    enabled: open,
  });

  // Fetch students for the exam's class
  const { data: students = [] } = useQuery({
    queryKey: ["examStudents", exam.id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/exams/${exam.id}/students`);
      return response.data as Student[];
    },
    enabled: open,
  });

  // Fetch exam results for selected students
  const { data: examResults = [] } = useQuery({
    queryKey: ["examResults", exam.id, selectedStudents],
    queryFn: async () => {
      if (selectedStudents.length === 0) return [];
      const response = await axiosInstance.get(`/exams/${exam.id}/results`, {
        params: { studentIds: selectedStudents.join(",") }
      });
      return response.data;
    },
    enabled: selectedStudents.length > 0,
  });

  // Generate reports mutation
  const generateReportsMutation = useMutation({
    mutationFn: async (data: ReportGenerationRequest) => {
      const response = await axiosInstance.post("/reports/generate", data);
      return response.data;
    },
    onSuccess: (data) => {
      setGeneratedReports(data.reports);
      toast.success(`Generated ${data.reports.length} report(s) successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to generate reports");
    },
  });

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handlePreview = async () => {
    if (!selectedTemplate || selectedStudents.length === 0) {
      toast.error("Please select a template and at least one student");
      return;
    }

    try {
      const response = await axiosInstance.post("/reports/preview", {
        examId: exam.id,
        studentIds: [selectedStudents[0]], // Preview first selected student
        templateId: selectedTemplate,
      });
      
      setPreviewData(response.data);
      setShowPreview(true);
    } catch (error) {
      toast.error("Failed to generate preview");
    }
  };

  const handleGenerate = () => {
    if (!selectedTemplate || selectedStudents.length === 0) {
      toast.error("Please select a template and at least one student");
      return;
    }

    generateReportsMutation.mutate({
      examId: exam.id,
      studentIds: selectedStudents,
      templateId: selectedTemplate,
    });
  };

  const downloadPDF = async (reportData: any, studentName: string) => {
    const element = document.createElement('div');
    element.innerHTML = reportData.content;
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';

    const opt = {
      margin: 1,
      filename: `${exam.name}_${studentName}_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      toast.success(`PDF downloaded for ${studentName}`);
    } catch (error) {
      toast.error(`Failed to download PDF for ${studentName}`);
    }
  };

  const downloadAllPDFs = async () => {
    for (const report of generatedReports) {
      const student = students.find(s => s.id === report.studentId);
      if (student) {
        await downloadPDF(report, `${student.firstName}_${student.lastName}`);
        // Add delay to prevent overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Generate Student Reports</h2>
            <p className="text-sm text-gray-500 mt-1">Exam: {exam.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Template Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Report Template
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === template.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      {template.isDefault && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full mt-2">
                          Default
                        </span>
                      )}
                    </div>
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Select Students ({selectedStudents.length} selected)
              </label>
              <button
                onClick={handleSelectAll}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                {selectedStudents.length === filteredStudents.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Student List */}
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredStudents.map((student) => {
                const result = examResults.find(r => r.studentId === student.id);
                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentSelect(student.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Roll: {student.rollNumber}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {result ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {result.marksObtained}/{exam.totalMarks}
                          </div>
                          <div className={`text-xs ${
                            result.marksObtained >= exam.passingMarks 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {result.marksObtained >= exam.passingMarks ? "Pass" : "Fail"}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">No result</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePreview}
                disabled={!selectedTemplate || selectedStudents.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={!selectedTemplate || selectedStudents.length === 0 || generateReportsMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                {generateReportsMutation.isPending ? "Generating..." : "Generate Reports"}
              </button>
            </div>
          </div>

          {/* Generated Reports */}
          {generatedReports.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-green-800">
                    Reports Generated Successfully
                  </h3>
                </div>
                <button
                  onClick={downloadAllPDFs}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  Download All PDFs
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {generatedReports.map((report, index) => {
                  const student = students.find(s => s.id === report.studentId);
                  return (
                    <div key={index} className="bg-white border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {student?.firstName} {student?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Roll: {student?.rollNumber}
                          </div>
                        </div>
                        <button
                          onClick={() => downloadPDF(report, `${student?.firstName}_${student?.lastName}`)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Report Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-6">
              <div 
                ref={previewRef}
                className="border border-gray-200 rounded-lg p-6 bg-white"
                dangerouslySetInnerHTML={{ __html: previewData.content }}
              />
              
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const student = students.find(s => s.id === selectedStudents[0]);
                    if (student) {
                      downloadPDF(previewData, `${student.firstName}_${student.lastName}`);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
