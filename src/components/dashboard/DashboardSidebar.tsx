import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Users, Wrench, FileText, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../config/airtable';

const getNavigation = (isAdmin: boolean) => [
  { name: 'dashboard.overview', href: '/dashboard', icon: Shield },
  ...(isAdmin ? [{ name: 'dashboard.users', href: '/dashboard/users', icon: Users }] : []),
  { name: 'dashboard.toolsSection', href: '/dashboard/tools', icon: Wrench },
  { name: 'dashboard.files', href: '/dashboard/files', icon: FileText },
  { name: 'dashboard.settings', href: '/dashboard/settings', icon: Settings }
];

export function DashboardSidebar() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.Admin;
  const navigation = getNavigation(isAdmin);

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              DataGuard
            </span>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`
                }
              >
                <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                {t(item.name)}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
