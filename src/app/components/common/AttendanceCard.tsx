// components/dashboard/AttendanceCard.tsx
"use client"; // This component uses hooks, so it must be a client component

import { useSpring, animated } from "@react-spring/web";
import React from "react";

interface AttendanceCardProps {
  title: string;
  present: number;
  absent: number;
  color: string; // e.g., 'text-orange-500', 'bg-orange-500'
  late?:number;
  notMarked?:number;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  title,
  present,
  absent,
  late,
  notMarked,
  color,
}) => {
  const total = present + absent;
  const percentage = total > 0 ? (present / total) * 100 : 0;

  const circumference = 2 * Math.PI * 45; // 2 * PI * radius

  const props = useSpring({
    from: { strokeDashoffset: circumference },
    to: {
      strokeDashoffset: circumference - (percentage / 100) * circumference,
    },
    config: { duration: 1500 },
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="font-bold text-gray-800">{title}</h3>
      <div className="flex items-center justify-between mt-4">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500">Present No.</p>
            <p className="font-bold text-lg text-gray-800">{present}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Absent No.</p>
            <p className="font-bold text-lg text-gray-800">{absent}</p>
          </div>
        </div>
        <div className="relative w-28 h-28">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-gray-200"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            {/* Progress circle */}
            <animated.circle
              className={color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={props.strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
