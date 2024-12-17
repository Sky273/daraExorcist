import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { LandingPage } from './components/LandingPage';
import { MainApp } from './components/MainApp';
import { PricingPage } from './components/pricing/PricingPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfSale } from './components/TermsOfSale';
import { LegalNotice } from './components/LegalNotice';
import { PaymentSuccess } from './components/payments/PaymentSuccess';
import { PaymentCancel } from './components/payments/PaymentCancel';
import { useAuthStore } from './store/useAuthStore';
import { UserRole, UserStatus } from './config/airtable';

function ProtectedRoute({ children, requiresAdmin = false }: { children: React.ReactNode, requiresAdmin?: boolean }) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.status === UserStatus.Inactive) {
    return <Navigate to="/pricing" replace />;
  }

  if (requiresAdmin && user.role !== UserRole.Admin) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/app" /> : <LoginForm />} 
        />
        <Route 
          path="/pricing" 
          element={<PricingPage />} 
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfSale />} />
        <Route path="/legal" element={<LegalNotice />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route 
          path="/app/*" 
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute requiresAdmin>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
