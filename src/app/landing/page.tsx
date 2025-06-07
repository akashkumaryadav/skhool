// src/app/landing/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
          Unlock Learning, Effortlessly.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Simplify school management and ignite student potential with our intuitive platform.
        </p>
        <Link href="/register" className="inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300">
          Get Started for Free
        </Link>
      </section>

      {/* USPs Section */}
      <section className="bg-blue-50 dark:bg-gray-700 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-12">Why Choose Our App?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 rounded-lg shadow-md bg-white dark:bg-gray-800">
              <div className="text-blue-500 dark:text-blue-400 mb-4">
                {/* Replace with actual icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Streamlined Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Effortlessly manage students, teachers, and school data in one place.
              </p>
            </div>
            <div className="p-8 rounded-lg shadow-md bg-white dark:bg-gray-800">
              <div className="text-green-500 dark:text-green-400 mb-4">
                {/* Replace with actual icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1L15 9.5V17m-7-3 2.16-.538L13 13.218" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Engage Students</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Interactive tools and resources to keep students motivated and involved.
              </p>
            </div>
            <div className="p-8 rounded-lg shadow-md bg-white dark:bg-gray-800">
              <div className="text-purple-500 dark:text-purple-400 mb-4">
                {/* Replace with actual icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.01 12.01 0 002 15c0 1.607.301 3.104.857 4.517 1.096 2.867 4.493 5.1 8.843 5.1s7.747-2.233 8.843-5.1A12.01 12.01 0 0022 15c0-1.607-.301-3.104-.857-4.517z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Secure & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your data is safe with us, and our platform is built for consistent performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-12">Powerful Features to Empower Your School</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="md:order-1">
            {/* Placeholder for Feature 1 Visual */}
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl">
              Feature 1 Visual
            </div>
          </div>
          <div className="md:order-2">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Easy User Management</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Quickly add, edit, and manage student, teacher, and admin accounts. Assign roles and permissions with ease.
            </p>
          </div>

          <div className="md:order-3">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Interactive Learning Tools</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access a suite of tools designed to make learning more engaging and effective for students of all ages.
            </p>
          </div>
          <div className="md:order-4">
            {/* Placeholder for Feature 2 Visual */}
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl">
              Feature 2 Visual
            </div>
          </div>

          <div className="md:order-5">
            {/* Placeholder for Feature 3 Visual */}
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl">
              Feature 3 Visual
            </div>
          </div>
          <div className="md:order-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Comprehensive Reporting</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Gain valuable insights into student progress and school performance with detailed reports and analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 dark:bg-blue-800 text-white py-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your School?</h2>
          <p className="text-xl mb-8">Join today and experience the difference our app can make.</p>
          <Link href="/register" className="inline-block bg-white text-blue-600 dark:text-blue-800 text-lg font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}