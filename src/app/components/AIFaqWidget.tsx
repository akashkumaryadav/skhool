
"use client";
import React, { useState, useCallback } from 'react';
import { SparklesIcon, ArrowPathIcon } from '@/app/components/icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const AIFaqWidget: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const predefinedQuestions = [
    "How to check student's progress?",
    "What's the syllabus for the upcoming exam?",
    "How to apply for leave?",
    "Tell me about the school's sports facilities."
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = useCallback(async (question?: string) => {
    const query = question || inputValue;
    if (!query.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: query, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    if (!question) setInputValue(''); // Clear input if not from predefined
    setIsLoading(true);

    // Simulate API call to Gemini
    // In a real app, this is where you'd call the Gemini API:
    // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // const response = await ai.models.generateContent(...);
    // const aiText = response.text;
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
    
    const aiResponseText = `This is a simulated AI response to: "${query}". In a real application, this would come from the Gemini API. For example, if you asked about student progress, I would guide you to the performance analytics section.`;
    const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  }, [inputValue]);

  return (
    <div className="flex flex-col h-[28rem] bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${
                msg.sender === 'user'
                  ? 'bg-skhool-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl bg-gray-200 text-gray-800 rounded-bl-none flex items-center">
              <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin text-purple-500" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
      </div>
      
      {!messages.length && !isLoading && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Or try one of these common questions:</p>
          <div className="flex flex-wrap gap-2">
            {predefinedQuestions.map(q => (
              <button 
                key={q}
                onClick={() => handleSubmit(q)}
                className="px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex items-center border-t border-gray-300 pt-3"
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Ask Skhool AI a question..."
          className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-shadow"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 disabled:opacity-50 transition-colors"
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <SparklesIcon className="w-5 h-5" />
          )}
          <span className="sr-only">Ask AI</span>
        </button>
      </form>
       <p className="text-xs text-gray-400 text-center mt-2">Powered by Skhool AI (Gemini simulation)</p>
    </div>
  );
};

export default AIFaqWidget;
    