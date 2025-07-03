// components/StudentFormModal.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Student } from "../types/types";
import { XMarkIcon } from "../constants";

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Partial<Student>) => void;
  studentToEdit?: Partial<Student> | null;
}

const initialFormData: Partial<Student> = {
  firstname: "",
  lastname: "",
  className: "6th",
  section: "A",
  rollNo: 0,
  gender: "Male",
  dateOfBirth: "",
  guardian: "",
  guardianContact: "",
  studentId: "",
  stream: "Science",
  bio: "",
};

const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
}) => {
  const [formData, setFormData] = useState<Partial<Student>>(initialFormData);
  const modalRef = useRef<HTMLDivElement>(null);
  const isEditing = !!studentToEdit;
  const inputStyle =
    "mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm";

  useEffect(() => {
    if (studentToEdit) {
      setFormData(studentToEdit);
    } else {
      setFormData(initialFormData);
    }
  }, [studentToEdit, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? parseInt(value, 10) : value,
    }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudentData: Partial<Student> = {
      ...formData,
    };
    onSave(newStudentData);
    onClose();
  };

  // Close on Escape key press
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      modalRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-scale-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-form-title"
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="student-form-title"
            className="text-2xl font-bold text-gray-800"
          >
            {isEditing ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500"
            aria-label="Close dialog"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSaveChanges}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Student Details */}
            <h3 className="md:col-span-2 text-lg font-medium text-gray-700 border-b pb-2 mb-2">
              Student Details
            </h3>
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label
                htmlFor="studentId"
                className="block text-sm font-medium text-gray-700"
              >
                Student ID No.
              </label>
              <input
                type="text"
                name="studentId"
                id="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="e.g., SKL123"
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={inputStyle}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Academic Details */}
            <h3 className="md:col-span-2 text-lg font-medium text-gray-700 border-b pb-2 mb-2 mt-4">
              Academic Details
            </h3>
            <div>
              <label
                htmlFor="class"
                className="block text-sm font-medium text-gray-700"
              >
                Class
              </label>
              <select
                name="class"
                id="class"
                value={formData.className}
                onChange={handleInputChange}
                className={inputStyle}
              >
                <option>6th</option>
                <option>7th</option>
                <option>8th</option>
                <option>9th</option>
                <option>10th</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="section"
                className="block text-sm font-medium text-gray-700"
              >
                Section
              </label>
              <select
                name="section"
                id="section"
                value={formData.section}
                onChange={handleInputChange}
                className={inputStyle}
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="rollNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Roll Number
              </label>
              <input
                type="number"
                name="rollNumber"
                id="rollNumber"
                value={formData.rollNo}
                onChange={handleInputChange}
                required
                className={inputStyle}
              />
            </div>

            {/* Parent Details */}
            <h3 className="md:col-span-2 text-lg font-medium text-gray-700 border-b pb-2 mb-2 mt-4">
              Parent/Guardian Details
            </h3>
            <div>
              <label
                htmlFor="guardian"
                className="block text-sm font-medium text-gray-700"
              >
                Parent&apos;s Name
              </label>
              <input
                type="text"
                name="guardian"
                id="guardian"
                value={formData.guardian}
                onChange={handleInputChange}
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label
                htmlFor="guardianContact"
                className="block text-sm font-medium text-gray-700"
              >
                Parent&apos;s Contact (Phone/Email)
              </label>
              <input
                type="text"
                name="guardianContact"
                id="guardianContact"
                value={formData.guardianContact}
                onChange={handleInputChange}
                required
                className={inputStyle}
              />
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skhool-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSaveChanges}
            className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-skhool-blue-600 hover:bg-skhool-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skhool-blue-500"
          >
            {isEditing ? "Save Changes" : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFormModal;
