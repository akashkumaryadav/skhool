// components/TeacherFormModal.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Teacher } from "../types/types";
import { XMarkIcon } from "../constants";

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: TeacherData) => void;
  teacherToEdit?: TeacherData | null;
}

type TeacherData = Partial<Teacher>
const initialFormData: TeacherData = {
  firstname: "",
  lastname: "",
  qualification: "",
  dateOfJoining: "",
  contact: "",
  personalEmail: "",
  organizationEmail: "",
  gender: "",
  id: 0,
};

const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teacherToEdit,
}) => {
  const [formData, setFormData] = useState<TeacherData>(initialFormData);
  const modalRef = useRef<HTMLDivElement>(null);
  const isEditing = !!teacherToEdit;

  useEffect(() => {
    if (teacherToEdit) {
      setFormData(teacherToEdit);
    } else {
      setFormData(initialFormData);
    }
  }, [teacherToEdit, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeacherData: TeacherData = {
      ...formData,
    };
    onSave(newTeacherData);
    onClose();
  };

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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  const inputStyle =
    "mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm";

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-scale-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-form-title"
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="teacher-form-title"
            className="text-2xl font-bold text-gray-800"
          >
            {isEditing ? "Edit Teacher" : "Add New Teacher"}
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
            {/* Personal Details */}
            <h3 className="md:col-span-2 text-lg font-medium text-gray-700 border-b pb-2 mb-2">
              Personal Details
            </h3>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstname}
                onChange={handleInputChange}
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastname}
                onChange={handleInputChange}
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                name="personalEmail"
                id="email"
                value={formData.personalEmail}
                onChange={handleInputChange}
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                id="contactNumber"
                value={formData.contact}
                onChange={handleInputChange}
                required
                className={inputStyle}
              />
            </div>

            {/* Professional Details */}
            <h3 className="md:col-span-2 text-lg font-medium text-gray-700 border-b pb-2 mb-2 mt-4">
              Professional Details
            </h3>
            <div>
              <label
                htmlFor="employeeId"
                className="block text-sm font-medium text-gray-700"
              >
                Employee ID
              </label>
              <input
                type="text"
                name="organizationEmail"
                id="organizationEmail"
                value={formData.organizationEmail}
                onChange={handleInputChange}
                placeholder="e.g., EMP123"
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label
                htmlFor="dateOfJoining"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Joining
              </label>
              <input
                type="date"
                name="dateOfJoining"
                id="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleInputChange}
                required
                className={inputStyle}
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="qualification"
                className="block text-sm font-medium text-gray-700"
              >
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                id="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                required
                placeholder="e.g., M.Sc. in Physics, B.Ed."
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
            {isEditing ? "Save Changes" : "Add Teacher"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherFormModal;
