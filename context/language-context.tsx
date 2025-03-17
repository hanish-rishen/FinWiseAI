"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
};

const defaultLanguage = "en";

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<string>(defaultLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get language from localStorage or use default
    if (typeof window !== "undefined") {
      const savedLanguage =
        localStorage.getItem("finwise_language") || defaultLanguage;
      setLanguageState(savedLanguage);
      loadTranslations(savedLanguage);
    }
    setIsLoaded(true);
  }, []);

  const loadTranslations = async (lang: string) => {
    try {
      // Using dynamic import for translations
      let translationData = {};

      // Import the specific language file
      if (lang === "en") {
        translationData = (await import("@/translations/en.json")).default;
      } else if (lang === "hi") {
        translationData = (await import("@/translations/hi.json")).default;
      } else if (lang === "ta") {
        translationData = (await import("@/translations/ta.json")).default;
      } else {
        // Fallback to English
        translationData = (await import("@/translations/en.json")).default;
      }

      setTranslations(translationData);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}`, error);
      // Fallback to English if translation file not found
      try {
        const fallbackData = (await import("@/translations/en.json")).default;
        setTranslations(fallbackData);
      } catch (e) {
        console.error("Failed to load fallback translations", e);
      }
    }
  };

  const setLanguage = (lang: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("finwise_language", lang);
    }
    setLanguageState(lang);
    loadTranslations(lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
