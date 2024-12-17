import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Shield, Mail, Lock, AlertCircle, User, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserRole, UserStatus } from '../../config/airtable';
import { OAuthButtons } from './OAuthButtons';

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, signUp, loading, error, clearError } = useAuthStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    try {
      if (isSignUp) {
        if (!email || !password) {
          setFormError('Please fill in all required fields');
          return;
        }
        await signUp(email, password, name);
        // New users are inactive, redirect to pricing
        navigate('/pricing');
      } else {
        if (!email || !password) {
          setFormError('Please enter your email and password');
          return;
        }
        await signIn(email, password);
        const user = useAuthStore.getState().user;
        
        if (user) {
          if (user.status === UserStatus.Inactive) {
            // Inactive users go to pricing
            navigate('/pricing');
          } else if (user.role === UserRole.Admin) {
            // Only admin users can access dashboard
            navigate('/dashboard');
          } else {
            // Active non-admin users go to main app
            navigate('/app');
          }
        }
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    clearError();
    setFormError(null);
    setEmail('');
    setPassword('');
    setName('');
  };

  const displayError = formError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        to="/" 
        className="absolute top-4 left-4 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">{t('nav.backToHome')}</span>
      </Link>

      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isSignUp ? t('auth.signUp') : t('auth.signIn')}
          </h2>
        </div>

        {displayError && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/10 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  {displayError}
                </h3>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="sr-only">
                  {t('auth.name')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required={isSignUp}
                    className="appearance-none rounded-t-md relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                    placeholder={t('auth.name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800 ${
                    isSignUp ? '' : 'rounded-t-md'
                  }`}
                  placeholder={t('auth.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  className="appearance-none rounded-b-md relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                  placeholder={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('auth.processing') : (isSignUp ? t('auth.signUp') : t('auth.signIn'))}
            </button>
          </div>

          <OAuthButtons />

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.noAccount')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
