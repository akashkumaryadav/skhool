"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, BookOpen, Clock, TrendingUp, Target, Award, Bot } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/app/lib/axiosInstance';
import { Progress } from 'antd';

const StudentPerformancePage = () => {
  const { data: performanceData, isLoading } = useQuery({
    queryKey: ['studentPerformance'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/student/performance');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Performance</h1>
        <button className='px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center hover:bg-indigo-700'>
          <Link href="/student/ai-tutor">
            <Bot className="w-4 h-4 mr-2" /> AI Tutor
          </Link>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-1">
          <div className="pb-2 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-500 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" /> Overall Score
            </div>
          </div>
          <div className='mt-4 text-center'>
            <div className="text-3xl font-bold">
              {performanceData?.overallScore?.toFixed(1) || 'N/A'}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceData?.scoreTrend >= 0 ? '↑' : '↓'} {Math.abs(performanceData?.scoreTrend || 0)}% from last term
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="pb-2">
            <div className="text-sm font-medium text-gray-500 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" /> Subjects
            </div>
          </div>
          <div className='mt-4 text-center'>
            <div className="text-3xl font-bold">
              {performanceData?.subjects?.length || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceData?.subjects?.find((s: any) => s.needsAttention)?.name || 'All on track'}
              {performanceData?.subjects?.find((s: any) => s.needsAttention) ? ' needs attention' : ''}
            </div>
          </div>
        </div>

        <div>
          <div className="pb-2">
            <div className="text-sm font-medium text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-2" /> Study Time
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {Math.floor((performanceData?.studyTime?.weeklyMinutes || 0) / 60)}h
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceData?.studyTime?.trend >= 0 ? '↑' : '↓'} {Math.abs(performanceData?.studyTime?.trend || 0)}% from last week
            </div>
          </div>
        </div>

        <div>
          <div className="pb-2">
            <div className="text-sm font-medium text-gray-500 flex items-center">
              <Award className="w-4 h-4 mr-2" /> Achievements
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {performanceData?.achievements?.recent || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceData?.achievements?.total} total • {performanceData?.achievements?.nextBadge} next
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Performance Trends
            </div>
          </div>
          <div>
            <div className="h-64">
              {/* Performance chart would go here */}
              <div className="h-full flex items-center justify-center text-gray-400">
                Performance chart will be displayed here
              </div>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Learning Goals
            </div>
          </div>
          <div className="space-y-4">
            {performanceData?.goals?.map((goal: any) => (
              <div key={goal.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{goal.name}</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
            <button  className="w-full mt-2 ">+ New Goal</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div>
            <div>AI Feedback</div>
          </div>
          <div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-4">
                {performanceData?.aiFeedback || "Based on your recent performance, you're doing well in most subjects. Let me analyze your data to provide more specific feedback..."}
              </p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center hover:bg-indigo-700">
                <Bot className="w-4 h-4 mr-2" />
                Get Detailed Analysis
              </button>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div>Recommended Resources</div>
          </div>
          <div className="space-y-3">
            {performanceData?.recommendations?.map((rec: any) => (
              <div key={rec.id} className="p-3 border rounded-lg hover:bg-gray-50">
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-sm text-gray-500">{rec.type} • {rec.duration} min</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformancePage;
