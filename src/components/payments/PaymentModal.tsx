import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CreditCard, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useSubscriptionStore, SubscriptionPlan } from '../../store/useSubscriptionStore';
import { useAuthStore } from '../../store/useAuthStore';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!STRIPE_PUBLIC_KEY) {
  throw new Error('Missing Stripe public key');
}

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// Price IDs from your Stripe Dashboard
const PLAN_PRICE_IDS = {
  starter: 'prod_RH4ZSdwz2KvQix',
  professional: 'price_1QOWQeCTzeA7efhgxIbkSxQT', 
  enterprise: 'price_1QOWQeCTzeA7efhgxIbkSxQT'
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  amount: number;
}

export function PaymentModal({ isOpen, onClose, plan, amount }: PaymentModalProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{
          price: PLAN_PRICE_IDS[plan],
          quantity: 1
        }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/pricing`,
        customerEmail: user.email
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/20 sm:mx-0 sm:h-10 sm:w-10">
              <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                {t('payment.title')}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('payment.description', { plan, amount: amount.toFixed(2) })}
                </p>
              </div>

              {error && (
                <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/10 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('payment.processing')}
                    </div>
                  ) : (
                    t('payment.subscribe', { amount: amount.toFixed(2) })
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
