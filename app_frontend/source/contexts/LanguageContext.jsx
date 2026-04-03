import { createContext, useContext, useState, useCallback } from 'react';
import translations from '../utils/translations';

const LanguageContext = createContext();

const LANGUAGES = [
  { code: 'en', name: 'English',  flag: '🇬🇧', native: 'English' },
  { code: 'hi', name: 'Hindi',    flag: '🇮🇳', native: 'हिंदी' },
  { code: 'mr', name: 'Marathi',  flag: '🇮🇳', native: 'मराठी' },
  { code: 'fr', name: 'French',   flag: '🇫🇷', native: 'Français' },
  { code: 'ru', name: 'Russian',  flag: '🇷🇺', native: 'Русский' },
];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem('ssllm_language') || 'en'
  );

  const t = useCallback((key) => {
    return translations[language]?.[key]
      || translations['en']?.[key]
      || key;
  }, [language]);

  const changeLanguage = useCallback((langCode) => {
    setLanguage(langCode);
    localStorage.setItem('ssllm_language', langCode);
  }, []);

  return (
    <LanguageContext.Provider value={{
      language, changeLanguage, t, LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
};

export { LANGUAGES };

