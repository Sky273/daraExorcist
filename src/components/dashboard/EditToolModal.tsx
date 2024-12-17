import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { AnonymizationTool } from '../../store/useDataStore';
import { toolsTable } from '../../config/airtable';

interface EditToolModalProps {
  tool: AnonymizationTool;
  isOpen: boolean;
  onClose: () => void;
  onToolUpdated: () => void;
}

export function EditToolModal({ tool, isOpen, onClose, onToolUpdated }: EditToolModalProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: tool.name,
    description: tool.description,
    regexp: tool.regexp || '',
    isPublic: tool.isPublic || false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !tool.id) return;

    try {
      setLoading(true);
      setError(null);

      // Validate regexp
      if (!formData.regexp) {
        throw new Error(t('dashboard.tools.errors.regexpRequired'));
      }

      // Update tool
      await toolsTable.update(tool.id, {
        ...formData,
        userId: user.id
      }, user.id);

      onToolUpdated();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update tool');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                {t('dashboard.tools.edit')}
              </h3>

              {error && (
                <div className="mt-2 rounded-md bg-red-50 dark:bg-red-900/10 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('dashboard.toolName')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('dashboard.toolDescription')}
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="regexp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('dashboard.toolRegexp')}
                  </label>
                  <input
                    type="text"
                    id="regexp"
                    required
                    value={formData.regexp}
                    onChange={(e) => setFormData(prev => ({ ...prev, regexp: e.target.value }))}
                    placeholder="e.g., \d{4}-\d{4}"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t('dashboard.toolRegexpHelp')}
                  </p>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="isPublic"
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isPublic" className="font-medium text-gray-700 dark:text-gray-300">
                      {t('dashboard.toolIsPublic')}
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">{t('dashboard.toolIsPublicHelp')}</p>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {loading ? t('common.saving') : t('common.save')}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}