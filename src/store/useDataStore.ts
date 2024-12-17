import { create } from 'zustand';
import { tables, toolsTable } from '../config/airtable';
import { useAuthStore } from './useAuthStore';
import { anonymizationMethods } from '../utils/anonymization';

export interface Column {
  name: string;
  type: string;
  shouldAnonymize: boolean;
  anonymizationMethod?: string;
  toolId?: string;
}

export interface AnonymizationTool {
  id?: string;
  name: string;
  description: string;
  type: string;
  method: string;
  regexp?: string;
  userId: string;
  createdAt?: string;
  isPublic?: boolean;
}

interface DataState {
  data: any[];
  columns: Column[];
  savedTools: AnonymizationTool[];
  loading: boolean;
  error: string | null;
  setData: (data: any[]) => void;
  setColumns: (columns: Column[]) => void;
  toggleColumnAnonymization: (columnName: string) => void;
  setAnonymizationMethod: (columnName: string, method: string) => void;
  getAvailableMethods: (columnType: string) => { name: string; description: string; isCustom?: boolean; toolId?: string }[];
  saveCustomTool: (tool: Omit<AnonymizationTool, 'id' | 'createdAt'>) => Promise<void>;
  loadCustomTools: () => Promise<void>;
  deleteCustomTool: (id: string) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  data: [],
  columns: [],
  savedTools: [],
  loading: false,
  error: null,
  setData: (data) => set({ data }),
  setColumns: (columns) => {
    const columnsWithDefaults = columns.map(col => ({
      ...col,
      anonymizationMethod: col.anonymizationMethod || 
        (anonymizationMethods[col.type]?.[0]?.name || 'mask')
    }));
    set({ columns: columnsWithDefaults });
  },
  toggleColumnAnonymization: (columnName) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.name === columnName
          ? { 
              ...col, 
              shouldAnonymize: !col.shouldAnonymize,
              anonymizationMethod: !col.shouldAnonymize 
                ? (anonymizationMethods[col.type]?.[0]?.name || 'mask')
                : col.anonymizationMethod
            }
          : col
      ),
    })),
  setAnonymizationMethod: (columnName, method) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.name === columnName
          ? { ...col, anonymizationMethod: method }
          : col
      ),
    })),
  getAvailableMethods: (columnType: string) => {
    const defaultMethods = anonymizationMethods[columnType] || [];
    const { savedTools } = get();
    const customTools = savedTools
      .filter(tool => tool.type === columnType)
      .map(tool => ({
        name: tool.method,
        description: tool.description,
        isCustom: true,
        toolId: tool.id
      }));

    return [
      ...defaultMethods.map(method => ({
        name: method.name,
        description: method.description
      })),
      ...customTools
    ];
  },
  saveCustomTool: async (tool) => {
    try {
      set({ loading: true, error: null });
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (tool.method === 'custom' && tool.regexp) {
        try {
          new RegExp(tool.regexp);
        } catch (error) {
          throw new Error('Invalid regular expression');
        }
      }

      const record = await toolsTable.create({
        ...tool,
        isPublic: false
      }, user.id);

      set((state) => ({
        savedTools: [...state.savedTools, { ...tool, id: record.id }]
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to save tool' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  loadCustomTools: async () => {
    try {
      set({ loading: true, error: null });
      const { user } = useAuthStore.getState();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const records = await toolsTable.list(user.id, user.role === 'Admin');
      const tools = records.map(record => ({
        id: record.id,
        ...record.fields
      })) as AnonymizationTool[];

      set({ savedTools: tools });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load tools' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteCustomTool: async (id) => {
    try {
      set({ loading: true, error: null });
      const { user } = useAuthStore.getState();

      if (!user) {
        throw new Error('User not authenticated');
      }

      await toolsTable.delete(id, user.id, user.role === 'Admin');
      
      set((state) => ({
        savedTools: state.savedTools.filter(tool => tool.id !== id)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete tool' });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));
