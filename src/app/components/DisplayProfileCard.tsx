// components/WelcomeBannerWithAvatar.tsx
import Image from "next/image";
import React from "react";

// Define the props for the component
interface WelcomeBannerProps {
  userName: string;
  avatarUrl?: string; // Optional: provide a specific avatar URL
}

export const WelcomeBannerWithAvatar: React.FC<WelcomeBannerProps> = ({
  userName,
  avatarUrl,
}) => {
  // If no avatarUrl is provided, generate a consistent random one based on the username.
  // Using i.pravatar.cc with a seed ('?u=') ensures the same user gets the same avatar.
  const finalAvatarUrl =
    avatarUrl || `https://i.pravatar.cc/300?u=${encodeURIComponent(userName)}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Text Content */}
        <div className="text-center md:text-left md:w-3/5">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Hi, {userName} 👋
          </h1>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            What do you want to learn today with your partner?
          </h2>
          <p className="mt-4 text-base text-gray-600 max-w-xl mx-auto md:mx-0">
            Discover courses, track progress, and achieve your learning goals
            seamlessly.
          </p>
          <button className="mt-6 bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105">
            Explore Courses
          </button>
        </div>

        {/* User Avatar */}
        <div className="md:w-2/5 flex-shrink-0 flex items-center justify-center">
          <Image
            src={finalAvatarUrl}
            alt={`Avatar for ${userName}`}
            width={240} // A good size for a prominent avatar
            height={240}
            className="rounded-full object-cover ring-4 ring-white ring-offset-4 ring-offset-blue-100"
          />
        </div>
      </div>
    </div>
  );
};
