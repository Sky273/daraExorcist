import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function PaymentCancel() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
          <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          {t('payment.cancel.title')}
        </h2>
        
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('payment.cancel.description')}
        </p>
        
        <div className="mt-4 space-y-4">
          <button
            onClick={() => navigate('/pricing')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {t('payment.cancel.tryAgain')}
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t('payment.cancel.backHome')}
          </button>
        </div>
      </div>
    </div>
  );
}
