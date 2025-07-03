import React from 'react'; // Added to resolve React namespace error

export interface User {
    firstname: string;
    lastname?: string;
    profilePic?: string;
    role: string;
}

export interface ChartDataPoint {
    name: string;
    value: number;
}

export interface AnnouncementItem {
    id: string;
    title: string;
    date: string;
    summary: string;
}

export interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType; // For SVG components
    current?: boolean; // This will be set dynamically in Sidebar.tsx
    type?: 'teacher' | 'student' | 'admin'; // Optional type to differentiate between teacher and student views
}

export enum AttendanceStatus {
    PRESENT = "PRESENT",
    ABSENT = "ABSENT",
    LATE = "LATE",
    NOT_MARKED = "NOT_MARKED", // For cases where attendance hasn't been taken yet
}

export interface StudentAttendance {
    id: string;
    name: string;
    status: AttendanceStatus;
}

export interface Student {
    id: string; // Unique DB id or internal app id
    studentId: string; // School-assigned display ID (e.g., SKL001)
    firstname: string;
    lastname: string;
    profilePic?: string;
    stream: string; // e.g., "Science", "Commerce", "Arts"
    bio: string; // Short bio or description
    className: string; // e.g., "6th", "10th"
    section: string; // e.g., "A", "B"
    rollNo: number;
    gender: 'Male' | 'Female' | 'Other';
    dateOfBirth: string; // Format: YYYY-MM-DD
    guardian: string;
    guardianContact: string; // Can be phone or email
    attendancePercentage?: number; // Optional: overall attendance
    overallGrade?: string; // Optional: overall academic grade (e.g., "A+", "B")
    organizationEmail?: string; // Optional: school email for official communication
    address?: string; // Optional: home address for contact
    extraCurricular?: string[]; // Optional: list of extracurricular activities
    organization?: string; // Optional: if linked to a specific school or organization
}

export interface StudentForAttendance extends Student {
    firstname: string;
    lastname: string; // Unique key for react-spring list animations
    studentId: string; // Unique DB id or internal app id
    rollNo: number; // Roll number for attendance marking
    className: string; // e.g., "6th", "10th"
    section: string; // e.g., "A", "B"
    present:boolean; // Whether the student is present today
    status?: AttendanceStatus; // Optional: status for today's attendance
}

// Types for Grades/Performance Page
export interface SubjectGrade {
    marksObtained: number;
    totalMarks: number;
    percentage: number;
    gradeLetter?: string; // e.g., A, B, C - can be derived or stored
}

export interface StudentPerformanceSummary extends Student {
    key: string; // Unique key for lists/animations
    examGrades: {
        [subject: string]: SubjectGrade; // Key is subject name e.g., "Maths"
    };
    overallExamPercentage: number; // Overall percentage for that specific exam
    overallExamGradeLetter: string; // Overall grade for that specific exam
}

export interface StudentComprehensiveGrades extends Student {
    studentName: string; // Full name for display
    performance: {
        [examType: string]: { // e.g., "Mid-Term 1", "Final Exam"
            [subject: string]: SubjectGrade; // e.g., "Maths", "Science"
        }
    }
}

// Types for Learning Resources Page
export enum ResourceType {
    PDF = "PDF",
    VIDEO = "Video",
    LINK = "Link",
    DOCUMENT = "Document", // e.g. .doc, .docx
    WORKSHEET = "Worksheet",
    IMAGE = "Image",
    AUDIO = "Audio",
    OTHER = "Other",
}

export interface LearningResource {
    id: string;
    key: string; // for list rendering
    title: string;
    description: string;
    type: ResourceType;
    subject: string; // e.g., "Maths", "Science", "General"
    classApplicable: string[]; // e.g., ["6th", "7th"], or ["All"]
    uploadDate: string; // Format: YYYY-MM-DD
    uploaderName: string; // Teacher's name
    fileUrl?: string; // URL for direct download/access if applicable
    externalLink?: string; // URL for external resources like YouTube videos, websites
    thumbnailUrl?: string; // Optional image preview
    tags?: string[]; // Optional tags for better searchability
}

// Types for AI Helper Page
export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai' | 'system'; // 'system' for errors or info messages
    timestamp: Date;
    isLoading?: boolean; // For AI message while generating
    error?: string; // If there was an error generating this AI message
    relatedPrompts?: { title: string; prompt: string }[]; // Optional related prompts
}
// export interface Student {
//   id: string; // Unique DB id or internal app id
//   studentIdNo: string; // School-assigned display ID (e.g., SKL001)
//   firstName: string;
//   lastName: string;
//   avatarUrl?: string;
//   class: string; // e.g., "6th", "10th"
//   section: string; // e.g., "A", "B"
//   rollNumber: number;
//   gender: 'Male' | 'Female' | 'Other';
//   dateOfBirth: string; // Format: YYYY-MM-DD
//   parentName: string;
//   parentContact: string; // Can be phone or email
//   attendancePercentage?: number; // Optional: overall attendance
//   overallGrade?: string; // Optional: overall academic grade (e.g., "A+", "B")
// }

// Types for Grades/Performance Page
export interface SubjectGrade {
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  gradeLetter?: string; // e.g., A, B, C - can be derived or stored
}

export interface StudentPerformanceSummary extends Student {
  studentName: string; // Full name for display
  key: string; // Unique key for lists/animations
  examGrades: {
    [subject: string]: SubjectGrade; // Key is subject name e.g., "Maths"
  };
  overallPercentage: number; // Overall percentage for that specific exam
  overallGradeLetter: string; // Overall grade for that specific exam
  totalObtainedMarks: number; // Total marks obtained across all subjects
  overAllMarks: number; // Total marks across all subjects

}

// Student Specific Types
export interface StudentCourse {
  id: string;
  subjectName: string;
  teacherName: string;
  syllabusOverview?: string; // Brief overview or link to full syllabus
  nextClassTopic?: string;
  recentActivity?: string; // e.g., "New assignment posted", "Grade updated"
  thumbnailUrl?: string; // Optional image for the course card
}

export interface Teacher{
    "id": number;
    "firstname": string;
    "lastname": string;
    "username": string;
    "organization": number; // Organization ID
    "category": string;
    "qualification": string;
    "bio": string;
    "profilePic": string;
    "contact": string;
    "organizationEmail": string;
    "personalEmail": string;
    "gender": string;
    role?: string; // e.g., "Teacher", "Admin"
    dateOfJoining: string; // Format: YYYY-MM-DD
}