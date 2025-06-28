// app/settings/page.tsx
"use client";

import React, { useState } from "react";
import DashboardCard from "../../components/DashboardCard"; // Reusing DashboardCard for section styling
import {
  UserCircleIcon,
  BellAlertIcon,
  PaintBrushIcon,
  ArrowDownTrayIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@/app/components/icons";
import { Teacher } from "@/app/types/types";
import EditProfileModal from "@/app/components/EditProfileModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Mock current user data (can be fetched from context or API in a real app)
// const currentUser: User = {
//   name: "Mrs. Sharma",
//   avatarUrl: "https://picsum.photos/seed/teacher1/100/100",
//   role: "Teacher",
// };
// const userEmail = "mrs.sharma@skhool.co.in"; // Mock email

interface ToggleSwitchProps {
  id: string;
  label: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  label,
  enabled,
  setEnabled,
  description,
}) => {
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

interface SettingsItemProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
  actionIcon?: React.ElementType;
}

const SettingsListItem: React.FC<SettingsItemProps> = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  actionIcon: ActionIcon,
}) => {
  const commonButtonClasses =
    "flex items-center text-sm font-medium text-skhool-blue-600 hover:text-skhool-blue-800 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 rounded-md p-1 -m-1";
  const content = (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <Icon
          className="h-6 w-6 text-gray-500 mr-4 flex-shrink-0"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-medium text-gray-800">{title}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <button
          onClick={action}
          className={commonButtonClasses}
          aria-label={actionLabel || title}
        >
          {actionLabel && (
            <span className="mr-1 hidden sm:inline">{actionLabel}</span>
          )}
          {ActionIcon ? (
            <ActionIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );

  // If action exists, make the whole list item clickable for better UX
  if (action) {
    return (
      <button
        onClick={action}
        className="w-full text-left cursor-pointer hover:bg-gray-50 px-2 -mx-2 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-inset focus:ring-skhool-blue-300"
        aria-label={title}
      >
        {content}
      </button>
    );
  }
  return <div className="px-2">{content}</div>;
};

const SettingsPage: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppReminders, setInAppReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [interfaceDensity, setInterfaceDensity] = useState("default");
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const queryClient = useQueryClient();

  //get user data from reactquery that is already fetched and stored against userData key
  const { data: currentUser } = useQuery<Teacher>({
    queryKey: ["userData"],
  });

  console.log("Current User Data:", currentUser);

  const updateProfile = async (updatedData: Partial<Teacher>) => {
    // This function would handle the profile update logic
    console.log("Updated Profile Data:", updatedData);
    // Here you would typically send the updated data to your API
    setOpenEditDialog(false); // Close the dialog after saving
    await axios
      .put(`/api/teacher/${currentUser?.id}`, updatedData)
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        // Optionally, you can update the currentUser state here if needed
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        // Handle error (e.g., show a notification)
      });
      // inavalidate the userData query to refetch the updated data
    await queryClient.invalidateQueries(["userData"]);

  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center md:justify-start">
          <Cog6ToothIcon
            className="w-8 h-8 mr-3 text-skhool-blue-700"
            aria-hidden="true"
          />
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your account and application preferences.
        </p>
      </div>

      {/* Profile Section */}
      <DashboardCard
        title="Profile Information"
        icon={<UserCircleIcon className="w-7 h-7 text-skhool-blue-600" />}
      >
        <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <img
            src={
              currentUser?.profilePic ||
              "https://picsum.photos/seed/teacher1/100/100"
            }
            alt={`${currentUser.firstname}'s avatar`}
            className="w-16 h-16 rounded-full object-cover shadow-md"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {currentUser?.firstname} {currentUser?.lastname}
            </h3>
            <p className="text-sm text-gray-600">{currentUser?.username}</p>
            <p className="text-xs text-skhool-orange-500 font-medium mt-0.5">
              {currentUser?.role}
            </p>
          </div>
        </div>
        <SettingsListItem
          icon={PencilIcon}
          title="Edit Profile"
          description="Update your name, avatar, and contact details."
          action={() => setOpenEditDialog(true)} // This would open a modal in a real app
          actionLabel="Edit"
        />
        <div className="border-t border-gray-200 my-1"></div>
        <SettingsListItem
          icon={ShieldCheckIcon}
          title="Change Password"
          description="Update your account password regularly for security."
          action={() => alert("Change Password clicked!")}
          actionLabel="Change"
        />
      </DashboardCard>

      {/* Notification Preferences Section */}
      <DashboardCard
        title="Notification Preferences"
        icon={<BellAlertIcon className="w-7 h-7 text-skhool-orange-500" />}
      >
        <ToggleSwitch
          id="email-notifications"
          label="Email Notifications for Announcements"
          description="Receive important school announcements via email."
          enabled={emailNotifications}
          setEnabled={setEmailNotifications}
        />
        <div className="border-t border-gray-200"></div>
        <ToggleSwitch
          id="in-app-reminders"
          label="In-App Reminders for Tasks"
          description="Get reminders for pending tasks and deadlines within the app."
          enabled={inAppReminders}
          setEnabled={setInAppReminders}
        />
      </DashboardCard>

      {/* App Preferences Section */}
      <DashboardCard
        title="Application Preferences"
        icon={<PaintBrushIcon className="w-7 h-7 text-purple-600" />}
      >
        <div className="py-3 px-2">
          <label
            htmlFor="language-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Language
          </label>
          <select
            id="language-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="block w-full py-2.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi) - Placeholder</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Choose your preferred language for the application interface.
          </p>
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="py-3 px-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interface Density (Placeholder)
          </label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {["compact", "default", "comfortable"].map((density) => (
              <label
                key={density}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="interfaceDensity"
                  value={density}
                  checked={interfaceDensity === density}
                  onChange={(e) => setInterfaceDensity(e.target.value)}
                  className="form-radio h-4 w-4 text-skhool-blue-600 border-gray-300 focus:ring-skhool-blue-500"
                  aria-labelledby={`density-${density}-label`}
                />
                <span
                  id={`density-${density}-label`}
                  className="text-sm text-gray-700 capitalize"
                >
                  {density}
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Adjust the spacing and size of elements.
          </p>
        </div>
        <div className="border-t border-gray-200"></div>
        <ToggleSwitch
          id="dark-mode"
          label="Dark Mode (Placeholder)"
          description="Enable dark theme for the application."
          enabled={darkMode}
          setEnabled={setDarkMode}
        />
      </DashboardCard>

      {/* Account Actions Section */}
      <DashboardCard
        title="Account & Data"
        icon={<InformationCircleIcon className="w-7 h-7 text-red-600" />}
      >
        <SettingsListItem
          icon={ArrowDownTrayIcon}
          title="Export My Data"
          description="Download a copy of your personal data."
          action={() => alert("Export My Data clicked!")}
          actionLabel="Export"
        />
        <div className="border-t border-gray-200 my-1"></div>
        <SettingsListItem
          icon={ArrowLeftOnRectangleIcon}
          title="Logout"
          description="Sign out of your Skhool account."
          action={() => alert("Logout clicked!")} // In real app, this would trigger logout logic
          actionLabel="Logout"
          actionIcon={ArrowLeftOnRectangleIcon}
        />
      </DashboardCard>

      <div className="text-center text-xs text-gray-400 py-4">
        Skhool Teacher Dashboard v1.0.0 (Demo)
      </div>
      {openEditDialog && (
        <EditProfileModal
          user={currentUser}
          onClose={() => setOpenEditDialog(false)}
          onSave={updateProfile}
          fields={Object.keys(currentUser || {}).map((key) => ({
            name: key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            type: key === "bio" ? "textarea" : "text",
            hidden: [
              "id",
              "role",
              "username",
              "category",
              "organization",
              "organizationEmail",
              "profilePic",
            ].includes(key), // Hide fields that shouldn't be edited
          }))}
        />
      )}
    </div>
  );
};

export default SettingsPage;
