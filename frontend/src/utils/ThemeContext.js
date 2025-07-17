import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // initialize from localStorage (or default to false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    //return saved === "true";  // if saved is "true", return true, else return false
    return saved !== null ? saved === "true" : true;  //this is done by me to default dark mode to true
  });

  // whenever darkMode changes, add/remove .dark on <html>
  useEffect(() => {
    const cls = document.documentElement.classList;
    if (darkMode) cls.add("dark");
    else cls.remove("dark");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
