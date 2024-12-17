import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { UserRole, UserStatus } from '../../config/airtable';
import { AlertCircle } from 'lucide-react';

export function OAuthButtons() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signInWithOAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (response: any) => {
    try {
      setError(null);
      const result = await signInWithOAuth('google', response.access_token);
      if (result.user.status === UserStatus.Inactive) {
        navigate('/pricing');
      } else if (result.user.role === UserRole.Admin) {
        navigate('/dashboard');
      } else {
        navigate('/app');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError(t('auth.errors.oauthFailed'));
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    setError(t('auth.errors.oauthFailed'));
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    scope: 'email profile',
    ux_mode: 'popup',
    redirect_uri: import.meta.env.VITE_GOOGLE_AUTHORIZED_ORIGIN + '/oauth/callback'
  });

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/10 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {t('auth.continueWith')}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => {
            setError(null);
            login();
          }}
          className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          {t('auth.continueWithGoogle')}
        </button>
      </div>
    </div>
  );
}
