import { create } from "zustand";

export const useThemeStore = create((set) => ({
  isDarkMode: JSON.parse(localStorage.getItem("isDarkMode")) !== false, // Default to dark mode

  toggleTheme: () => {
    set((state) => {
      const newMode = !state.isDarkMode;
      localStorage.setItem("isDarkMode", JSON.stringify(newMode));
      updateDocumentTheme(newMode);
      return { isDarkMode: newMode };
    });
  },

  initTheme: () => {
    const isDark = JSON.parse(localStorage.getItem("isDarkMode")) !== false;
    updateDocumentTheme(isDark);
    set({ isDarkMode: isDark });
  },
}));

// Helper function to apply theme to document
function updateDocumentTheme(isDarkMode) {
  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
