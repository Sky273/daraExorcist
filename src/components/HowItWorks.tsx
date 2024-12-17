import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Upload, 
  FileSearch, 
  Shield, 
  Download,
  Settings,
  CheckCircle
} from 'lucide-react';

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Upload,
      title: t('howItWorks.steps.upload.title'),
      description: t('howItWorks.steps.upload.description'),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      icon: FileSearch,
      title: t('howItWorks.steps.detection.title'),
      description: t('howItWorks.steps.detection.description'),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      icon: Settings,
      title: t('howItWorks.steps.configure.title'),
      description: t('howItWorks.steps.configure.description'),
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      gradient: 'from-indigo-600 to-blue-600'
    },
    {
      icon: Shield,
      title: t('howItWorks.steps.anonymize.title'),
      description: t('howItWorks.steps.anonymize.description'),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      icon: CheckCircle,
      title: t('howItWorks.steps.preview.title'),
      description: t('howItWorks.steps.preview.description'),
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      gradient: 'from-yellow-600 to-orange-600'
    },
    {
      icon: Download,
      title: t('howItWorks.steps.export.title'),
      description: t('howItWorks.steps.export.description'),
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      gradient: 'from-red-600 to-rose-600'
    }
  ];

  return (
    <div id="how-it-works" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {t('howItWorks.title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative group">
                <div 
                  className={`absolute -inset-0.5 bg-gradient-to-r ${step.gradient} rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`}
                  style={{
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                />
                <div 
                  className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform group-hover:-translate-y-1"
                  style={{
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${step.bgColor} transform transition-transform duration-200 group-hover:scale-110`}>
                      <step.icon className={`h-6 w-6 ${step.color}`} />
                    </div>
                    <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white transform transition-transform duration-200 group-hover:scale-110">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('howItWorks.cta.title')}
          </h3>
          <div className="mt-8">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transform transition-transform duration-200 hover:-translate-y-1"
            >
              {t('howItWorks.cta.button')}
              <Shield className="ml-2 -mr-1 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
