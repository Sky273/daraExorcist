import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wrench, Plus, Settings, Trash2, AlertCircle } from 'lucide-react';
import { useDataStore, AnonymizationTool } from '../../store/useDataStore';
import { AddToolModal } from './AddToolModal';
import { EditToolModal } from './EditToolModal';
import { DeleteToolModal } from './DeleteToolModal';

export function ToolsManagement() {
  const { t } = useTranslation();
  const { savedTools, loadCustomTools, deleteCustomTool } = useDataStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AnonymizationTool | null>(null);
  const [deleteToolData, setDeleteToolData] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    loadCustomTools();
  }, [loadCustomTools]);

  const handleEditClick = (tool: AnonymizationTool) => {
    setEditingTool(tool);
  };

  const handleDeleteClick = (tool: AnonymizationTool) => {
    if (tool.id) {
      setDeleteToolData({ id: tool.id, name: tool.name });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteToolData) return;
    
    try {
      setLoading(true);
      await deleteCustomTool(deleteToolData.id);
      setDeleteToolData(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.toolsTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {t('dashboard.toolsDescription')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('dashboard.addTool')}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/10 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {savedTools.map((tool) => (
          <div
            key={tool.id}
            className="relative group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wrench className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {tool.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {tool.description}
                </p>
              </div>
            </div>
            <div className="mt-4">
              {tool.regexp && (
                <div className="mt-2">
                  <code className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                    {tool.regexp}
                  </code>
                </div>
              )}
            </div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                type="button"
                onClick={() => handleEditClick(tool)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Edit tool</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClick(tool)}
                className="p-2 rounded-full text-red-400 hover:text-red-500 dark:hover:text-red-300"
              >
                <Trash2 className="h-5 w-5" />
                <span className="sr-only">Delete tool</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddToolModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {editingTool && (
        <EditToolModal
          tool={editingTool}
          isOpen={true}
          onClose={() => setEditingTool(null)}
          onToolUpdated={loadCustomTools}
        />
      )}

      <DeleteToolModal
        isOpen={!!deleteToolData}
        toolName={deleteToolData?.name || ''}
        onClose={() => setDeleteToolData(null)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
    </div>
  );
}
