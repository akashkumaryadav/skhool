"use client";
import React from "react";
import Modal from "@/app/components/common/Modal";

const AddGradeModalPage: React.FC = () => {
  console.log("AddGradeModalPage rendered");
  return (
    <Modal isOpen={true} onClose={() => window.history.back()}>
      <h2 className="text-xl font-semibold mb-2">Add New Grade</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="studentName">
            Student
          </label>
          <input
            type="text"
            id="studentName"
            className="w-full px-3 py-2 border rounded"
            placeholder="Search by name..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="class">
            Select Class
          </label>
          <select id="class" className="w-full px-3 py-2 border rounded">
            <option value="">Select Class</option>
            {/* Add class options here */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="section">
            Select Section
          </label>
          <select id="section" className="w-full px-3 py-2 border rounded">
            <option value="">Select Section</option>
            {/* Add section options here */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="examType">
            Select Exam Type
          </label>
          <select id="examType" className="w-full px-3 py-2 border rounded">
            <option value="">Select Exam Type</option>
            {/* Add exam type options here */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="gradeName">
            Grade Name
          </label>
          <input
            type="text"
            id="gradeName"
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter grade name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="gradeDescription">
            Description
          </label>
          <textarea
            id="gradeDescription"
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter grade description"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddGradeModalPage;