import React, { useState } from "react";
import Modal from "@/app/components/common/Modal";

interface AddNewGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddNewGradeModal: React.FC<AddNewGradeModalProps> = ({ isOpen, onClose }) => {
  const [gradeData, setGradeData] = useState({
    studentName: "",
    subject: "",
    marks: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGradeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Logic to submit grade data
    console.log("Grade Data Submitted:", gradeData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Add New Grade</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Name</label>
            <input
              type="text"
              name="studentName"
              value={gradeData.studentName}
              onChange={handleInputChange}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              value={gradeData.subject}
              onChange={handleInputChange}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Marks</label>
            <input
              type="number"
              name="marks"
              value={gradeData.marks}
              onChange={handleInputChange}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-skhool-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddNewGradeModal;