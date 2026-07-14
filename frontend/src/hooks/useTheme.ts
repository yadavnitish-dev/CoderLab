import { useState, useEffect, useCallback } from "react";

export type Theme = "industrial" | "amber" | "mono" | "cool" | "muted";

export const THEMES: { value: Theme; label: string; description: string }[] = [
  { value: "industrial", label: "Industrial", description: "Default emerald terminal" },
  { value: "amber", label: "Amber", description: "Warm amber accents" },
  { value: "mono", label: "Mono", description: "High contrast monochrome" },
  { value: "cool", label: "Cool", description: "Blue-gray tones" },
  { value: "muted", label: "Muted", description: "Soft gray palette" },
  { value: "crimson", label: "Crimson", description: "Bold red accent" },
  { value: "teal", label: "Teal", description: "Cyan-teal accent" },
  { value: "orange", label: "Orange", description: "Burnt orange accent" },
  { value: "forest", label: "Forest", description: "Deep green accent" },
  { value: "slate", label: "Slate", description: "Blue-gray monotone" },
];

export type Theme = 
  | "industrial" | "amber" | "mono" | "cool" | "muted" 
  | "crimson" | "teal" | "orange" | "forest" | "slate";

const THEME_KEY = "algoprep-theme";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "industrial";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved && THEMES.some((t) => t.value === saved)) {
    return saved as Theme;
  }
  return "industrial";
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }, []);

  return { theme, setTheme };
};