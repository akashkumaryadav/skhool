// components/ui/CommandPalette.tsx
"use client";

import { Teacher } from "@/app/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation"; // Use the App Router's router
import { useState } from "react";
import { VoiceInputButton } from "../common/VoiceInputButton";
import { useCommandPalette } from "./CommandPalleteContext";

// Define the structure of our application's routes for the AI
export interface SiteRoute {
  path: string;
  name: string;
  description: string;
}

interface CommandPaletteProps {
  siteRoutes: SiteRoute[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  siteRoutes,
}) => {
  const { isOpen, closePalette } = useCommandPalette();
  const [inputValue, setInputValue] = useState("");
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<Teacher>(["currentUser"]);

  console.log(currentUser);

  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (query: string) => {
    if (!query) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/ai-navigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          routes: siteRoutes,
          userRole: currentUser?.role,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.route) {
          router.push(result.route); // Navigate to the page
          closePalette(); // Close the palette on success
        }
      }
    } catch (error) {
      console.error("Navigation AI error:", error);
    } finally {
      setIsProcessing(false);
      setInputValue("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20"
          onClick={closePalette}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center gap-2 p-2">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Search />
                )}
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(inputValue)}
                placeholder="Ask to navigate or perform an action..."
                className="w-full text-lg pl-12 pr-4 py-3 bg-transparent focus:outline-none"
                autoFocus
              />
              <VoiceInputButton onResult={handleSubmit} />
            </div>
            {/* You can add a list of suggested commands here later */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
