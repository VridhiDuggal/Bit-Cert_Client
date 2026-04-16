import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RBACRoute } from './RBACRoute';
import { RecipientProtectedRoute } from './RecipientProtectedRoute';
import { Loader } from '../components/ui/Loader';

const LandingPage             = lazy(() => import('../pages/Landing/LandingPage'));
const OrgDashboard            = lazy(() => import('../pages/Org/OrgDashboard'));
const Recipients               = lazy(() => import('../pages/Org/Recipients'));
const Certificates             = lazy(() => import('../pages/Org/Certificates'));
const AuditLogs                = lazy(() => import('../pages/Org/AuditLogs'));
const CertificateDetail        = lazy(() => import('../pages/Org/CertificateDetail'));
const OrgSettings              = lazy(() => import('../pages/Org/OrgSettings'));
const OrgVerify                = lazy(() => import('../pages/Org/OrgVerify'));
const AcceptInvite             = lazy(() => import('../pages/AcceptInvite'));
const VerifyPage               = lazy(() => import('../pages/VerifyPage'));
const VerifyLandingPage        = lazy(() => import('../pages/VerifyLandingPage'));
const RecipientDashboard       = lazy(() => import('../pages/Recipient/RecipientDashboard'));
const RecipientCertificates    = lazy(() => import('../pages/Recipient/RecipientCertificates'));
const RecipientCertificateDetail = lazy(() => import('../pages/Recipient/RecipientCertificateDetail'));
const RecipientNotifications   = lazy(() => import('../pages/Recipient/RecipientNotifications'));
const RecipientSettings        = lazy(() => import('../pages/Recipient/RecipientSettings'));

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
    <Loader size="lg" />
  </div>
);

function OrgRoute({ children }) {
  return (
    <ProtectedRoute>
      <RBACRoute allowedRoles={['org']}>
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </RBACRoute>
    </ProtectedRoute>
  );
}

function RecipientRoute({ children }) {
  return (
    <RecipientProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </RecipientProtectedRoute>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <LandingPage />
            </Suspense>
          }
        />
        <Route path="/org/dashboard"          element={<OrgRoute><OrgDashboard /></OrgRoute>} />
        <Route path="/org/recipients"         element={<OrgRoute><Recipients /></OrgRoute>} />
        <Route path="/org/certificates"       element={<OrgRoute><Certificates /></OrgRoute>} />
        <Route path="/org/issue"              element={<Navigate to="/org/certificates" replace />} />
        <Route path="/org/audit-logs"         element={<OrgRoute><AuditLogs /></OrgRoute>} />
        <Route path="/org/certificate/:id"    element={<OrgRoute><CertificateDetail /></OrgRoute>} />
        <Route path="/org/settings"           element={<OrgRoute><OrgSettings /></OrgRoute>} />
        <Route path="/org/verify"             element={<OrgRoute><OrgVerify /></OrgRoute>} />
        <Route
          path="/accept-invite"
          element={<Suspense fallback={<PageLoader />}><AcceptInvite /></Suspense>}
        />
        <Route
          path="/verify"
          element={<Suspense fallback={<PageLoader />}><VerifyLandingPage /></Suspense>}
        />
        <Route
          path="/verify/:cert_hash"
          element={<Suspense fallback={<PageLoader />}><VerifyPage /></Suspense>}
        />
        <Route path="/recipient/dashboard"         element={<RecipientRoute><RecipientDashboard /></RecipientRoute>} />
        <Route path="/recipient/certificates"      element={<RecipientRoute><RecipientCertificates /></RecipientRoute>} />
        <Route path="/recipient/certificate/:id"   element={<RecipientRoute><RecipientCertificateDetail /></RecipientRoute>} />
        <Route path="/recipient/notifications"     element={<RecipientRoute><RecipientNotifications /></RecipientRoute>} />
        <Route path="/recipient/settings"          element={<RecipientRoute><RecipientSettings /></RecipientRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
