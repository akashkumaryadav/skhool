// components/DeleteConfirmationModal.tsx
"use client";

import React, { useEffect, useCallback, useRef } from 'react';
import { BellIcon } from '../constants';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType?: string; // e.g., 'student', 'teacher'
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemName, itemType = 'item' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
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
      aria-labelledby="delete-confirmation-title"
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <BellIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="mt-3">
                <h3 id="delete-confirmation-title" className="text-lg font-semibold leading-6 text-gray-900">
                    Delete {itemType}
                </h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete <span className="font-bold">{itemName}</span>? This action cannot be undone.
                    </p>
                </div>
            </div>
        </div>
        <div className="flex justify-end gap-4 px-6 py-4 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skhool-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
