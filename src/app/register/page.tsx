"use client";

import { useState, useEffect } from 'react';
import CartoonEyes from '../components/CartoonEyes';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const isFormValid = formData.username !== '' && formData.email !== '' && formData.password !== '' && formData.confirmPassword !== '' && formData.password === formData.confirmPassword;

  let expression: 'default' | 'disagreement' | 'agreement' | 'waiting' = 'default';

  if (focusedField && !isTyping) {
    expression = 'waiting';
  } else if (!focusedField && !isTyping) {
    expression = isFormValid ? 'agreement' : 'default';
  } else if (focusedField && isTyping) {
    // Optionally add typing feedback or keep current expression
    expression = 'waiting'; // Or another expression for typing
  } else if (!isFormValid && !focusedField) {
      expression = 'disagreement';
  }

  useEffect(() => {
      let typingTimer: NodeJS.Timeout;
      if (focusedField) {
          setIsTyping(true);
          typingTimer = setTimeout(() => setIsTyping(false), 500); // Adjust delay as needed
      } else {
          setIsTyping(false);
      }
      return () => clearTimeout(typingTimer);
  }, [formData, focusedField]); // Depend on formData and focusedField

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsTyping(true); // Indicate typing on change
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration submitted:', formData);
    // You would typically send this data to your backend
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-100 to-blue-200">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-xl transform transition-transform duration-500 hover:scale-105">

        {/* Cartoon Eyes Component */}
        <div className="flex justify-center">
           <CartoonEyes expression={expression} />
        </div>

        <div className="text-center">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        {/* Optional: Display form validity for debugging */}
        {/* <div className="text-center text-sm text-gray-600">
            Form Valid: {isFormValid ? 'Yes' : 'No'} | Focused: {focusedField || 'None'} | Typing: {isTyping ? 'Yes' : 'No'} | Expression: {expression}
        </div> */}


        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="off"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                autoComplete="off"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="off"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                autoComplete="off"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}