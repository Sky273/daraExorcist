import React, { useEffect, useState } from 'react';
import { useDataStore, AnonymizationTool } from '../../store/useDataStore';
import { Plus, Trash2, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CustomTools() {
  const { t } = useTranslation();
  const { savedTools, loadCustomTools, saveCustomTool, deleteCustomTool, loading, error } = useDataStore();
  const [isAddingTool, setIsAddingTool] = useState(false);
  const [newTool, setNewTool] = useState<Partial<AnonymizationTool>>({
    name: '',
    description: '',
    type: 'text',
    method: 'mask'
  });

  useEffect(() => {
    loadCustomTools();
  }, [loadCustomTools]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTool.name || !newTool.description || !newTool.type || !newTool.method) return;

    await saveCustomTool({
      ...newTool as AnonymizationTool,
      userId: 'current-user-id' // Replace with actual user ID
    });
    setIsAddingTool(false);
    setNewTool({ name: '', description: '', type: 'text', method: 'mask' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Wrench className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('dashboard.customTools')}
          </h2>
        </div>
        <button
          onClick={() => setIsAddingTool(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('dashboard.addTool')}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {isAddingTool && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('dashboard.toolName')}
              </label>
              <input
                type="text"
                value={newTool.name}
                onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('dashboard.toolDescription')}
              </label>
              <textarea
                value={newTool.description}
                onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('dashboard.toolType')}
                </label>
                <select
                  value={newTool.type}
                  onChange={(e) => setNewTool({ ...newTool, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="date">Date</option>
                  <option value="number">Number</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('dashboard.toolMethod')}
                </label>
                <select
                  value={newTool.method}
                  onChange={(e) => setNewTool({ ...newTool, method: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="mask">Mask</option>
                  <option value="fake">Fake</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingTool(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {savedTools.map((tool) => (
          <div
            key={tool.id}
            className="relative group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{tool.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tool.description}</p>
              </div>
              <button
                onClick={() => tool.id && deleteCustomTool(tool.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{tool.type}</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{tool.method}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
