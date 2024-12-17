import React, { useState } from 'react';
import { Shield, Menu, X, Info } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { AboutModal } from './AboutModal';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../config/airtable';

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleStartClick = () => {
    if (user) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  // Don't show navigation items on the landing page
  const isLandingPage = location.pathname === '/';

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <Shield className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {t('app.title')}
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
              {isLandingPage ? (
                <>
                  <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                    {t('nav.features')}
                  </a>
                  <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                    {t('nav.howItWorks')}
                  </a>
                </>
              ) : null}
              {user && (
                <>
                  <Link 
                    to="/app" 
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
                  >
                    {t('nav.mainApp')}
                  </Link>
                  {user.role === UserRole.Admin && (
                    <Link 
                      to="/dashboard" 
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
                    >
                      {t('nav.dashboard')}
                    </Link>
                  )}
                </>
              )}
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
                aria-label="About"
              >
                <Info className="h-5 w-5" />
              </button>
              <LanguageToggle />
              <ThemeToggle />
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
                  >
                    {t('auth.signOut')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartClick}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t('nav.getStarted')}
                </button>
              )}
            </div>
            <div className="flex items-center sm:hidden">
              <LanguageToggle />
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {isLandingPage && (
                  <>
                    <a
                      href="#features"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {t('nav.features')}
                    </a>
                    <a
                      href="#how-it-works"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {t('nav.howItWorks')}
                    </a>
                  </>
                )}
                {user && (
                  <>
                    <Link
                      to="/app"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {t('nav.mainApp')}
                    </Link>
                    {user.role === UserRole.Admin && (
                      <Link
                        to="/dashboard"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {t('nav.dashboard')}
                      </Link>
                    )}
                  </>
                )}
                {user ? (
                  <>
                    <span className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300">
                      {user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {t('auth.signOut')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartClick}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                  >
                    {t('nav.getStarted')}
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
}
