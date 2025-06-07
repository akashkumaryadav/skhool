"use client";

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; // Import useRouter

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

// Assume a function to fetch the list of organizations (you'll need to implement this)
const fetchOrganizations = async () => {
  // Replace with your actual logic to fetch organizations
  // This function should return an array of organization objects
  // For now, we'll simulate fetching organizations
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'org-1', name: 'Organization A', schema_name: 'schema_a', administrator_user: 'admin_a', cluster_url: 'url_a' },
        { id: 'org-2', name: 'Organization B', schema_name: 'schema_b', administrator_user: 'admin_b', cluster_url: 'url_b' },
        // Add more dummy organizations here
      ]);
    }, 1000);
  });
};

export default function OrganizationListPage() {
  const router = useRouter();

  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useQuery({
    queryKey: ['userDetails'],
    queryFn: fetchUserDetails,
  });

  const { data: organizations, isLoading: isLoadingOrganizations, isError: isErrorOrganizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
    enabled: user?.role === 'master', // Only fetch organizations if user is master
  });

  if (isLoadingUser || isLoadingOrganizations) {
    return <div>Loading organizations...</div>;
  }

  if (isErrorUser || isErrorOrganizations) {
    return <div>Error loading data.</div>;
  }

  // Check if the user has the 'master' role
  if (user?.role !== 'master') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
          You do not have permission to view organizations.
        </div>
      </div>
    ); // Or redirect to an unauthorized page
  }

  // Render the list of organizations in a grid
  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Organizations
      </h1>
      <div className="w-full max-w-4xl overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Schema
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Admin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Cluster URL
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {organizations?.map((org) => (
          <tr
            key={org.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition duration-150 ease-in-out"
            onClick={() => router.push(`/organization/details/${org.id}`)}
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{org.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{org.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{org.schema_name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{org.administrator_user}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{org.cluster_url}</td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>
    </main>
  );
}