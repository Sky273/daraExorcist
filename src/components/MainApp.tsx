import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileUpload } from './FileUpload';
import { DataPreview } from './DataPreview';
import { AnonymizationSettings } from './AnonymizationSettings';
import { ExportButtons } from './ExportButtons';
import { Header } from './Header';
import { Footer } from './Footer';

export function MainApp() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('app.title')}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('app.description')}
              </p>
            </div>

            <FileUpload />
            <DataPreview />
            <AnonymizationSettings />
            <ExportButtons />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
