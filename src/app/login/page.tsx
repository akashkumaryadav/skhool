"use client";

import { useFormState } from "react";
import { authenticate } from "@/app/lib/actions"; // Assuming you have an authenticate action

export default function LoginPage() {
  const [state, formAction] = useFormState(authenticate, undefined); // Replace authenticate with your server action

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-md">
        <form action={formAction} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              name="username" // Add name attribute for useFormState
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
              name="password" // Add name attribute for useFormState
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
          {state && <p className="text-red-500 text-xs italic mt-4">{state.message}</p>} {/* Display error message from state */}
        </form>
      </div>
    </main>
  );
}

// You will need to create a server action function, for example:
// In src/app/lib/actions.ts
// export async function authenticate(currentState: any, formData: FormData) {
//   // Implement your authentication logic here
//   // You can access form data using formData.get('username') and formData.get('password')
//   // Return an object with a message property for error handling
//   return { message: 'Authentication failed.' }; // Example error message
// }