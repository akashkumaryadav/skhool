// components/AdminStatsChart.tsx
"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', students: 280, teachers: 22 },
  { name: 'Feb', students: 300, teachers: 24 },
  { name: 'Mar', students: 310, teachers: 25 },
  { name: 'Apr', students: 340, teachers: 26 },
  { name: 'May', students: 335, teachers: 27 },
  { name: 'Jun', students: 350, teachers: 28 },
];

const AdminStatsChart: React.FC = () => {
  return (
    <div className="h-80 w-full" role="figure" aria-label="Enrollment Trends Chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#4A5568' }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#4A5568' }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#f97316' }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
            labelStyle={{ color: '#333', fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
          <Line yAxisId="left" type="monotone" dataKey="students" name="Students" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="teachers" name="Teachers" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminStatsChart;