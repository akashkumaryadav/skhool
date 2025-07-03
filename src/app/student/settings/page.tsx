// app/student/settings/page.tsx
"use client";

import React, { useState } from "react";
import DashboardCard from "../../components/DashboardCard";
import {
  UserCircleIcon,
  BellAlertIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "../../constants";
import { User } from "../../types/types";
import Image from "next/image";

// Mock student data since AuthContext is removed
const mockStudentUser: User = {
  firstname: "Demo Student",
  profilePic: "https://picsum.photos/seed/demostudent/100/100",
  role: "Student",
};
const mockStudentEmail = "student.demo@skhool.co.in";
const mockStudentClass = "7th";
const mockStudentSection = "B";

interface ToggleSwitchProps {
  id: string;
  label: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  description?: string;
}

const ToggleSwitch = ({
  id,
  label,
  enabled,
  setEnabled,
  description,
}: ToggleSwitchProps): React.ReactNode => {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        id={id}
        onClick={() => setEnabled(!enabled)}
        className={`${
          enabled ? "bg-skhool-blue-600" : "bg-gray-200"
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 focus:ring-offset-2`}
        role="switch"
        aria-checked={enabled}
        aria-labelledby={`${id}-label`}
      >
        <span className="sr-only">Use setting</span>
        <span id={`${id}-label`} className="hidden">
          {label}
        </span>
        <span
          aria-hidden="true"
          className={`${
            enabled ? "translate-x-5" : "translate-x-0"
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

const StudentSettingsPage = (): React.ReactNode => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-12">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center md:justify-start">
          <Cog6ToothIcon
            className="w-8 h-8 mr-3 text-skhool-blue-700"
            aria-hidden="true"
          />
          My Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your Skhool account preferences.
        </p>
      </div>

      {/* Profile Section */}
      <DashboardCard
        title="My Profile"
        icon={<UserCircleIcon className="w-7 h-7 text-skhool-blue-600" />}
      >
        <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <Image
            width={64}
            height={64}
            src={
              mockStudentUser.profilePic ||
              "https://picsum.photos/seed/default-avatar/100/100"
            }
            alt={`${mockStudentUser.firstname}'s avatar`}
            className="w-16 h-16 rounded-full object-cover shadow-md"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {mockStudentUser.firstname}
            </h3>
            <p className="text-sm text-gray-600">{mockStudentEmail}</p>
            <p className="text-xs text-skhool-orange-500 font-medium mt-0.5">
              Role: {mockStudentUser.role} | Class: {mockStudentClass}-
              {mockStudentSection}
            </p>
          </div>
        </div>
        <button
          onClick={() => alert("Edit Profile functionality coming soon!")}
          className="flex items-center text-sm font-medium text-skhool-blue-600 hover:text-skhool-blue-800 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 rounded-md p-2 w-full justify-start hover:bg-gray-100"
        >
          <PencilIcon className="h-5 w-5 mr-3 text-gray-500" />
          Edit Profile (e.g., Avatar)
        </button>
        <div className="border-t border-gray-200 my-2"></div>
        <button
          onClick={() => alert("Change Password functionality coming soon!")}
          className="flex items-center text-sm font-medium text-skhool-blue-600 hover:text-skhool-blue-800 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 rounded-md p-2 w-full justify-start hover:bg-gray-100"
        >
          <ShieldCheckIcon className="h-5 w-5 mr-3 text-gray-500" />
          Change Password
        </button>
      </DashboardCard>

      {/* Notification Preferences Section */}
      <DashboardCard
        title="Notification Preferences"
        icon={<BellAlertIcon className="w-7 h-7 text-skhool-orange-500" />}
      >
        <ToggleSwitch
          id="student-email-notifications"
          label="Email Notifications for Grades & Announcements"
          description="Receive updates about new grades and important announcements via email."
          enabled={emailNotifications}
          setEnabled={setEmailNotifications}
        />
      </DashboardCard>

      {/* App Preferences Section */}
      <DashboardCard
        title="Application Preferences"
        icon={<PaintBrushIcon className="w-7 h-7 text-purple-600" />}
      >
        <ToggleSwitch
          id="student-dark-mode"
          label="Dark Mode (Placeholder)"
          description="Enable dark theme for the application."
          enabled={darkMode}
          setEnabled={setDarkMode}
        />
      </DashboardCard>

      <div className="text-center text-xs text-gray-400 py-4">
        Skhool Student Portal v1.0.0 (Demo)
      </div>
    </div>
  );
};

export default StudentSettingsPage;
