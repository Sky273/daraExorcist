import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Get display text based on current language
  const displayText = i18n.language === 'en' ? 'EN' : 'FR';

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
      aria-label="Toggle language"
    >
      <Languages className="h-5 w-5" />
      <span className="text-sm font-medium">{displayText}</span>
    </button>
  );
}
