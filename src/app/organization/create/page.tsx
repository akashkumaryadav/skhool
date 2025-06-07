"use client";

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useFormState } from 'react-dom'; // Import useFormState
import { createOrganization } from '@/app/lib/organizationActions'; // Assume you'll create this server action

// Assume a function to fetch user details (you'll need to implement this)
const fetchUserDetails = async () => {
  // Replace with your actual logic to fetch user details
  // This function should return an object like { role: 'master' | 'user', ...otherDetails }
  // For now, we'll simulate fetching user details
  return new Promise((resolve) => {
    setTimeout(() => {
      // You can change 'user' to 'master' here to test the master role
      resolve({ role: 'master', name: 'Test User' });
    }, 1000);
  });
};

// Define the initial state for the form (optional, but good practice)
const initialState = {
  message: null,
};

export default function CreateOrganizationPage() {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['userDetails'],
    queryFn: fetchUserDetails,
  });

  // State for handling form submission and errors using useFormState
  const [state, formAction] = useFormState(createOrganization, initialState);

  if (isLoading) {
    return <div>Loading user details...</div>;
  }

  if (isError) {
    return <div>Error loading user details.</div>;
  }

  // Check if the user has the 'master' role
  if (user?.role !== 'master') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
          You do not have permission to create organizations.
        </div>
      </div>
    ); // Or redirect to an unauthorized page
  }

  // Organization creation form
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create Organization
        </h1>
        <form action={formAction}>
          {/* Organization Name */}
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="organization_name"
            >
              Organization Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              id="organization_name"
              type="text"
              placeholder="Organization Name"
              name="organization_name"
              required
            />
          </div>

          {/* Administrator Username */}
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="administrator_username"
            >
              Administrator Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              id="administrator_username"
              type="text"
              placeholder="Administrator Username"
              name="administrator_username"
              required
            />
          </div>

          {/* Schema Name */}
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="schema_name"
            >
              Schema Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              id="schema_name"
              type="text"
              placeholder="Schema Name"
              name="schema_name"
              required
            />
          </div>

          {/* Contact */}
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="contact"
            >
              Contact
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              id="contact"
              type="text"
              placeholder="Contact Information"
              name="contact"
            />
          </div>

          {/* Cluster URL */}
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="cluster_url"
            >
              Cluster URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              id="cluster_url"
              type="text"
              placeholder="Cluster URL"
              name="cluster_url"
            />
          </div>

          {/* Address */}
          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="address"
            >
              Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              id="address"
              type="text"
              placeholder="Organization Address"
              name="address"
            />
          </div>

          {/* Error message display */}
          {state?.message && (
            <p className="text-red-500 text-xs italic mt-2">
              {state.message}
            </p>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
              type="submit"
            >
              Create Organization
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}