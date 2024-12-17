import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApteaLogo } from './ApteaLogo';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              DataExorcist
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              v0.4
            </span>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <a 
              href="https://www.aptea.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <ApteaLogo className="h-12 dark:brightness-0 dark:invert" />
              <span className="sr-only">Aptea</span>
            </a>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-4">
                <Link 
                  to="/privacy" 
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {t('footer.privacy')}
                </Link>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <Link 
                  to="/terms" 
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {t('footer.terms')}
                </Link>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <Link 
                  to="/legal" 
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {t('footer.legal')}
                </Link>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <a 
                  href="mailto:contact@dataexorcist.com"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {t('footer.contact')}
                </a>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} Aptea. {t('footer.rights')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
