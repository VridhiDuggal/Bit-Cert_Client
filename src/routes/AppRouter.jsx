import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RBACRoute } from './RBACRoute';

const LandingPage = lazy(() => import('../pages/Landing/LandingPage'));
const OrgDashboard = lazy(() => import('../pages/Org/OrgDashboard'));
const Recipients = lazy(() => import('../pages/Org/Recipients'));
const Certificates = lazy(() => import('../pages/Org/Certificates'));
const IssueCertificate = lazy(() => import('../pages/Org/IssueCertificate'));
const AuditLogs = lazy(() => import('../pages/Org/AuditLogs'));

function OrgRoute({ children }) {
  return (
    <ProtectedRoute>
      <RBACRoute allowedRoles={['org']}>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </RBACRoute>
    </ProtectedRoute>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <LandingPage />
            </Suspense>
          }
        />
        <Route path="/org/dashboard"    element={<OrgRoute><OrgDashboard /></OrgRoute>} />
        <Route path="/org/recipients"   element={<OrgRoute><Recipients /></OrgRoute>} />
        <Route path="/org/certificates" element={<OrgRoute><Certificates /></OrgRoute>} />
        <Route path="/org/issue"        element={<OrgRoute><IssueCertificate /></OrgRoute>} />
        <Route path="/org/audit-logs"   element={<OrgRoute><AuditLogs /></OrgRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
