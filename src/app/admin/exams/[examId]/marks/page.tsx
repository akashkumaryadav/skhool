"use client";
import React from "react";
import { useParams } from "next/navigation";
import { MarksUpload } from "../../../../components/exams/MarksUpload";

const ExamMarksPage: React.FC = () => {
  const params = useParams();
  const examId = params.examId as string;

  const handleClose = () => {
    window.history.back();
  };

  const handleSuccess = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MarksUpload
        examId={examId}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ExamMarksPage;
