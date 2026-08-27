// src/components/ThemeProvider.jsx

import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  // Always use light theme
  const theme = 'light';

  useEffect(() => {
    // Ensure dark class is removed and stays removed
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('apexmoney-theme');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: () => {}, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}