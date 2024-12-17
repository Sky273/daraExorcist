import React, { useState, useEffect } from 'react';
import { useDataStore } from '../store/useDataStore';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { anonymizationMethods } from '../utils/anonymization';

const DATA_TYPES = [
  'text', 'email', 'phone', 'date', 'number', 'website',
  'city', 'country', 'company', 'ssn', 'zipcode',
  'firstName', 'lastName', 'fullName'
];

export function DataPreview() {
  const { t } = useTranslation();
  const { data, columns, toggleColumnAnonymization, setColumns, savedTools, loadCustomTools } = useDataStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [previewKey, setPreviewKey] = useState(0); // Add key for forcing refresh

  useEffect(() => {
    const loadTools = async () => {
      setIsLoading(true);
      try {
        await loadCustomTools();
      } catch (error) {
        console.error('Error loading custom tools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTools();
  }, [loadCustomTools]);

  if (isLoading || !data.length) return null;

  const totalPages = Math.ceil(data.length / 10);
  const startIndex = (currentPage - 1) * 10;
  const endIndex = Math.min(startIndex + 10, data.length);

  const anonymizeValue = (value: any, column: any) => {
    if (!column.shouldAnonymize) return value;
    
    // If it's a specific tool
    if (column.toolId) {
      const tool = savedTools.find(t => t.id === column.toolId);
      if (tool) {
        if (column.anonymizationMethod === 'mask') {
          return '*'.repeat(String(value).length);
        } else if (tool.regexp) {
          try {
            const regex = new RegExp(tool.regexp);
            return String(value).replace(regex, match => '*'.repeat(match.length));
          } catch {
            return '*'.repeat(String(value).length);
          }
        }
      }
    }

    // Otherwise use built-in methods
    const method = column.anonymizationMethod || 'mask';
    const methodDef = anonymizationMethods[column.type]?.find(m => m.name === method);
    return methodDef ? methodDef.apply(value) : '****';
  };

  const getAvailableTypes = () => {
    const publicTools = savedTools.filter(tool => tool.isPublic);

    return [
      ...DATA_TYPES.map(type => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        isSpecific: false
      })),
      ...publicTools.map(tool => ({
        value: `tool-${tool.id}`,
        label: tool.name,
        isSpecific: true,
        tool
      }))
    ];
  };

  const handleTypeChange = (columnName: string, newType: string) => {
    setColumns(columns.map(col => {
      if (col.name === columnName) {
        if (newType.startsWith('tool-')) {
          const toolId = newType.replace('tool-', '');
          const tool = savedTools.find(t => t.id === toolId);
          if (tool) {
            return {
              ...col,
              type: 'specific',
              toolId,
              anonymizationMethod: 'mask'
            };
          }
        }

        return {
          ...col,
          type: newType,
          toolId: undefined,
          anonymizationMethod: anonymizationMethods[newType]?.[0]?.name || 'mask'
        };
      }
      return col;
    }));
    setPreviewKey(prev => prev + 1); // Force refresh
  };

  const handleAnonymizationMethodChange = (columnName: string, method: string) => {
    setColumns(columns.map(col => {
      if (col.name === columnName) {
        return {
          ...col,
          anonymizationMethod: method
        };
      }
      return col;
    }));
    setPreviewKey(prev => prev + 1); // Force refresh
  };

  const availableTypes = getAvailableTypes();

  return (
    <div className="mt-8" key={previewKey}>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.name}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{column.name}</span>
                      <button
                        onClick={() => {
                          toggleColumnAnonymization(column.name);
                          setPreviewKey(prev => prev + 1); // Force refresh
                        }}
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        title={column.shouldAnonymize ? t('mainApp.preview.hideAnonymization') : t('mainApp.preview.showAnonymization')}
                      >
                        {column.shouldAnonymize ? (
                          <EyeOff className="h-4 w-4 text-indigo-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {column.shouldAnonymize && (
                      <div className="flex items-center">
                        <select
                          value={column.toolId ? `tool-${column.toolId}` : column.type}
                          onChange={(e) => handleTypeChange(column.name, e.target.value)}
                          className="w-full text-xs rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <optgroup label="Built-in Types">
                            {availableTypes
                              .filter(type => !type.isSpecific)
                              .map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                          </optgroup>
                          {availableTypes.some(type => type.isSpecific) && (
                            <optgroup label="Custom Tools">
                              {availableTypes
                                .filter(type => type.isSpecific)
                                .map(type => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                            </optgroup>
                          )}
                        </select>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.slice(startIndex, endIndex).map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {columns.map((column) => (
                  <td key={column.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anonymizeValue(row[column.name], column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          {t('mainApp.preview.showing', {
            start: startIndex + 1,
            end: endIndex,
            total: data.length
          })}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
            {t('mainApp.preview.page', {
              current: currentPage,
              total: totalPages
            })}
          </span>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
