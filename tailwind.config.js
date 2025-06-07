/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      // Add other paths if you have components in other directories e.g. './app/**/*.{js,ts,jsx,tsx,mdx}' for App Router
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        colors: {
          'skhool-blue': {
            '50': '#eff6ff',
            '100': '#dbeafe',
            '200': '#bfdbfe',
            '300': '#93c5fd',
            '400': '#60a5fa',
            '500': '#3b82f6',
            '600': '#2563eb',
            '700': '#1d4ed8',
            '800': '#1e40af',
            '900': '#1e3a8a',
            '950': '#172554',
          },
          'skhool-orange': {
            '500': '#f97316', // Used in Sidebar Logo
            '600': '#ea580c', // Potential hover state for orange
          },
          // Standard colors like 'red', 'teal', 'green', 'yellow', 'indigo', 'purple'
          // are available by default and are used in components like QuickActions and DashboardCard icons.
          // If specific shades are needed that are not covered by default Tailwind palette or custom 'skhool-blue'/'skhool-orange',
          // they can be added here. For instance, QuickActions uses bg-red-500, bg-teal-500 which are standard.
        }
      },
    },
    plugins: [],
  };