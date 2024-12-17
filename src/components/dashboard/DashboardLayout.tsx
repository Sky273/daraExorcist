import React from 'react';
import { Outlet, Navigate, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { DashboardSidebar } from './DashboardSidebar';
import { Header } from '../Header';
import { Overview } from './Overview';
import { UsersManagement } from './UsersManagement';
import { ToolsManagement } from './ToolsManagement';
import { UserRole } from '../../config/airtable';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  
  if (user?.role !== UserRole.Admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export function DashboardLayout() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route index element={<Overview />} />
              <Route 
                path="users" 
                element={
                  <AdminRoute>
                    <UsersManagement />
                  </AdminRoute>
                } 
              />
              <Route path="tools" element={<ToolsManagement />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
