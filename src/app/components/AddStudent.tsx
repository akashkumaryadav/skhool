/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Student } from "../types/types";
import { Button, Drawer, Input, Select } from "antd";
import FileUploader from "@/app/components/common/FileUploader";
import TextArea from "antd/es/input/TextArea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";

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

const AddStudent = ({ bulkUpload, open, onClose }) => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState<Partial<Student>>(initialFormData);
  const [uploading, setUploading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      return (await axiosInstance.get("/class/")).data;
    },
    placeholderData: [],
  });

  const createStudent = useMutation({
    mutationFn: (student: Partial<Student>) =>
      axiosInstance.post("/student/", student).then((res) => res.data),
    onSuccess: () => {
      // Invalidate or refetch relevant queries after a successful mutation
      queryClient.invalidateQueries(["students"]);
    },
  });

  const handleSave = () => {
    onClose();
    console.log({ formData });
    createStudent.mutate(formData);
    setFormData(initialFormData);
  };

  const getFooter = () => {
    return (
      <div className="flex justify-between float-right gap-x-2">
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <button
          className="bg-blue-500 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm hover:bg-blue-700"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    );
  };

  const handleFilesChange = (file) => {
    setFiles(file);
  };

  const handleError = (err) => {};

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? parseInt(value, 10) : value,
    }));
  };

  const downloadTemplate = async () => {
    try {
      const response: any = await axiosInstance.get(
        "/student/bulk/sample-template"
      );

      // Create blob and download
      const blob = new Blob([response.data], { type: response.contentType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "template.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = async (files) => {
    console.log({ files });
    const formData = new FormData();
    formData.append("file", files[0].file);
    const res = await axiosInstance.post("/student/bulk", formData, {
      headers: { "Content-type": "Multipart/form-data" },
    });
    console.log(res.data);
    queryClient.invalidateQueries(["students"]);
    setFiles([]);
  };

  const renderDrawerContent = () => {
    return bulkUpload ? (
      <div>
        <FileUploader
          multiple={false}
          maxSize={10 * 1024 * 1024} // 5MB
          acceptedTypes={[
            "image/*",
            "application/pdf",
            ".doc",
            ".docx",
            ".txt",
            ".csv",
          ]}
          onFilesChange={handleFilesChange}
          onError={handleError}
          theme="light"
          showPreview={true}
          disabled={false}
          handleDownload={downloadTemplate}
          onUploadClick={handleUpload}
          uploading={uploading}
          files={files}
        />
      </div>
    ) : (
      <div className="bg-white w-full flex flex-col">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex-1 overflow-y-auto p-2"
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
              <Input
                type="text"
                name="firstname"
                id="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <Input
                type="text"
                name="lastname"
                id="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="organizationEmal"
                className="block text-sm font-medium text-gray-700"
              >
                Organization email
              </label>
              <Input
                type="text"
                name="organizationEmal"
                id="organizationEmal"
                value={formData.organizationEmail}
                onChange={(e) => {
                  handleInputChange(e);
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }));
                }}
                required
              />
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <Input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <Select
                id="gender"
                value={formData.gender}
                options={[
                  { value: "M", label: "Male" },
                  { value: "F", label: "Female" },
                  { value: "O", label: "Other" },
                ]}
                className="w-full"
                onChange={(value) =>
                  handleInputChange({
                    target: { value, name: "gender" },
                  } as any)
                }
              />
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700"
              >
                Contact
              </label>
              <Input
                type="tel"
                name="contact"
                id="contact"
                value={formData.contact}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <TextArea
                name="address"
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="admissionDate"
                className="block text-sm font-medium text-gray-700"
              >
                Admission Date
              </label>
              <Input
                type="date"
                name="admissionDate"
                id="admissionDate"
                value={formData.admissionDate}
                onChange={handleInputChange}
                required
              />
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
              <Select
                id="class"
                value={formData.className}
                options={classes?.map((c) => ({
                  label: c.className,
                  value: c.className,
                }))}
                className="w-full"
                onChange={(value) =>
                  handleInputChange({
                    target: { value, name: "className" },
                  } as any)
                }
              />
            </div>
            <div>
              <label
                htmlFor="section"
                className="block text-sm font-medium text-gray-700"
              >
                Section
              </label>
              <Select
                id="section"
                value={formData.section}
                className="w-full"
                options={[
                  {
                    label: "A",
                    value: "A",
                  },
                  {
                    label: "B",
                    value: "B",
                  },
                  {
                    label: "C",
                    value: "C",
                  },
                ]}
                onChange={(value) =>
                  handleInputChange({
                    target: { value, name: "section" },
                  } as any)
                }
              />
            </div>
            <div>
              <label
                htmlFor="rollNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Roll Number
              </label>
              <Input
                type="number"
                name="rollNo"
                id="rollNumber"
                value={formData.rollNo}
                onChange={handleInputChange}
                required
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
              <Input
                type="text"
                name="guardian"
                id="guardian"
                value={formData.guardian}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="guardianContact"
                className="block text-sm font-medium text-gray-700"
              >
                Parent&apos;s Contact
              </label>
              <Input
                type="text"
                name="guardianContact"
                id="guardianContact"
                value={formData.guardianContact}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <Drawer
      open={open}
      title="Add Student"
      onClose={onClose}
      footer={getFooter()}
      width="50%"
    >
      {renderDrawerContent()}
    </Drawer>
  );
};

export default AddStudent;
