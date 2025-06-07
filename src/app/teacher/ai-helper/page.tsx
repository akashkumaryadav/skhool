// app/ai-helper/page.tsx
"use client";

import { ArrowPathIcon, LightBulbIcon, PaperAirplaneIcon, SparklesIcon, UserCircleIcon } from '@/app/components/icons';
import { ChatMessage } from '@/app/types/types';
import { Chat, GoogleGenAI } from "@google/genai";
import React, { useEffect, useRef, useState } from 'react';

const AIHelperPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Gemini AI and Chat Session
  useEffect(() => {
    try {
      if (!process.env.API_KEY) {
        console.error("API_KEY is not set in environment variables.");
        addMessageToChat("API Key for Gemini is not configured. Please contact support.", 'system', true);
        return;
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const newChatSession = ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: {
          systemInstruction: "You are Skhool AI, a helpful assistant for teachers. Provide concise, practical, and creative support for educational tasks. Be friendly and encouraging. If asked for JSON, ensure the output is pure JSON without markdown.",
        },
      });
      setChatSession(newChatSession);
      addMessageToChat("Hello! I'm Skhool AI. How can I help you today? Feel free to ask me anything or use one of the quick prompts below.", 'ai');
    } catch (error) {
      console.error("Error initializing AI Helper:", error);
      addMessageToChat("Sorry, I couldn't initialize properly. There might be an issue with the AI service configuration.", 'system', true);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const addMessageToChat = (text: string, sender: ChatMessage['sender'], isError: boolean = false, isLoadingFlag: boolean = false) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString() + sender,
      text,
      sender,
      timestamp: new Date(),
      error: isError ? text : undefined,
      isLoading: isLoadingFlag,
    };
    setChatMessages(prev => [...prev, newMessage]);
  };
  
  const updateLastAiMessage = (textChunk: string, isFinalChunk: boolean) => {
    setChatMessages(prevMessages => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'ai' && lastMessage.isLoading) {
            const updatedMessage: ChatMessage = {
                ...lastMessage,
                text: (lastMessage.text === "Thinking..." ? "" : lastMessage.text) + textChunk,
                isLoading: !isFinalChunk, // Set isLoading to false only on the final chunk
            };
            return [...prevMessages.slice(0, -1), updatedMessage];
        }
        // This case should ideally not be hit if addMessageToChat with isLoadingFlag was called correctly
        return [...prevMessages, { 
            id: Date.now().toString() + 'ai_stream', 
            text: textChunk, 
            sender: 'ai', 
            timestamp: new Date(),
            isLoading: !isFinalChunk 
        }];
    });
  };


  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || !chatSession) return;

    addMessageToChat(textToSend, 'user');
    if (!messageText) setInputValue('');
    setIsLoading(true);
    
    // Add a placeholder for AI's response
    addMessageToChat("Thinking...", 'ai', false, true);

    try {
      const stream = await chatSession.sendMessageStream({ message: textToSend });
      let fullResponse = "";
      for await (const chunk of stream) {
        const chunkText = chunk.text; // Access text directly
        if (chunkText) {
            fullResponse += chunkText;
            updateLastAiMessage(chunkText, false); // Update incrementally
        }
      }
      // Final update to mark loading as complete
      updateLastAiMessage("", true); 

    } catch (error: any) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage = error.message || "Sorry, I encountered an error. Please try again.";
       setChatMessages(prev => prev.map(msg => msg.isLoading && msg.sender === 'ai' ? {...msg, text: errorMessage, error: errorMessage, isLoading: false} : msg));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const predefinedPrompts: { title: string; prompt: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { title: "Lesson Plan Spark", prompt: "Suggest some creative starting points or engaging activities for a new lesson plan. I'm open to ideas for any subject suitable for middle school.", icon: LightBulbIcon },
    { title: "Quiz Question Ideas", prompt: "Help me generate a few sample quiz questions (e.g., 2 multiple choice, 1 true/false) for a generic middle school subject like Science or History.", icon: LightBulbIcon },
    { title: "Explain a Concept Simply", prompt: "Explain a common educational concept, for example 'democracy' or 'the water cycle', in very simple terms suitable for a 10-12 year old.", icon: LightBulbIcon },
    { title: "Positive Feedback Phrases", prompt: "Provide a list of 5-7 encouraging and constructive feedback phrases I can use for student assignments.", icon: LightBulbIcon },
    { title: "Quick Classroom Activity", prompt: "Suggest a quick (5-10 minute) and engaging classroom activity that requires minimal preparation and can be used as a warm-up or energizer.", icon: LightBulbIcon },
  ];

  const handlePredefinedPrompt = (prompt: string) => {
    setInputValue(prompt); // Pre-fill input for user to send
    inputRef.current?.focus();
    // Or, send directly:
    // handleSendMessage(prompt); 
  };


  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] bg-gray-50"> {/* Adjusted height for header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <SparklesIcon className="w-7 h-7 text-purple-600 mr-2" />
          AI Helper
        </h1>
        <p className="text-sm text-gray-500">Your intelligent assistant for teaching tasks.</p>
      </div>

      {/* Predefined Prompts Section */}
      <div className="p-4 bg-white border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Quick Starters:</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {predefinedPrompts.map(p => (
            <button
              key={p.title}
              onClick={() => handlePredefinedPrompt(p.prompt)}
              disabled={isLoading}
              className="flex flex-col items-center justify-center text-center p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed"
              title={p.prompt}
            >
              <p.icon className="w-5 h-5 mb-1 text-purple-600" />
              <span className="text-xs font-medium">{p.title}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100" tabIndex={0} aria-live="polite">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <SparklesIcon className="w-6 h-6 text-purple-500 mr-2 flex-shrink-0 self-start mt-1" />
            )}
            <div
              className={`max-w-xl px-4 py-2.5 rounded-xl shadow-md ${
                msg.sender === 'user'
                  ? 'bg-skhool-blue-500 text-white rounded-br-none'
                  : msg.sender === 'ai'
                  ? `bg-white text-gray-800 rounded-bl-none border border-gray-200 ${msg.error ? 'border-red-300 bg-red-50' : ''}`
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-300 text-sm italic text-center w-full max-w-full' // System messages
              }`}
            >
              {msg.isLoading && msg.sender === 'ai' ? (
                <div className="flex items-center">
                  <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin text-purple-500" />
                  <span className="text-sm text-gray-600">{msg.text}</span>
                </div>
              ) : msg.error ? (
                 <p className="text-sm text-red-700"><strong className="font-semibold">Error:</strong> {msg.text}</p>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              )}
               <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-blue-200 text-right' : msg.sender === 'ai' && !msg.error ? 'text-gray-400 text-left' : 'text-yellow-600 text-center'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
             {msg.sender === 'user' && (
              <UserCircleIcon className="w-6 h-6 text-skhool-blue-500 ml-2 flex-shrink-0 self-start mt-1" />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
        className="p-4 border-t border-gray-300 bg-white"
        aria-label="AI Chat Input Form"
      >
        <div className="flex items-end space-x-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message to Skhool AI..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-shadow text-sm resize-none"
            rows={Math.min(5, inputValue.split('\n').length)} // Basic auto-grow up to 5 rows
            disabled={isLoading || !chatSession}
            aria-label="Type your question for Skhool AI"
            aria-multiline="true"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-stretch flex items-center justify-center"
            disabled={isLoading || !inputValue.trim() || !chatSession}
            aria-label={isLoading ? "Sending..." : "Send message to AI"}
          >
            {isLoading ? (
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        {!chatSession && !chatMessages.some(m=>m.sender==='system' && m.error) && (
            <p className="text-xs text-red-500 text-center mt-2">AI Helper is not available. API Key might be missing.</p>
        )}
      </form>
    </div>
  );
};

export default AIHelperPage;