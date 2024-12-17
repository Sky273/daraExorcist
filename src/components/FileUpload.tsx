import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { processFile } from '../utils/fileProcessing';
import { useDataStore } from '../store/useDataStore';
import { useTranslation } from 'react-i18next';

export function FileUpload() {
  const { t } = useTranslation();
  const { setData, setColumns } = useDataStore();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setError(null);
      const file = acceptedFiles[0];
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File size exceeds 50MB limit');
      }

      const { data, columns } = await processFile(file);
      
      // Validate data
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No valid data found in file');
      }

      if (!columns || !Array.isArray(columns) || columns.length === 0) {
        throw new Error('No valid columns found in file');
      }

      setData(data);
      setColumns(columns);
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'Failed to process file');
    }
  }, [setData, setColumns]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
          ${isDragActive 
            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' 
            : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600'
          }
          ${error ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className={`h-12 w-12 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        <p className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          {isDragActive ? t('mainApp.upload.dropzone.active') : t('mainApp.upload.dropzone.inactive')}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('mainApp.upload.dropzone.or')}
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {t('mainApp.upload.formats')}
        </p>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-md bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
