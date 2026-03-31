import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/auth/LoginPage';
import StudentRegisterPage from './pages/auth/StudentRegisterPage';
import StaffRegisterPage from './pages/auth/StaffRegisterPage';
import OTPVerifyPage from './pages/auth/OTPVerifyPage';
import PendingApprovalPage from './pages/auth/PendingApprovalPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const ManagerDashboard = lazy(() => import('./pages/manager/ManagerDashboard'));
const HRDashboard      = lazy(() => import('./pages/hr/HRDashboard'));
const ExpertDashboard  = lazy(() => import('./pages/expert/ExpertDashboard'));
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Optional: check user.account_status again here if it might change silently.
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // If not allowed, redirect to their own dash based on role
    const roleMap = {
      super_admin: '/admin/dashboard',
      hr_admin: '/hr/dashboard',
      manager: '/manager/dashboard',
      expert: '/expert/dashboard',
      student: '/student/dashboard'
    };
    return <Navigate to={roleMap[user.role] || '/login'} replace />;
  }

  return children;
}

export default function App() {
  const { theme } = useSelector((state) => state.ui);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: theme === 'dark' ? '!bg-gray-800 !text-white' : '',
        }}
      />
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
          <div className="w-10 h-10 border-4 rounded-full animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
        </div>
      }>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/register/student" element={<StudentRegisterPage />} />
          <Route path="/auth/register/staff" element={<StaffRegisterPage />} />
          <Route path="/auth/verify-email" element={<OTPVerifyPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

          {/* Pending Approval (Authenticated but not active) */}
          <Route path="/auth/pending" element={
            <ProtectedRoute>
               <PendingApprovalPage />
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={
            <ProtectedRoute allowedRoles={['manager', 'super_admin']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />

          {/* HR Routes */}
          <Route path="/hr/dashboard" element={
            <ProtectedRoute allowedRoles={['hr_admin', 'super_admin']}>
              <HRDashboard />
            </ProtectedRoute>
          } />

          {/* Expert Routes */}
          <Route path="/expert/dashboard" element={
            <ProtectedRoute allowedRoles={['expert', 'super_admin']}>
              <ExpertDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Placeholder/Sub-routes to prevent 404s */}
          <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/manager/*" element={<ProtectedRoute allowedRoles={['manager', 'super_admin']}><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/hr/*" element={<ProtectedRoute allowedRoles={['hr_admin', 'super_admin']}><HRDashboard /></ProtectedRoute>} />
          <Route path="/expert/*" element={<ProtectedRoute allowedRoles={['expert', 'super_admin']}><ExpertDashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminDashboard /></ProtectedRoute>} />

          {/* Catch All 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)]">
               <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-4">404</h1>
               <p className="text-[var(--color-text-muted)] mb-6">Page Not Found</p>
               <button 
                  onClick={() => window.history.back()} 
                  className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg">
                  Go Back
               </button>
            </div>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}