import React from 'react';
import { Shield, Key, Eye, Database, Cpu, FileCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Features() {
  const { t } = useTranslation();

  const features = [
    {
      name: t('features.items.analysis.title'),
      description: t('features.items.analysis.description'),
      icon: Cpu
    },
    {
      name: t('features.items.formats.title'),
      description: t('features.items.formats.description'),
      icon: Database
    },
    {
      name: t('features.items.anonymization.title'),
      description: t('features.items.anonymization.description'),
      icon: Key
    },
    {
      name: t('features.items.privacy.title'),
      description: t('features.items.privacy.description'),
      icon: Shield
    },
    {
      name: t('features.items.preview.title'),
      description: t('features.items.preview.description'),
      icon: Eye
    },
    {
      name: t('features.items.export.title'),
      description: t('features.items.export.description'),
      icon: FileCheck
    }
  ];

  return (
    <div id="features" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {t('features.title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                      <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
