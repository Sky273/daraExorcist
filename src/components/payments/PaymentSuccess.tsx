import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';

export function PaymentSuccess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setPlan } = useSubscriptionStore();

  useEffect(() => {
    // Get plan from URL params
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan');
    
    if (plan) {
      // Set expiration date to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      setPlan(plan as any, expiresAt.toISOString());
    }

    // Redirect to app after 5 seconds
    const timer = setTimeout(() => {
      navigate('/app');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, setPlan]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          {t('payment.success.title')}
        </h2>
        
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('payment.success.description')}
        </p>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('payment.success.redirect')}
          </p>
        </div>
        
        <button
          onClick={() => navigate('/app')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {t('payment.success.continue')}
        </button>
      </div>
    </div>
  );
}
