'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Language, DICTIONARY, Dictionary } from '../i18n';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'portfolio_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'id') {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      /* localStorage bisa diblokir privasi browser */
    }
    setMounted(true);
  }, []);

  const setLang = (next: Language) => {
    setLangState(next);
    document.documentElement.lang = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const toggleLang = () => {
    setLang(lang === 'id' ? 'en' : 'id');
  };

  const t = useMemo(() => DICTIONARY[lang], [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang, t, mounted]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for components rendered outside provider
    return {
      lang: 'id',
      setLang: () => {},
      toggleLang: () => {},
      t: DICTIONARY.id,
    };
  }
  return context;
}
