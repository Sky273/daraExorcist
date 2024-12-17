import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Shield, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PaymentModal } from '../payments/PaymentModal';
import { SubscriptionPlan } from '../../store/useSubscriptionStore';

export function PricingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<{
    plan: SubscriptionPlan;
    amount: number;
  } | null>(null);

  const plans = [
    {
      name: t('pricing.starter.name'),
      plan: 'starter' as SubscriptionPlan,
      price: 9.99,
      description: t('pricing.starter.description'),
      features: [
        t('pricing.starter.features.files'),
        t('pricing.starter.features.size'),
        t('pricing.starter.features.export'),
        t('pricing.starter.features.support')
      ],
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      name: t('pricing.professional.name'),
      plan: 'professional' as SubscriptionPlan,
      price: 29.99,
      description: t('pricing.professional.description'),
      features: [
        t('pricing.professional.features.files'),
        t('pricing.professional.features.size'),
        t('pricing.professional.features.export'),
        t('pricing.professional.features.support'),
        t('pricing.professional.features.custom'),
        t('pricing.professional.features.api')
      ],
      featured: true,
      gradient: 'from-indigo-600 to-purple-600'
    },
    {
      name: t('pricing.enterprise.name'),
      plan: 'enterprise' as SubscriptionPlan,
      price: 99.99,
      description: t('pricing.enterprise.description'),
      features: [
        t('pricing.enterprise.features.unlimited'),
        t('pricing.enterprise.features.size'),
        t('pricing.enterprise.features.export'),
        t('pricing.enterprise.features.support'),
        t('pricing.enterprise.features.custom'),
        t('pricing.enterprise.features.api'),
        t('pricing.enterprise.features.sla'),
        t('pricing.enterprise.features.dedicated')
      ],
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  const handleSelectPlan = (plan: SubscriptionPlan, amount: number) => {
    setSelectedPlan({ plan, amount });
  };

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

      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white text-center sm:text-6xl">
            {t('pricing.title')}
          </h1>
          <p className="mt-5 text-xl text-gray-500 dark:text-gray-400 text-center">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="relative group">
              <div 
                className={`absolute -inset-0.5 bg-gradient-to-r ${plan.gradient} rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`}
              />
              <div className="relative bg-white dark:bg-gray-800 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                {plan.featured && (
                  <div className="absolute top-0 right-0 -mr-1 -mt-1 w-36 bg-indigo-600 rounded-full transform rotate-12">
                    <div className="text-xs text-white text-center py-1 transform -rotate-12">
                      {t('pricing.popular')}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </h2>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    {plan.description}
                  </p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                      €{plan.price}
                    </span>
                    <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                      {t('pricing.perMonth')}
                    </span>
                  </p>
                  <button
                    onClick={() => handleSelectPlan(plan.plan, plan.price)}
                    className={`mt-8 block w-full py-2 px-4 border rounded-md text-sm font-semibold text-center transition-colors duration-200 ${
                      plan.featured
                        ? 'bg-indigo-600 hover:bg-indigo-700 border-transparent text-white'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                    }`}
                  >
                    {t('pricing.select')}
                  </button>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 dark:text-white tracking-wide uppercase">
                    {t('pricing.features.title')}
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex space-x-3">
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={true}
          onClose={() => setSelectedPlan(null)}
          plan={selectedPlan.plan}
          amount={selectedPlan.amount}
        />
      )}
    </div>
  );
}
