import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Shield, Wrench } from 'lucide-react';

export function Overview() {
  const { t } = useTranslation();

  const stats = [
    {
      name: t('dashboard.stats.filesProcessed'),
      value: '2,345',
      icon: FileText,
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: t('dashboard.stats.dataAnonymized'),
      value: '1.2M',
      icon: Shield,
      change: '+23%',
      changeType: 'positive'
    },
    {
      name: t('dashboard.stats.customTools'),
      value: '15',
      icon: Wrench,
      change: '+4',
      changeType: 'positive'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        {t('dashboard.overview')}
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative bg-white dark:bg-gray-800 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className="absolute bg-indigo-500 rounded-md p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {/* Activity items would go here */}
            <li className="text-sm text-gray-500 dark:text-gray-400">
              No recent activity
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
