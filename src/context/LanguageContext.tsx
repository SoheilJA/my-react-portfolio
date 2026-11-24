import React, { createContext, useContext, useEffect, useState } from 'react';
import { BilingualText, Language } from '../data/portfolioData';

interface LanguageContextValue {
  lang: Language;
  isRtl: boolean;
  setLang: (next: Language) => void;
  toggleLang: () => void;
  t: (text: BilingualText) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const pathname = window.location.pathname;
  if (pathname === '/fa' || pathname.startsWith('/fa/')) return 'fa';
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  const saved = window.localStorage.getItem('soheil_portfolio_lang');
  if (saved === 'fa' || saved === 'en') return saved;
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(detectInitialLanguage);

  const setLang = (next: Language) => {
    setLangState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('soheil_portfolio_lang', next);
    }
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'fa' : 'en');
  };

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.title = window.location.pathname.startsWith('/admin')
      ? 'مدیریت محتوا — Soheil'
      : lang === 'fa'
        ? 'سهیل جلال‌احمدی — طراح و توسعه‌دهنده وب'
        : 'Soheil Jalal-Ahmadi — Web Designer & Developer';
  }, [lang]);

  const t = (text: BilingualText) => text[lang];

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isRtl: lang === 'fa',
        setLang,
        toggleLang,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
