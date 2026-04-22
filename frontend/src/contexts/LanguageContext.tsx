import React, { createContext, useState, useContext, useEffect } from 'react';
import LANGUAGES from '@/lib/constants/languages';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  translate: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translate: (text: string) => text,
});

export const useLanguage = () => useContext(LanguageContext);

// This is a simple mock translation service
// In a real app, this would be handled by a proper translation service like i18next
const translations: Record<string, Record<string, string>> = {
  hi: {
    'Welcome': 'स्वागत है',
    'Sign In': 'साइन इन करें',
    'Sign Up': 'साइन अप करें',
    'Email': 'ईमेल',
    'Password': 'पासवर्ड',
    'Submit': 'जमा करें',
    'Legal Seva': 'लीगल सेवा',
    'Share Issue': 'समस्या साझा करें',
    'Reply to Client': 'ग्राहक को जवाब दें',
    'Quizzes for Fun': 'मज़े के लिए क्विज़',
    'Legal Modules': 'कानूनी मॉड्यूल',
    'Chat with AI': 'एआई के साथ चैट करें',
    // Add more translations as needed
  },
  // Other languages would be added here
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Try to get the language from localStorage or default to English
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    // Save the language preference to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const translate = (text: string): string => {
    if (language === 'en') return text;
    return translations[language]?.[text] || text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};
