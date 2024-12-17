import React from 'react';
import { X } from 'lucide-react';
import { ApteaLogo } from './ApteaLogo';
import { useTranslation } from 'react-i18next';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                {t('about.title')}
              </h3>

              <div className="mt-4 space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('about.description')}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('about.contact')}
                </p>

                <div className="flex justify-center py-4">
                  <a 
                    href="https://www.aptea.net" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <ApteaLogo className="h-12 dark:brightness-0 dark:invert" />
                  </a>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('about.changelog.title')}
                  </h4>
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>{t('about.changelog.v04')}</p>
                    <p>{t('about.changelog.v03')}</p>
                    <p>{t('about.changelog.v02')}</p>
                    <p>{t('about.changelog.v01')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
