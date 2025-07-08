// components/dashboard/StatCard.tsx
import Image from "next/image";
import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  iconSrc?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  iconSrc,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>

      {iconSrc && (
        <div className="p-2 rounded-full bg-indigo-100">
          <Image src={iconSrc} alt={title} width={40} height={40} />
        </div>
      )}
    </div>
  );
};
