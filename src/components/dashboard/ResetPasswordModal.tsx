import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertCircle, Key } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { usersTable, UserRole } from '../../config/airtable';
import { hashPassword } from '../../utils/password';

interface ResetPasswordModalProps {
  user: {
    id: string;
    email: string;
    name?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onPasswordReset: () => void;
}

export function ResetPasswordModal({ user, isOpen, onClose, onPasswordReset }: ResetPasswordModalProps) {
  const { t } = useTranslation();
  const { user: currentUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async () => {
    if (!currentUser || !user) return;

    try {
      setLoading(true);
      setError(null);

      // Hash the default password "password"
      const hashedPassword = await hashPassword('password');

      // Update user with new password
      await usersTable.update(user.id, {
        password: hashedPassword
      }, {
        id: currentUser.id,
        role: currentUser.role
      });

      onPasswordReset();
      onClose();
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

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
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20 sm:mx-0 sm:h-10 sm:w-10">
              <Key className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                {t('dashboard.userResetPassword')}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('dashboard.userResetPasswordConfirm', { email: user.email })}
                </p>
                <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                  {t('dashboard.userResetPasswordWarning')}
                </p>
              </div>
            </div>
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

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              disabled={loading}
              onClick={handleResetPassword}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {loading ? t('dashboard.userResettingPassword') : t('dashboard.userResetPasswordConfirmButton')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
