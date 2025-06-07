
"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/app/types/types'; 

const data: ChartDataPoint[] = [
  { name: 'Maths', value: 78 },
  { name: 'Science', value: 85 },
  { name: 'English', value: 72 },
  { name: 'History', value: 68 },
  { name: 'Hindi', value: 81 },
  { name: 'Art', value: 90 },
];

const StudentPerformanceChart: React.FC = () => {
  return (
    <div className="h-72 md:h-80 w-full"> {/* Increased height for better visibility */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20, // Adjusted margins
            left: -10, // Adjusted margins
            bottom: 5,
          }}
          barSize={20} // Adjusted bar size
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#4A5568' }} />
          <YAxis tick={{ fontSize: 12, fill: '#4A5568' }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
            labelStyle={{ color: '#333', fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
          <Bar dataKey="value" name="Average Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentPerformanceChart;
    