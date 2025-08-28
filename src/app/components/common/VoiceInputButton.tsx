"use client";

import { Mic, MicOff } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Define a detailed interface for the SpeechRecognition API to satisfy TypeScript
// and ensure we can access its methods and properties safely.
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

// The SpeechRecognitionEvent and SpeechRecognitionErrorEvent types are built-in to TypeScript's DOM library
// but the main constructor isn't, so we declare it on the Window object.
interface SpeechRecognition {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognition;
    webkitSpeechRecognition: SpeechRecognition;
  }
}

// Props for our component. It only needs to emit the final text result.
interface VoiceInputButtonProps {
  onResult: (transcript: string) => void;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    // --- THIS IS THE CORRECTED LOGIC ---
    // Directly check for the API on the window object. This handles vendor
    // prefixes (like in Safari/Chrome on older iOS) gracefully.
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition as ISpeechRecognition;

      // Configure the recognition instance
      recognition.continuous = false; // We want to process one command at a time.
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // Set a default; the AI will handle the actual language.
      
      // --- Event Handlers ---
      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript); // Emit the final, complete transcript.
      };
    } else {
      // If the browser doesn't support the API, log it and disable the feature.
      console.warn("SpeechRecognition API not supported by this browser.");
      setIsSupported(false);
    }
  }, [onResult]); // The empty dependency array ensures this runs only once on mount.

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch(e) {
        console.error("Could not start speech recognition:", e);
      }
    }
  };

  // Do not render the button at all if the browser doesn't support the API.
  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleToggleListening}
      className={`p-2 rounded-full transition-colors ${
        isListening
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
      title={isListening ? 'Stop listening' : 'Start voice search'}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
};