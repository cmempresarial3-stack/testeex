import { useEffect, useState } from "react";
import { useLocalStorage } from "./use-local-storage";

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage("darkMode", false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return { isDarkMode, toggleTheme };
}
