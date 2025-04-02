// contexts/i18n-context.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import i18nService, { Language } from '@/lib/i18n';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, args?: Record<string, string>) => string;
  availableLanguages: { code: Language; name: string }[];
}

const I18nContext = createContext<I18nContextType>({
  language: 'id',
  setLanguage: () => {},
  t: (key) => key,
  availableLanguages: [],
});

export const useI18n = () => useContext(I18nContext);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(i18nService.getLanguage());
  const [availableLanguages, setAvailableLanguages] = useState(i18nService.getAvailableLanguages());
  
  const setLanguage = (lang: Language) => {
    i18nService.setLanguage(lang);
    setLanguageState(lang);
  };
  
  const t = (key: string, args?: Record<string, string>) => {
    return i18nService.translate(key, args);
  };
  
  useEffect(() => {
    // Initialize language from localStorage on client side
    setLanguageState(i18nService.getLanguage());
  }, []);
  
  const value = {
    language,
    setLanguage,
    t,
    availableLanguages,
  };
  
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}