import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { BilingualText, Language } from '../data/portfolioData';

interface LanguageContextValue {
  lang: Language;
  isLanguageReady: boolean;
  isRtl: boolean;
  setLang: (next: Language) => void;
  setLangFromPath: (next: Language) => void;
  toggleLang: () => void;
  t: (text: BilingualText) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANGUAGE_STORAGE_KEY = 'soheil_portfolio_lang';

function languageFromPath(pathname: string): Language | null {
  if (pathname === '/fa' || pathname.startsWith('/fa/')) return 'fa';
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  return null;
}

function getSavedLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === 'fa' || saved === 'en' ? saved : null;
  } catch {
    return null;
  }
}

function getBrowserLanguage(): Language {
  return typeof navigator !== 'undefined' &&
    navigator.language.toLowerCase().startsWith('fa')
    ? 'fa'
    : 'en';
}

function getInitialLanguageState(): { lang: Language; ready: boolean } {
  if (typeof window === 'undefined') return { lang: 'en', ready: true };
  const pathLanguage = languageFromPath(window.location.pathname);
  if (pathLanguage) return { lang: pathLanguage, ready: true };

  const savedLanguage = getSavedLanguage();
  if (savedLanguage) return { lang: savedLanguage, ready: true };
  return { lang: getBrowserLanguage(), ready: false };
}

let localeDetection: Promise<Language> | null = null;

function detectLanguageFromApi(): Promise<Language> {
  if (!localeDetection) {
    localeDetection = fetch('/api/locale', {
      credentials: 'same-origin',
      cache: 'no-store',
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Locale detection request failed.');
        const result: unknown = await response.json();
        if (
          !result ||
          typeof result !== 'object' ||
          !('lang' in result) ||
          (result.lang !== 'fa' && result.lang !== 'en')
        ) {
          throw new Error('Locale detection response is invalid.');
        }
        return result.lang;
      })
      .catch((error: unknown) => {
        console.warn('Using browser language because locale detection failed:', error);
        return getBrowserLanguage();
      });
  }
  return localeDetection;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [initialState] = useState(getInitialLanguageState);
  const [lang, setLangState] = useState<Language>(initialState.lang);
  const [isLanguageReady, setIsLanguageReady] = useState(initialState.ready);

  useEffect(() => {
    if (initialState.ready) return;
    let active = true;
    void detectLanguageFromApi().then((detectedLanguage) => {
      if (!active) return;
      setLangState(
        languageFromPath(window.location.pathname) ??
          getSavedLanguage() ??
          detectedLanguage,
      );
      setIsLanguageReady(true);
    });
    return () => {
      active = false;
    };
  }, [initialState.ready]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    setIsLanguageReady(true);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      } catch (error) {
        console.warn('Could not save the selected language:', error);
      }
    }
  }, []);

  const setLangFromPath = useCallback((next: Language) => {
    setLangState(next);
    setIsLanguageReady(true);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'fa' : 'en');
  }, [lang, setLang]);

  const t = (text: BilingualText) => text[lang];

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isLanguageReady,
        isRtl: lang === 'fa',
        setLang,
        setLangFromPath,
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
