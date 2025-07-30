import { useEffect, useState } from "react";

export interface DarkModeHook {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function useDarkMode(): DarkModeHook {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedMode = localStorage.getItem("darkMode");
      return savedMode ? JSON.parse(savedMode) : false;
    } catch (error) {
      console.warn("Error loading dark mode preference:", error);
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    } catch (error) {
      console.warn("Error saving dark mode preference:", error);
    }
  }, [isDarkMode]);

  const toggleDarkMode = (): void => {
    setIsDarkMode(!isDarkMode);
  };

  return { isDarkMode, toggleDarkMode };
}