"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { User, Teacher } from "../types/types";
import { XMarkIcon, PencilIcon } from "../constants";

interface EditProfileModalProps {
  user?: User | Teacher;
  onClose: () => void;
  onSave: (updatedUser: User | Teacher) => void;
  fields: Array<Record<string, any>>; // Optional prop to pass additional fields if needed
  showAvatar?: boolean; // Optional prop to control avatar display
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  onClose,
  onSave,
  fields,
  showAvatar,
}) => {
  const [formData, setFormData] = useState<User | Teacher | undefined | any>(user);
  const [isDirty, setIsDirty] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the form is dirty by comparing initial state with current state
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(user);
    setIsDirty(hasChanged);
  }, [formData, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...(prevData || {}),
      [name]: value,
    }));
  };

  const handleSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      subjects: value.split(",").map((s) => s.trim()),
    }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any) ;
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
    document.addEventListener("keydown", handleKeyDown);
    // Set focus to the modal container when it opens
    modalRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="edit-profile-title"
            className="text-2xl font-bold text-gray-800"
          >
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500"
            aria-label="Close dialog"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSaveChanges} className="flex-1 overflow-y-auto">
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Profile Picture */}
            {showAvatar && (
              <div className="md:col-span-1 flex flex-col items-center text-center space-y-4">
                <div className="relative inline-block">
                  <img
                    className="h-32 w-32 rounded-full mx-auto shadow-lg object-cover"
                    src={formData.profilePic}
                    alt={`${formData.name}'s profile picture`}
                  />
                  <button
                    type="button"
                    onClick={() => alert("This would open a file picker.")}
                    className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5 text-skhool-blue-600" />
                    <span className="sr-only">Change photo</span>
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    {formData?.name}
                  </h3>
                  <p className="text-sm text-gray-500">{formData.role}</p>
                </div>
              </div>
            )}

            {/* Right Column - User Details */}
            <div className={showAvatar?"md:col-span-2 space-y-5":'md:col-span-3 space-y-5'}>
              {fields &&
                fields
                  .filter((f) => !f.hidden)
                  .map((field, index) => (
                    <div key={index}>
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          name={field.name}
                          id={field.name}
                          value={formData?.[field.name] || ""}
                          onChange={handleInputChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
                          rows={3}
                        />
                      ) : (
                        <input
                          type={field.type || "text"}
                          name={field.name}
                          id={field.name}
                          value={formData?.[field.name] || ""}
                          onChange={handleInputChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
                        />
                      )}
                    </div>
                  ))}

              {/* Subjects */}

              {/* <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
                  />
                </div> */}
            </div>
          </div>

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
              disabled={!isDirty}
              className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-skhool-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skhool-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-skhool-blue-400"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
