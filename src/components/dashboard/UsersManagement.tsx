import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { usersTable, UserRole, UserStatus } from '../../config/airtable';
import { EditUserModal } from './EditUserModal';
import { AddUserModal } from './AddUserModal';
import { ResetPasswordModal } from './ResetPasswordModal';
import { Pencil, Trash2, UserPlus, AlertCircle, Key } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  status: UserStatus;
}

export function UsersManagement() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);

  const loadUsers = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      
      const records = await usersTable.list({
        id: currentUser.id,
        role: currentUser.role
      });
      
      setUsers(records.map(record => ({
        id: record.id,
        email: record.fields.email,
        name: record.fields.name,
        role: record.fields.role,
        status: record.fields.status
      })));
    } catch (error) {
      console.error('Error loading users:', error);
      setError(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === UserRole.Admin) {
      loadUsers();
    }
  }, [currentUser]);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      
      await usersTable.delete(userId, {
        id: currentUser.id,
        role: currentUser.role
      });
      
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (user: User) => {
    setResetPasswordUser(user);
  };

  if (!currentUser || currentUser.role !== UserRole.Admin) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">
          Not authorized to access user management
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.usersTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {t('dashboard.usersDescription')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {t('dashboard.userAddNew')}
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

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t('dashboard.userLoading')}</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                        {t('dashboard.userName')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        {t('dashboard.userEmail')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        {t('dashboard.userRole')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        {t('dashboard.userStatus')}
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">{t('dashboard.userActions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                          {user.name || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.role === UserRole.Admin 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                          }`}>
                            {user.role === UserRole.Admin ? t('dashboard.userRoleAdmin') : t('dashboard.userRoleUser')}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.status === UserStatus.Active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          }`}>
                            {user.status === UserStatus.Active ? t('dashboard.userStatusActive') : t('dashboard.userStatusInactive')}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleResetPassword(user)}
                              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                              title={t('dashboard.userResetPassword')}
                            >
                              <Key className="h-4 w-4" />
                              <span className="sr-only">{t('dashboard.userResetPassword')}</span>
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">{t('common.edit')}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">{t('common.delete')}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={true}
          onClose={() => setEditingUser(null)}
          onUserUpdated={loadUsers}
        />
      )}

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={loadUsers}
      />

      <ResetPasswordModal
        user={resetPasswordUser}
        isOpen={!!resetPasswordUser}
        onClose={() => setResetPasswordUser(null)}
        onPasswordReset={loadUsers}
      />
    </div>
  );
}
