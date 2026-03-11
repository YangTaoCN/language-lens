import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/router';

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [translations, setTranslations] = useState({});
  const { locale, defaultLocale } = useRouter();

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Could not load translations for', locale);
        // Fallback to default locale
        const response = await fetch(`/locales/${defaultLocale}.json`);
        const data = await response.json();
        setTranslations(data);
      }
    };

    loadTranslations();
  }, [locale, defaultLocale]);

  const t = (key) => {
    return translations[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
