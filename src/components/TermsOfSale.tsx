import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TermsOfSale() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">{t('nav.backToHome')}</span>
            </Link>
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                {t('app.title')}
              </span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {t('terms.title')}
          </h1>

          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.scope.title')}
              </h2>
              <p>{t('terms.scope.content')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.pricing.title')}
              </h2>
              <p>{t('terms.pricing.content')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.subscription.title')}
              </h2>
              <p>{t('terms.subscription.content')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.payment.title')}
              </h2>
              <p>{t('terms.payment.content')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.cancellation.title')}
              </h2>
              <p>{t('terms.cancellation.content')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.refund.title')}
              </h2>
              <p>{t('terms.refund.content')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.liability.title')}
              </h2>
              <p>{t('terms.liability.content')}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
