import React from "react";
import CustomDrawer from "./common/Drawer";

const CreateAssignment = ({ open, onClose, onSave, classData }) => {
  const [assignmentData, setAssignmentData] = React.useState({
    title: "",
    description: "",
    dueDate: "",
    classId: "",
    section: "",
    subjectId: "",
  });

  console.log({ classData });
  const uniqueClassData = Array.from(
    new Set(
      classData?.map((cls) =>
        cls.classid
          .toString()
          .concat("-", cls.subjectid)
          .concat("-", cls.section)
      )
    )
  ).map((id) =>
    classData.find(
      (cls) =>
        cls.classid
          .toString()
          .concat("-", cls.subjectid)
          .concat("-", cls.section) === id
    )
  );
  console.log({ uniqueClassData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //validate form data
    if (
      !assignmentData.title ||
      !assignmentData.description ||
      !assignmentData.dueDate ||
      !assignmentData.classId ||
      !assignmentData.section ||
      !assignmentData.subjectId
    ) {
      alert("Please fill all fields");
    }
    //call onSave function passed as prop
    onSave(assignmentData);
    //reset form data
    setAssignmentData({
      title: "",
      description: "",
      dueDate: "",
      classId: "",
      section: "",
      subjectId: "",
    });
  };

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      header="Create Assignment"
      enableCloseButton
      enableHeader
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">
            Title
            <input
              type="text"
              name="title"
              value={assignmentData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </label>
        </div>
        <div>
          <label className="block">
            Description
            <textarea
              name="description"
              value={assignmentData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </label>
        </div>
        <div>
          <label className="block">
            Due Date
            <input
              type="date"
              name="dueDate"
              value={assignmentData.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </label>
        </div>
        <div>
          <label className="block">
            Class
            <select
              name="classId"
              value={assignmentData.classId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Subject</option>
              {uniqueClassData.map((cls) => (
                <option key={cls.classid} value={cls.classid}>
                  {cls.classname}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className="block">
            Section
            <select
              name="section"
              value={assignmentData.section}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Section</option>
              {new Array(
                uniqueClassData.find(
                  (cls) => cls.classid === assignmentData.classId
                )?.sections || 3
              )
                .fill(0)
                .map((_, index) => (
                  <option
                    key={String.fromCharCode(65 + index)}
                    value={String.fromCharCode(65 + index)}
                  >
                    {String.fromCharCode(65 + index)}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <div>
          <label className="block">
            Subject
            <select
              name="subjectId"
              value={assignmentData.subjectId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Subject</option>
              {uniqueClassData
                .filter((cls) => cls.classid === assignmentData.classId)
                .map((cls) => (
                  <option key={cls.subjectid} value={cls.subjectid}>
                    {cls.subjectname}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md px-4 py-2"
          >
            Create Assignment
          </button>
        </div>
      </form>
    </CustomDrawer>
  );
};

export default CreateAssignment;
