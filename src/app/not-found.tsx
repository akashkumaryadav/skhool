"use client";

import { useRive } from "@rive-app/react-canvas";
import Link from "next/link";
import { useEffect } from "react";

const NotFoundPage = () => {
  const { rive, RiveComponent } = useRive({
    src: "/state_machines/404StateMachine.riv",
    stateMachines: "404StateMachine",
    autoplay: true,
  });

  useEffect(() => {
    // Trigger any initial animations if needed
    if (rive) {
      rive.play();
    }
  }, [rive]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-skhool-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-xl px-4">
        <div className="mb-8 w-full h-64">
          <RiveComponent />
        </div>
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">Page Not Found</h1>
          <p className="text-lg text-gray-600">
            Oops! The page you&apos;re looking for seems to have gone on a field trip.
          </p>
          
          <Link 
            href="/"
            className="inline-block mt-6 px-8 py-3 bg-skhool-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-skhool-blue-700 transition-colors duration-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;