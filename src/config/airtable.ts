import Airtable from 'airtable';
import { v4 as uuidv4 } from 'uuid';

const airtableApiKey = import.meta.env.VITE_AIRTABLE_PAT;
const airtableBaseId = import.meta.env.VITE_AIRTABLE_BASE_ID;

if (!airtableApiKey || !airtableBaseId) {
  throw new Error('Missing Airtable environment variables');
}

export enum UserRole {
  User = 'User',
  Admin = 'Admin'
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export interface UserRecord extends Airtable.Record<any> {
  fields: {
    userId: string;
    email: string;
    password: string;
    name?: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
  };
}

export interface ToolRecord extends Airtable.Record<any> {
  fields: {
    name: string;
    description: string;
    regexp?: string;
    userId: string;
    isPublic: boolean;
    createdAt: string;
  };
}

export const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);

export const tables = {
  users: base('Users'),
  tools: base('Tools'),
  sessions: base('Sessions')
};

export const usersTable = {
  async create(data: Omit<UserRecord['fields'], 'userId' | 'createdAt'>): Promise<UserRecord> {
    try {
      const userId = uuidv4();
      const records = await tables.users.create([
        {
          fields: {
            userId,
            ...data,
            createdAt: new Date().toISOString()
          }
        }
      ]);
      
      return records[0] as UserRecord;
    } catch (error) {
      throw error;
    }
  },

  async findByEmail(email: string): Promise<UserRecord | null> {
    try {
      const records = await tables.users
        .select({
          filterByFormula: `{email} = '${email}'`
        })
        .firstPage();
      
      return records[0] as UserRecord || null;
    } catch (error) {
      throw error;
    }
  },

  async findById(id: string): Promise<UserRecord | null> {
    try {
      const record = await tables.users.find(id);
      return record as UserRecord;
    } catch (error) {
      return null;
    }
  },

  async update(id: string, data: Partial<Omit<UserRecord['fields'], 'userId' | 'email'>>, currentUser: { id: string; role: UserRole }): Promise<UserRecord> {
    try {
      if (currentUser.role !== UserRole.Admin) {
        throw new Error('Not authorized to update users');
      }

      const userToUpdate = await this.findById(id);
      if (!userToUpdate) {
        throw new Error('User not found');
      }

      const updateData = {
        ...data,
        userId: userToUpdate.fields.userId,
        email: userToUpdate.fields.email
      };

      const records = await tables.users.update([
        {
          id,
          fields: updateData
        }
      ]);
      
      return records[0] as UserRecord;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: string, currentUser: { id: string; role: UserRole }): Promise<void> {
    try {
      if (currentUser.role !== UserRole.Admin) {
        throw new Error('Not authorized to delete users');
      }

      const userToDelete = await this.findById(id);
      if (!userToDelete) {
        throw new Error('User not found');
      }

      if (id === currentUser.id) {
        throw new Error('Cannot delete your own account');
      }

      await tables.users.destroy([id]);
    } catch (error) {
      throw error;
    }
  },

  async list(currentUser: { id: string; role: UserRole }): Promise<UserRecord[]> {
    try {
      if (currentUser.role !== UserRole.Admin) {
        throw new Error('Not authorized to list users');
      }

      const records = await tables.users
        .select({
          sort: [{ field: 'createdAt', direction: 'desc' }]
        })
        .all();
      
      return records as UserRecord[];
    } catch (error) {
      throw error;
    }
  }
};

export const toolsTable = {
  async create(data: Omit<ToolRecord['fields'], 'createdAt'>, userId: string): Promise<ToolRecord> {
    try {
      const records = await tables.tools.create([
        {
          fields: {
            ...data,
            userId,
            createdAt: new Date().toISOString()
          }
        }
      ]);
      
      return records[0] as ToolRecord;
    } catch (error) {
      throw error;
    }
  },

  async list(userId: string, isAdmin: boolean): Promise<ToolRecord[]> {
    try {
      // Make sure to use the exact field name case as defined in Airtable
      const formula = isAdmin 
        ? `OR({userId} = '${userId}', {isPublic} = TRUE())`
        : `OR({userId} = '${userId}', AND({isPublic} = TRUE()))`;
      
      const records = await tables.tools
        .select({
          filterByFormula: formula,
          sort: [{ field: 'createdAt', direction: 'desc' }]
        })
        .all();
      
      return records as ToolRecord[];
    } catch (error) {
      throw error;
    }
  },

  async update(id: string, data: Partial<Omit<ToolRecord['fields'], 'createdAt'>>, userId: string): Promise<ToolRecord> {
    try {
      const tool = await tables.tools.find(id);
      if (!tool) {
        throw new Error('Tool not found');
      }

      if (tool.fields.userId !== userId) {
        throw new Error('Not authorized to update this tool');
      }

      const records = await tables.tools.update([
        {
          id,
          fields: {
            ...data,
            userId // Ensure userId remains unchanged
          }
        }
      ]);

      return records[0] as ToolRecord;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: string, userId: string, isAdmin: boolean): Promise<void> {
    try {
      const tool = await tables.tools.find(id);
      if (!tool) {
        throw new Error('Tool not found');
      }

      if (tool.fields.userId !== userId && !isAdmin) {
        throw new Error('Not authorized to delete this tool');
      }

      await tables.tools.destroy([id]);
    } catch (error) {
      throw error;
    }
  }
};
