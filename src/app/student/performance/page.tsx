"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, BookOpen, Clock, TrendingUp, Target, Award, Bot } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
        <Button asChild>
          <Link href="/student/ai-tutor">
            <Bot className="w-4 h-4 mr-2" /> AI Tutor
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" /> Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {performanceData?.overallScore?.toFixed(1) || 'N/A'}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceData?.scoreTrend >= 0 ? '↑' : '↓'} {Math.abs(performanceData?.scoreTrend || 0)}% from last term
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" /> Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {performanceData?.subjects?.length || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceData?.subjects?.find((s: any) => s.needsAttention)?.name || 'All on track'}
              {performanceData?.subjects?.find((s: any) => s.needsAttention) ? ' needs attention' : ''}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-2" /> Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.floor((performanceData?.studyTime?.weeklyMinutes || 0) / 60)}h
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceData?.studyTime?.trend >= 0 ? '↑' : '↓'} {Math.abs(performanceData?.studyTime?.trend || 0)}% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <Award className="w-4 h-4 mr-2" /> Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {performanceData?.achievements?.recent || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceData?.achievements?.total} total • {performanceData?.achievements?.nextBadge} next
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {/* Performance chart would go here */}
              <div className="h-full flex items-center justify-center text-gray-400">
                Performance chart will be displayed here
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Learning Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceData?.goals?.map((goal: any) => (
              <div key={goal.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{goal.name}</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">+ New Goal</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-4">
                {performanceData?.aiFeedback || "Based on your recent performance, you're doing well in most subjects. Let me analyze your data to provide more specific feedback..."}
              </p>
              <Button variant="outline" size="sm">
                <Bot className="w-4 h-4 mr-2" />
                Get Detailed Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {performanceData?.recommendations?.map((rec: any) => (
              <div key={rec.id} className="p-3 border rounded-lg hover:bg-gray-50">
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-sm text-gray-500">{rec.type} • {rec.duration} min</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentPerformancePage;
