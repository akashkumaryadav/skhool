"use client";
import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  AlertCircle,
} from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import {
  ReportTemplate,
  Student,
  Exam,
  ReportGenerationRequest,
} from "../../types/types";
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
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Sample PDF templates with eye-catching designs optimized for PDF generation
  const sampleTemplates = [
    {
      id: "modern-professional",
      name: "Modern Professional",
      description: "Clean professional design perfect for PDF export",
      preview: "bg-gradient-to-br from-blue-500 to-purple-600",
      templateContent: `
        <div style="font-family: 'Arial', sans-serif; width: 210mm; min-height: 297mm; margin: 0; padding: 15mm; background: white; color: #333; box-sizing: border-box;">
          <!-- School Header -->
          <div style="text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 25px;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 15px;">
              <div style="width: 60px; height: 60px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold;">🏫</div>
              <div style="text-align: left;">
                <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #1f2937;">{{schoolName}}</h1>
                <p style="font-size: 12px; color: #6b7280; margin: 2px 0;">{{schoolAddress}}</p>
                <p style="font-size: 12px; color: #6b7280; margin: 2px 0;">Phone: {{schoolPhone}} | Email: {{schoolEmail}}</p>
              </div>
            </div>
            <h2 style="font-size: 22px; font-weight: bold; margin: 15px 0 0 0; color: #1f2937; letter-spacing: 1px;">STUDENT REPORT CARD</h2>
            <p style="font-size: 12px; color: #6b7280; margin: 5px 0;">Academic Year: {{academicYear}}</p>
          </div>

          <!-- Student & Exam Info -->
          <div style="display: flex; gap: 20px; margin-bottom: 25px;">
            <div style="flex: 1; background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Student Information</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
                <div><strong>Name:</strong> {{studentName}}</div>
                <div><strong>Roll No:</strong> {{rollNo}}</div>
                <div><strong>Class:</strong> {{className}} - {{section}}</div>
                <div><strong>Father's Name:</strong> {{fatherName}}</div>
                <div><strong>Class Teacher:</strong> {{classTeacher}}</div>
                <div><strong>Date of Birth:</strong> {{dateOfBirth}}</div>
              </div>
            </div>
            <div style="flex: 1; background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Examination Details</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
                <div><strong>Exam:</strong> {{examName}}</div>
                <div><strong>Type:</strong> {{examType}}</div>
                <div><strong>Date:</strong> {{examDate}}</div>
                <div><strong>Subjects:</strong> {{totalSubjects}}</div>
                <div><strong>Attendance:</strong> {{attendance}}</div>
                <div><strong>Rank:</strong> {{rank}}</div>
              </div>
            </div>
          </div>

          <!-- Performance Summary -->
          <div style="display: flex; justify-content: space-between; gap: 15px; margin-bottom: 25px;">
            <div style="flex: 1; text-align: center; padding: 25px; background: #dbeafe; border-radius: 8px; border: 2px solid #3b82f6;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 14px;">TOTAL MARKS</h3>
              <div style="font-size: 36px; font-weight: bold; color: #1e40af; margin: 10px 0;">{{marksObtained}}</div>
              <div style="color: #6b7280; font-size: 12px;">out of {{totalMarks}}</div>
              <div style="margin-top: 10px; padding: 6px; background: #3b82f6; color: white; border-radius: 4px; font-weight: 600; font-size: 14px;">{{percentage}}%</div>
            </div>
            <div style="flex: 1; text-align: center; padding: 25px; background: #dcfce7; border-radius: 8px; border: 2px solid #16a34a;">
              <h3 style="color: #15803d; margin: 0 0 10px 0; font-size: 14px;">GRADE</h3>
              <div style="font-size: 36px; font-weight: bold; color: #15803d; margin: 10px 0;">{{grade}}</div>
              <div style="color: #6b7280; font-size: 12px;">Performance Level</div>
              <div style="margin-top: 10px; padding: 6px; background: #16a34a; color: white; border-radius: 4px; font-weight: 600; font-size: 14px;">{{status}}</div>
            </div>
          </div>

          <!-- Subject-wise Marks -->
          {{subjectMarksTable}}

          <!-- Remarks Section -->
          <div style="background: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
            <h4 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">TEACHER'S REMARKS</h4>
            <p style="color: #78716c; line-height: 1.5; margin: 0; font-size: 13px;">{{remarks}}</p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 2px solid #e5e7eb;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #6b7280;">
              <div>Generated on {{currentDate}}</div>
              <div>{{schoolName}} - Academic Report</div>
              <div>Issue Date: {{issueDate}}</div>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: "elegant-classic",
      name: "Elegant Classic",
      description: "Traditional elegant design optimized for PDF",
      preview:
        "bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300",
      templateContent: `
        <div style="font-family: 'Georgia', serif; width: 210mm; min-height: 297mm; margin: 0; padding: 20mm; background: white; color: #333; box-sizing: border-box;">
          <!-- Elegant Header -->
          <div style="text-align: center; border: 3px solid #d97706; padding: 30px; margin-bottom: 30px; background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);">
            <div style="width: 100px; height: 100px; border: 3px solid #92400e; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; background: white; font-size: 48px;">🏆</div>
            <h1 style="font-size: 32px; color: #92400e; margin: 0; letter-spacing: 3px; font-weight: normal;">ACADEMIC EXCELLENCE</h1>
            <div style="width: 120px; height: 3px; background: #d97706; margin: 20px auto;"></div>
            <p style="font-size: 16px; color: #b45309; margin: 0;">Certificate of Achievement</p>
          </div>

          <!-- Student Information -->
          <div style="text-align: center; margin-bottom: 40px; padding: 30px; background: #fef3c7; border-radius: 15px; border: 2px solid #d97706;">
            <h2 style="font-size: 28px; color: #92400e; margin: 0 0 15px 0; font-weight: 600;">{{studentName}}</h2>
            <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; color: #b45309; font-size: 16px;">
              <div><strong>Roll No:</strong> {{rollNo}}</div>
              <div><strong>Class:</strong> {{className}}</div>
              <div><strong>Exam:</strong> {{examName}}</div>
            </div>
          </div>

          <!-- Performance Section -->
          <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 40px;">
            <div style="text-align: center; padding: 35px; background: white; border: 3px solid #d97706; border-radius: 15px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); flex: 1; max-width: 200px;">
              <h3 style="color: #92400e; margin: 0 0 20px 0; font-size: 18px; letter-spacing: 1px;">MARKS ACHIEVED</h3>
              <div style="font-size: 56px; font-weight: bold; color: #d97706; margin: 20px 0;">{{marksObtained}}</div>
              <div style="color: #b45309; font-size: 16px; margin-bottom: 15px;">out of {{totalMarks}}</div>
              <div style="background: #d97706; color: white; padding: 8px 16px; border-radius: 25px; font-weight: 600;">{{percentage}}%</div>
            </div>
            <div style="text-align: center; padding: 35px; background: white; border: 3px solid #d97706; border-radius: 15px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); flex: 1; max-width: 200px;">
              <h3 style="color: #92400e; margin: 0 0 20px 0; font-size: 18px; letter-spacing: 1px;">GRADE EARNED</h3>
              <div style="font-size: 56px; font-weight: bold; color: #d97706; margin: 20px 0;">{{grade}}</div>
              <div style="color: #b45309; font-size: 16px; margin-bottom: 15px;">Performance Level</div>
              <div style="background: #d97706; color: white; padding: 8px 16px; border-radius: 25px; font-weight: 600;">{{status}}</div>
            </div>
          </div>

          <!-- Remarks -->
          <div style="background: #fef3c7; padding: 30px; border-radius: 15px; border: 2px solid #d97706; margin-bottom: 30px;">
            <h4 style="color: #92400e; margin: 0 0 20px 0; font-size: 20px; text-align: center; letter-spacing: 1px;">TEACHER'S COMMENDATION</h4>
            <p style="font-style: italic; color: #92400e; margin: 0; line-height: 1.8; text-align: center; font-size: 16px;">{{remarks}}</p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 50px; padding-top: 20px; border-top: 3px solid #d97706;">
            <p style="color: #b45309; font-size: 14px; margin: 0;">Issued on {{currentDate}} | Skhool Academic Institution</p>
          </div>
        </div>
      `,
    },
    {
      id: "vibrant-modern",
      name: "Vibrant Modern",
      description: "Colorful and energetic design optimized for PDF",
      preview: "bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400",
      templateContent: `
        <div style="font-family: 'Arial', sans-serif; width: 210mm; min-height: 297mm; margin: 0; padding: 20mm; background: white; color: #333; box-sizing: border-box;">
          <!-- Vibrant Header -->
          <div style="text-align: center; background: linear-gradient(135deg, #ff6b6b, #4ecdc4); padding: 40px; border-radius: 20px; color: white; margin-bottom: 30px;">
            <div style="font-size: 72px; margin-bottom: 20px;">🌟</div>
            <h1 style="font-size: 36px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 2px;">STUDENT REPORT CARD</h1>
            <div style="width: 100px; height: 4px; background: white; margin: 20px auto; border-radius: 2px;"></div>
            <p style="font-size: 18px; margin: 0; opacity: 0.9;">Academic Achievement Certificate</p>
          </div>

          <!-- Student Info -->
          <div style="text-align: center; background: #f8f9ff; padding: 30px; border-radius: 15px; margin-bottom: 30px; border: 3px solid #4ecdc4;">
            <h2 style="font-size: 32px; color: #333; margin: 0 0 15px 0; font-weight: 700;">{{studentName}}</h2>
            <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; font-size: 16px; color: #666;">
              <div style="background: #ff6b6b; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600;"><strong>Roll:</strong> {{rollNo}}</div>
              <div style="background: #4ecdc4; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600;"><strong>Class:</strong> {{className}}</div>
              <div style="background: #45b7d1; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600;"><strong>Exam:</strong> {{examName}}</div>
            </div>
          </div>

          <!-- Performance Cards -->
          <div style="display: flex; justify-content: center; gap: 25px; margin-bottom: 40px;">
            <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #ff9a9e, #fecfef); border-radius: 20px; color: white; flex: 1; max-width: 180px; box-shadow: 0 8px 20px rgba(255,154,158,0.3);">
              <div style="font-size: 48px; margin-bottom: 15px;">📊</div>
              <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">MARKS SCORED</h3>
              <div style="font-size: 36px; font-weight: bold; margin: 15px 0;">{{marksObtained}}</div>
              <div style="font-size: 14px; opacity: 0.9;">out of {{totalMarks}}</div>
              <div style="margin-top: 15px; background: rgba(255,255,255,0.2); padding: 8px; border-radius: 10px; font-weight: 600;">{{percentage}}%</div>
            </div>
            <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #a8edea, #fed6e3); border-radius: 20px; color: #333; flex: 1; max-width: 180px; box-shadow: 0 8px 20px rgba(168,237,234,0.3);">
              <div style="font-size: 48px; margin-bottom: 15px;">🎯</div>
              <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">GRADE EARNED</h3>
              <div style="font-size: 36px; font-weight: bold; margin: 15px 0;">{{grade}}</div>
              <div style="font-size: 14px; color: #666;">Achievement Level</div>
              <div style="margin-top: 15px; background: #4ecdc4; color: white; padding: 8px; border-radius: 10px; font-weight: 600;">{{status}}</div>
            </div>
          </div>

          <!-- Remarks -->
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; border-radius: 20px; color: white; margin-bottom: 30px; text-align: center;">
            <h4 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">TEACHER'S FEEDBACK 📝</h4>
            <p style="font-size: 16px; margin: 0; line-height: 1.6; font-style: italic;">{{remarks}}</p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 3px solid #4ecdc4;">
            <p style="color: #666; font-size: 14px; margin: 0;">Certificate issued on {{currentDate}} | Skhool Educational System</p>
          </div>
        </div>
      `,
    },
    {
      id: "professional-blue",
      name: "Professional Blue",
      description: "Corporate-style design with blue theme",
      preview: "bg-gradient-to-r from-blue-600 to-blue-800",
      templateContent: `
        <div style="font-family: 'Arial', sans-serif; max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 40px; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <div style="width: 60px; height: 60px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px;">
                <span style="font-size: 1.5rem; color: #1e3c72;">🎓</span>
              </div>
              <div>
                <h1 style="font-size: 2rem; margin: 0; font-weight: 300; letter-spacing: 1px;">ACADEMIC PERFORMANCE</h1>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Student Assessment Report</p>
              </div>
            </div>
          </div>
          <div style="padding: 40px;">
            <div style="border-bottom: 2px solid #1e3c72; padding-bottom: 20px; margin-bottom: 30px;">
              <h2 style="font-size: 1.8rem; color: #1e3c72; margin: 0 0 10px 0;">{{studentName}}</h2>
              <div style="display: flex; gap: 30px; color: #666;">
                <span>Roll Number: <strong>{{rollNo}}</strong></span>
                <span>Class: <strong>{{className}}</strong></span>
                <span>Exam: <strong>{{examName}}</strong></span>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
              <div style="padding: 25px; border: 2px solid #1e3c72; border-radius: 8px; text-align: center;">
                <h3 style="color: #1e3c72; margin: 0 0 15px 0; font-size: 1.2rem;">MARKS OBTAINED</h3>
                <div style="font-size: 3rem; font-weight: bold; color: #1e3c72; margin: 10px 0;">{{marksObtained}}</div>
                <div style="color: #666; font-size: 1.1rem;">out of {{totalMarks}}</div>
                <div style="margin-top: 15px; padding: 8px; background: #f0f4f8; border-radius: 4px; color: #1e3c72; font-weight: 600;">
                  {{percentage}}%
                </div>
              </div>
              <div style="padding: 25px; border: 2px solid #1e3c72; border-radius: 8px; text-align: center;">
                <h3 style="color: #1e3c72; margin: 0 0 15px 0; font-size: 1.2rem;">GRADE ACHIEVED</h3>
                <div style="font-size: 3rem; font-weight: bold; color: #1e3c72; margin: 10px 0;">{{grade}}</div>
                <div style="color: #666; font-size: 1.1rem;">Performance Level</div>
                <div style="margin-top: 15px; padding: 8px; background: #f0f4f8; border-radius: 4px; color: #1e3c72; font-weight: 600;">
                  {{status}}
                </div>
              </div>
            </div>
            <div style="padding: 25px; background: #f8f9fa; border-left: 4px solid #1e3c72; border-radius: 0 8px 8px 0;">
              <h4 style="color: #1e3c72; margin: 0 0 15px 0;">TEACHER'S REMARKS</h4>
              <p style="color: #666; line-height: 1.6; margin: 0; font-size: 1.1rem;">{{remarks}}</p>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: "creative-artistic",
      name: "Creative Artistic",
      description: "Artistic design with creative elements",
      preview: "bg-gradient-to-br from-purple-400 via-pink-400 to-red-400",
      templateContent: `
        <div style="font-family: 'Comic Sans MS', cursive; max-width: 800px; margin: 0 auto; background: #fff; position: relative; overflow: hidden; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
          <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: linear-gradient(45deg, #ff6b6b, #feca57); border-radius: 50%; opacity: 0.1;"></div>
          <div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: linear-gradient(45deg, #48dbfb, #0abde3); border-radius: 50%; opacity: 0.1;"></div>
          <div style="padding: 40px; text-align: center; background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c); color: white; position: relative;">
            <div style="background: rgba(255,255,255,0.2); padding: 30px; border-radius: 20px; backdrop-filter: blur(10px);">
              <div style="font-size: 3rem; margin-bottom: 15px;">🎨</div>
              <h1 style="font-size: 2.5rem; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); transform: rotate(-2deg);">CREATIVE REPORT</h1>
              <div style="width: 80px; height: 4px; background: white; margin: 20px auto; border-radius: 2px; transform: rotate(2deg);"></div>
              <h2 style="font-size: 1.8rem; margin: 15px 0 5px 0;">{{studentName}}</h2>
              <p style="opacity: 0.9;">Roll: {{rollNo}} | Class: {{className}}</p>
            </div>
          </div>
          <div style="padding: 40px; position: relative;">
            <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap; gap: 20px;">
              <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #ff9a9e, #fecfef); border-radius: 20px; color: white; transform: rotate(-3deg); box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">🏆</div>
                <h3 style="margin: 0 0 10px 0;">Score</h3>
                <p style="font-size: 2rem; font-weight: bold; margin: 0;">{{marksObtained}}/{{totalMarks}}</p>
              </div>
              <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #a8edea, #fed6e3); border-radius: 20px; color: #333; transform: rotate(2deg); box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">⭐</div>
                <h3 style="margin: 0 0 10px 0;">Grade</h3>
                <p style="font-size: 2rem; font-weight: bold; margin: 0;">{{grade}}</p>
              </div>
              <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #ffecd2, #fcb69f); border-radius: 20px; color: #333; transform: rotate(-1deg); box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">🎯</div>
                <h3 style="margin: 0 0 10px 0;">Status</h3>
                <p style="font-size: 1.5rem; font-weight: bold; margin: 0;">{{status}}</p>
              </div>
            </div>
            <div style="margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 20px; color: white; transform: rotate(1deg);">
              <h4 style="margin: 0 0 15px 0; font-size: 1.3rem; display: flex; align-items: center; justify-content: center;">
                <span style="margin-right: 10px;">💭</span> Creative Feedback
              </h4>
              <p style="font-size: 1.1rem; margin: 0; text-align: center; font-style: italic;">{{remarks}}</p>
            </div>
          </div>
        </div>
      `,
    },
  ];

  // Fetch available templates
  const { data: templates = [] } = useQuery({
    queryKey: ["reportTemplates", "student_report"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/report-templates?type=student_report"
      );
      return response.data as ReportTemplate[];
    },
    enabled: open,
  });

  // Combine sample templates with fetched templates
  const allTemplates = [...sampleTemplates, ...templates];

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

  // Fetch detailed exam results with subject marks for selected students
  const { data: examResults = [] } = useQuery({
    queryKey: ["examResults", exam.id, selectedStudents],
    queryFn: async () => {
      if (selectedStudents.length === 0) return [];
      const response = await axiosInstance.get(
        `/api/exams/${exam.id}/results`,
        {
          params: {
            studentIds: selectedStudents.join(","),
            includeSubjects: true,
          },
        }
      );
      return response.data;
    },
    enabled: selectedStudents.length > 0,
  });

  // Fetch school details
  const { data: schoolDetails } = useQuery({
    queryKey: ["schoolDetails"],
    queryFn: async () => {
      const response = await axiosInstance.get("/admin/org-details");
      return response.data;
    },
  });

  // Fetch class details
  const classDetails = { className: exam.className, section: exam.section };
  // Client-side report generation function
  const generateReportsClientSide = async (isPreview: boolean = false) => {
    setIsGenerating(true);
    try {
      const template =
        sampleTemplates.find((t) => t.id === selectedTemplate) ||
        templates.find((t) => t.id === selectedTemplate);

      if (!template) {
        toast.error("Template not found");
        setIsGenerating(false);
        return;
      }

      const reports = [];

      for (const studentId of selectedStudents) {
        const student = students?.find((s) => s.id === studentId);
        const studentResult = examResults.filter(
          (r) => r.studentId === studentId
        );
        console.log(studentResult);
        if (!student) continue;

        // Calculate grade and status based on marks
        const marksObtained = studentResult?.reduce(
          (total, result) => total + result.marksObtained,
          0
        );
        const totalMarks = studentResult.reduce(
          (total, result) => total + result.totalMarks,
          0
        );
        const percentage = Math.round((marksObtained / totalMarks) * 100);

        let grade = "F";
        let status = "Needs Improvement";

        if (percentage >= 90) {
          grade = "A+";
          status = "Outstanding";
        } else if (percentage >= 80) {
          grade = "A";
          status = "Excellent";
        } else if (percentage >= 70) {
          grade = "B+";
          status = "Very Good";
        } else if (percentage >= 60) {
          grade = "B";
          status = "Good";
        } else if (percentage >= 50) {
          grade = "C";
          status = "Average";
        } else if (percentage >= 40) {
          grade = "D";
          status = "Below Average";
        }

        // Generate subject-wise marks table
        let subjectMarksTable = "";
        if (studentResult && studentResult.length > 0) {
          subjectMarksTable = `
            <div style="margin: 20px 0;">
              <h4 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Subject-wise Performance</h4>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; font-weight: 600; color: #374151;">Subject</th>
                    <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center; font-weight: 600; color: #374151;">Marks Obtained</th>
                    <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center; font-weight: 600; color: #374151;">Total Marks</th>
                    <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center; font-weight: 600; color: #374151;">Grade</th>
                  </tr>
                </thead>
                <tbody>
          `;

          studentResult?.forEach((subject: any) => {
            const subjectPercentage = Math.round(
              (subject.marksObtained / subject.totalMarks) * 100
            );
            let subjectGrade = "F";
            if (subjectPercentage >= 90) subjectGrade = "A+";
            else if (subjectPercentage >= 80) subjectGrade = "A";
            else if (subjectPercentage >= 70) subjectGrade = "B+";
            else if (subjectPercentage >= 60) subjectGrade = "B";
            else if (subjectPercentage >= 50) subjectGrade = "C";
            else if (subjectPercentage >= 40) subjectGrade = "D";

            subjectMarksTable += `
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 12px; color: #374151;">${subject.subjectName}</td>
                <td style="border: 1px solid #d1d5db; padding: 12px; text-align: center; color: #374151; font-weight: 600;">${subject.marksObtained}</td>
                <td style="border: 1px solid #d1d5db; padding: 12px; text-align: center; color: #374151;">${subject.totalMarks}</td>
                <td style="border: 1px solid #d1d5db; padding: 12px; text-align: center; color: #374151; font-weight: 600;">${subjectGrade}</td>
              </tr>
            `;
          });

          subjectMarksTable += `
                </tbody>
              </table>
            </div>
          `;
        }

        // Generate remarks based on performance and subject analysis
        let remarks = studentResult?.teacherRemarks || "";
        if (!remarks) {
          if (percentage >= 90)
            remarks =
              "Outstanding performance! Exceptional work across all areas. Keep up the excellent standards.";
          else if (percentage >= 80)
            remarks =
              "Excellent work! Shows strong understanding and consistent effort. Continue the great work.";
          else if (percentage >= 70)
            remarks =
              "Very good performance. Shows good grasp of concepts with room for minor improvements.";
          else if (percentage >= 60)
            remarks =
              "Good effort shown. Focus on strengthening weak areas for better results.";
          else if (percentage >= 50)
            remarks =
              "Average performance. Needs more focused study and practice to improve.";
          else if (percentage >= 40)
            remarks =
              "Below average performance. Requires significant improvement and additional support.";
          else
            remarks =
              "Needs immediate attention and support. Please consult with teachers for improvement strategies.";
        }

        // Replace template variables with comprehensive data
        const templateData = {
          // School Information
          schoolName: schoolDetails?.name || "Skhool Educational Institution",
          schoolAddress: schoolDetails?.address || "",
          schoolPhone: schoolDetails?.phone || "",
          schoolEmail: schoolDetails?.email || "",
          schoolLogo: schoolDetails?.logoUrl || "",

          // Student Information
          studentName: `${student.firstname} ${student.lastname}`,
          rollNo: student.rollNo || student.id,
          fatherName: student.guardian || "N/A",
          dateOfBirth: student.dateOfBirth
            ? new Date(student.dateOfBirth).toLocaleDateString()
            : "N/A",

          // Class Information
          className: exam.className || "N/A",
          section: classDetails?.section || "A",

          // Exam Information
          examName: exam.name || "Examination",
          examDate: exam.examDate
            ? new Date(exam.examDate).toLocaleDateString()
            : new Date().toLocaleDateString(),
          examType: exam.examType || "Regular",

          // Performance Data
          marksObtained: marksObtained.toString(),
          totalMarks: totalMarks.toString(),
          percentage: percentage.toString(),
          grade,
          status,
          rank: studentResult?.rank || "N/A",

          // Subject Details
          subjectMarksTable,
          totalSubjects: studentResult?.subjectMarks?.length || 0,

          // Additional Information
          remarks,
          attendance: studentResult?.attendance || "N/A",
          currentDate: new Date().toLocaleDateString(),
          issueDate: new Date().toLocaleDateString(),
        };

        let reportContent = template.templateContent;
        Object.entries(templateData).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, "g");
          reportContent = reportContent.replace(regex, value);
        });
        if (isPreview) {
          return reportContent;
        }

        reports.push({
          studentId,
          studentName: templateData.studentName,
          content: reportContent,
          templateName: template.name,
        });
      }

      setGeneratedReports(reports);
      toast.success(`Generated ${reports.length} reports successfully`);
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate reports");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toString().includes(searchTerm.toLowerCase())
  );

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const handlePreview = async () => {
    if (!selectedTemplate || selectedStudents.length === 0) {
      toast.error("Please select a template and at least one student");
      return;
    }

    try {
      // Check if it's a sample template
      const sampleTemplate = sampleTemplates.find(
        (t) => t.id === selectedTemplate
      );

      if (sampleTemplate) {
        // Generate preview data for sample template
        const mockData = {
          studentName: "John Doe",
          rollNo: "2024001",
          className: "Class 10-A",
          examName: exam.name || "Mid-Term Examination",
          examDate: new Date().toLocaleDateString(),
          marksObtained: "85",
          totalMarks: "100",
          percentage: "85",
          grade: "A",
          status: "Excellent",
          remarks:
            "Outstanding performance! Keep up the excellent work and continue to strive for academic excellence.",
          currentDate: new Date().toLocaleDateString(),
        };

        // Replace template variables with mock data
        let previewContent = sampleTemplate.templateContent;
        Object.entries(mockData).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, "g");
          previewContent = previewContent.replace(regex, value);
        });
        const content = await generateReportsClientSide(true);
        setPreviewData({
          content: content,
          templateName: sampleTemplate.name,
          isPDFTemplate: true,
        });
        setShowPreview(true);
      } else {
        // Fetch from API for custom templates
        const response = await axiosInstance.post("/reports/preview", {
          templateId: selectedTemplate,
          studentIds: selectedStudents,
          examId: exam.id,
        });

        setPreviewData(response.data);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Failed to generate preview");
    }
  };

  const handleGenerate = () => {
    if (!selectedTemplate || selectedStudents.length === 0) {
      toast.error("Please select a template and at least one student");
      return;
    }

    generateReportsClientSide();
  };

  const downloadPDF = async (reportData: any, studentName: string) => {
    const element = document.createElement("div");
    element.innerHTML = reportData.content;
    element.style.padding = "20px";
    element.style.fontFamily = "Arial, sans-serif";

    const opt = {
      margin: 1,
      filename: `${exam.name}_${studentName}_Report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
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
      const student = students.find((s) => s.id === report.studentId);
      if (student) {
        await downloadPDF(report, `${student.firstname}_${student.lastname}`);
        // Add delay to prevent overwhelming the browser
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Generate Student Reports
            </h2>
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
              {allTemplates.map((template) => (
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
                      <h3 className="font-medium text-gray-900">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {template.description}
                      </p>
                      {/* {template.isDefault && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full mt-2">
                          Default
                        </span>
                      )} */}
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
                {selectedStudents.length === filteredStudents.length
                  ? "Deselect All"
                  : "Select All"}
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
                const result = examResults.find(
                  (r) => r.studentId === student.id
                );
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
                          {student.firstname} {student.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          Roll: {student.rollNo}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {result ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {result.marksObtained}/{exam.totalMarks}
                          </div>
                          <div
                            className={`text-xs ${
                              result.marksObtained >= exam.passingMarks
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {result.marksObtained >= exam.passingMarks
                              ? "Pass"
                              : "Fail"}
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
                disabled={
                  !selectedTemplate ||
                  selectedStudents.length === 0 ||
                  isGenerating
                }
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                {isGenerating ? "Generating..." : "Generate Reports"}
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
                  const student = students.find(
                    (s) => s.id === report.studentId
                  );
                  return (
                    <div
                      key={index}
                      className="bg-white border border-green-200 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {student?.firstname} {student?.lastname}
                          </div>
                          <div className="text-sm text-gray-500">
                            Roll: {student?.rollNo}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            downloadPDF(
                              report,
                              `${student?.firstname}_${student?.lastname}`
                            )
                          }
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

      {/* Enhanced Preview Modal for PDF Templates */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[95vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  PDF Template Preview
                </h3>
                <p className="text-sm text-gray-600">
                  {previewData.templateName || "Report Template"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {previewData.isPDFTemplate && (
                  <button
                    onClick={async () => {
                      const element = previewRef.current;
                      if (element) {
                        const html2pdf = (await import("html2pdf.js")).default;
                        const opt = {
                          margin: 0,
                          filename: `${
                            previewData.templateName || "report"
                          }_preview.pdf`,
                          image: { type: "jpeg", quality: 0.98 },
                          html2canvas: { scale: 2, useCORS: true },
                          jsPDF: {
                            unit: "mm",
                            format: "a4",
                            orientation: "portrait",
                          },
                        };
                        html2pdf().set(opt).from(element).save();
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                )}
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(95vh-120px)] bg-gray-100">
              <div
                className="bg-white rounded-lg shadow-lg mx-auto"
                style={{ maxWidth: "210mm" }}
              >
                <div
                  ref={previewRef}
                  dangerouslySetInnerHTML={{ __html: previewData.content }}
                  className="pdf-preview"
                  style={{
                    transform: "scale(0.8)",
                    transformOrigin: "top center",
                    margin: "0 auto",
                  }}
                />
              </div>
              {previewData.isPDFTemplate && (
                <div className="text-center mt-4 text-sm text-gray-600">
                  <p>
                    📄 This template is optimized for PDF export with A4 page
                    dimensions
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
