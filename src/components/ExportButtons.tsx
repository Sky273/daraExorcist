import React from 'react';
import { FileDown, Database } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { exportToCSV, exportToExcel, exportToSQL } from '../utils/exportData';
import { useTranslation } from 'react-i18next';

export function ExportButtons() {
  const { t } = useTranslation();
  const { data, columns } = useDataStore();

  if (!data.length) return null;

  return (
    <div className="mt-8 flex justify-end space-x-4">
      <button
        onClick={() => exportToCSV(data, columns)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <FileDown className="h-4 w-4 mr-2" />
        Export CSV
      </button>
      <button
        onClick={() => exportToExcel(data, columns)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <FileDown className="h-4 w-4 mr-2" />
        Export Excel
      </button>
      <button
        onClick={() => exportToSQL(data, columns)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Database className="h-4 w-4 mr-2" />
        Export SQL
      </button>
    </div>
  );
}
