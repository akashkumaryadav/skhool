"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { authenticate } from "@/app/lib/actions"; // Assuming you have an authenticate action
import CartoonEyes from "@/app/components/CartoonEyes";

export default function LoginPage() {
  const [focusedInputPosition, setFocusedInputPosition] = useState<{ x: number, y: number } | null>(null);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log('handleFocus called');
    const rect = event.target.getBoundingClientRect();
    setFocusedInputPosition({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
    console.log('Focused Input Position:', { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
  };

  const handleBlur = () => {
    setFocusedInputPosition(null);
    console.log('Focused Input Position:', null);
  };

  // State for handling form submission and errors
  const [state, formAction] = useFormState(authenticate as any, undefined);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Login
        </h1>
        <form action={formAction}>
        <CartoonEyes focusedInputPosition={focusedInputPosition} />
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              id="username"
              type="text"
              placeholder="Username"
              name="username"
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              id="password"
              type="password"
              placeholder="********"
              name="password"
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {/* Error message display */}
            {state && state.message && (
              <p className="text-red-500 text-xs italic mt-2">
                {state.message}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              type="submit" // Explicitly set type to submit
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