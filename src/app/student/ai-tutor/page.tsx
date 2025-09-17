"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Bot, Send, Sparkles, BookOpen, Target, TrendingUp } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

const AITutorPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: analysis } = useQuery({
    queryKey: ['aiAnalysis'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/ai/analysis');
      return response.data;
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      // In a real app, this would call your AI API
      return new Promise<{ response: string }>((resolve) => {
        setTimeout(() => {
          resolve({
            response: `I've analyzed your performance. You're doing well in Math but could use some help with Science. Here are some resources that might help...`
          });
        }, 1000);
      });
    },
    onSuccess: (data, content) => {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), content, sender: 'user', timestamp: new Date() },
        { id: (Date.now() + 1).toString(), content: data.response, sender: 'ai', timestamp: new Date() }
      ]);
      setMessage('');
    },
  });

  const analyzePerformance = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now().toString(), 
          content: "I've analyzed your performance across all subjects. Here's what I found...",
          sender: 'ai',
          timestamp: new Date() 
        }
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Bot className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800">AI Learning Assistant</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Chat with your AI Tutor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto mb-4 space-y-4 pr-2">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
                    <Bot className="w-12 h-12 mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">How can I help you today?</h3>
                    <p className="text-sm max-w-md">Ask me about your performance, request study tips, or get help with specific subjects.</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === 'user' 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                {isAnalyzing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about your learning..."
                  className="min-h-[40px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (message.trim()) {
                        sendMessage.mutate(message);
                      }
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  disabled={!message.trim() || sendMessage.isPending}
                  onClick={() => message.trim() && sendMessage.mutate(message)}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={analyzePerformance}
                disabled={isAnalyzing}
              >
                <TrendingUp className="w-4 h-4" />
                Analyze My Performance
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <BookOpen className="w-4 h-4" />
                Suggest Study Plan
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Target className="w-4 h-4" />
                Set Learning Goals
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Strengths</h4>
                    <div className="mt-1 space-y-1">
                      {analysis.strengths.map((s: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          <span className="text-sm">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Areas to Improve</h4>
                    <div className="mt-1 space-y-1">
                      {analysis.areasToImprove.map((a: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                          <span className="text-sm">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>Complete an assessment to see your performance analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AITutorPage;
