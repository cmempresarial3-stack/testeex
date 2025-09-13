import { useEffect } from "react";
import { useLocalStorage } from "./use-local-storage";

export type Theme = 'light' | 'dark' | 'pink' | 'yellow';

export const THEMES = {
  light: 'Branco',
  dark: 'Preto', 
  pink: 'Rosa',
  yellow: 'Amarelo'
} as const;

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Mantém compatibilidade com código antigo
  const isDarkMode = theme === 'dark';
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { 
    theme, 
    changeTheme, 
    isDarkMode, 
    toggleTheme 
  };
}
