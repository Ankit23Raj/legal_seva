
import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

// Define theme context type
interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  systemTheme?: string;
  themes: string[];
  isDark: boolean;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: undefined,
  setTheme: () => {},
  systemTheme: undefined,
  themes: [],
  isDark: false,
});

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

// Custom ThemeProvider component that wraps next-themes
export function ThemeProvider({
  children,
  defaultTheme = "system",
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure theme is only applied after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      {...props}
    >
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </NextThemesProvider>
  );
}

// Internal provider component that uses next-themes hook
const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme, systemTheme } = useNextTheme();
  
  // Define all available themes
  const themes = ["light", "dark", "blue", "purple", "green", "orange", "system"];
  
  // Determine if the current theme is dark
  const isDark = 
    theme === "dark" || 
    (theme === "system" && systemTheme === "dark") ||
    theme === "blue";
  
  const value = {
    theme,
    setTheme,
    systemTheme,
    themes,
    isDark
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// For backward compatibility
export const useNextThemes = useTheme;

// Consumer component for render props pattern
export const ThemeConsumer = ({
  children,
}: {
  children: (props: ThemeContextType) => React.ReactNode;
}) => {
  const themeContext = useTheme();
  return <>{children(themeContext)}</>;
};
