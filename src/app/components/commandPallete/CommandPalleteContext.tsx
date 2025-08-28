// context/CommandPaletteContext.tsx
"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface CommandPaletteContextType {
  isOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
}

const CommandPaletteContext = createContext<
  CommandPaletteContextType | undefined
>(undefined);

export const CommandPaletteProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPalette = () => setIsOpen(true);
  const closePalette = () => setIsOpen(false);

  // Effect to listen for Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CommandPaletteContext.Provider
      value={{ isOpen, openPalette, closePalette }}
    >
      {children}
    </CommandPaletteContext.Provider>
  );
};

export const useCommandPalette = () => {
  const context = useContext(CommandPaletteContext);
  if (context === undefined) {
    throw new Error(
      "useCommandPalette must be used within a CommandPaletteProvider"
    );
  }
  return context;
};
