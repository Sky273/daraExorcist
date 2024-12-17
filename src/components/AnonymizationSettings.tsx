import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDataStore } from '../store/useDataStore';
import { Settings } from 'lucide-react';
import { anonymizationMethods } from '../utils/anonymization';

export function AnonymizationSettings() {
  const { t } = useTranslation();
  const { columns, setColumns, savedTools } = useDataStore();
  const selectedColumns = columns.filter(col => col.shouldAnonymize);

  if (selectedColumns.length === 0) return null;

  const handleMethodChange = (columnName: string, method: string) => {
    setColumns(columns.map(col => {
      if (col.name === columnName) {
        return {
          ...col,
          anonymizationMethod: method
        };
      }
      return col;
    }));
  };

  const getMethodsForColumn = (column: any) => {
    // If it's a specific tool
    if (column.toolId) {
      const tool = savedTools.find(t => t.id === column.toolId);
      if (tool) {
        return [
          {
            name: 'mask',
            description: t('anonymization.tools.mask.description')
          },
          {
            name: tool.name,
            description: tool.description,
            isCustom: true
          }
        ];
      }
    }

    // Otherwise, return built-in methods for this type
    return anonymizationMethods[column.type] || [];
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('anonymization.settings')}
        </h3>
      </div>

      <div className="space-y-8">
        {selectedColumns.map((column) => {
          const methods = getMethodsForColumn(column);
          const tool = column.toolId ? savedTools.find(t => t.id === column.toolId) : null;
          
          return (
            <div key={column.name} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {column.name}
                  </span>
                  {tool && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      (Using {tool.name})
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {methods.map((method) => (
                  <button
                    key={method.name}
                    onClick={() => handleMethodChange(column.name, method.name)}
                    className={`relative p-4 text-sm rounded-lg transition-colors ${
                      column.anonymizationMethod === method.name
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-200 dark:border-indigo-800'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {method.description}
                    </p>
                    {column.anonymizationMethod === method.name && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
