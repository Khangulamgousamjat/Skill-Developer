import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { applyTheme } from './utils/applyTheme';

// -- AUTH --
import LoginPage from './pages/auth/LoginPage';
import StudentRegisterPage from './pages/auth/StudentRegisterPage';
import StaffRegisterPage from './pages/auth/StaffRegisterPage';
import OTPVerifyPage from './pages/auth/OTPVerifyPage';
import PendingApprovalPage from './pages/auth/PendingApprovalPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// -- STUDENT --
import StudentDashboard from './pages/student/StudentDashboard';
import MySkillGap from './pages/student/MySkillGap';
import MyProjects from './pages/student/MyProjects';
import StudentLectures from './pages/student/StudentLectures';
import LearningPath from './pages/student/LearningPath';
import MyCertificates from './pages/student/MyCertificates';
import StudentMessages from './pages/student/StudentMessages';
import StudentProfile from './pages/student/StudentProfile';
import LanguageSection from './pages/student/LanguageSection';
import StudentVideosPage from './pages/student/StudentVideosPage';

// -- MANAGER --
import ManagerDashboard from './pages/manager/ManagerDashboard';
import TeamPage from './pages/manager/TeamPage';
import EvaluationsPage from './pages/manager/EvaluationsPage';
import ManagerProjectsPage from './pages/manager/ManagerProjectsPage';
import ManagerLectures from './pages/manager/ManagerLectures';
import SkillHeatMap from './pages/manager/SkillHeatMap';
import ManagerMessages from './pages/manager/ManagerMessages';
import ManagerProfile from './pages/manager/ManagerProfile';

// -- HR --
import HRDashboard from './pages/hr/HRDashboard';
import InternsPage from './pages/hr/InternsPage';
import AttendancePage from './pages/hr/AttendancePage';
import DeptComparison from './pages/hr/DeptComparison';
import HRCertificates from './pages/hr/HRCertificates';
import HREvaluations from './pages/hr/HREvaluations';
import HRMessages from './pages/hr/HRMessages';
import HRProfile from './pages/hr/HRProfile';

// -- TEACHER --
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherLectures from './pages/teacher/TeacherLectures';
import TeacherResources from './pages/teacher/TeacherResources';
import TeacherVideosPage from './pages/teacher/TeacherVideosPage';
import TeacherQnA from './pages/teacher/TeacherQnA';
import TeacherMessages from './pages/teacher/TeacherMessages';
import TeacherProfile from './pages/teacher/TeacherProfile';

// -- ADMIN --
import AdminDashboard from './pages/admin/AdminDashboard';
import ApprovalRequests from './pages/admin/ApprovalRequests';
import UsersPage from './pages/admin/UsersPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import ManageSkills from './pages/admin/ManageSkills';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import AuditTrailPage from './pages/admin/AuditTrailPage';
import AdminCertificates from './pages/admin/AdminCertificates';
import OrgSettings from './pages/admin/OrgSettings';
import AdminProfile from './pages/admin/AdminProfile';

// -- PUBLIC/SHARED --
import CertificateVerify from './pages/public/CertificateVerify';
import LandingPage from './pages/public/LandingPage';
import NotFoundPage from './pages/public/NotFoundPage';
import SettingsPage from './pages/shared/SettingsPage';
import PublicProfile from './pages/shared/PublicProfile';
import Leaderboard from './pages/shared/Leaderboard';
import DepartmentForums from './pages/shared/DepartmentForums';
import HelpBoard from './pages/shared/HelpBoard';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/login" replace />;
  return children;
}

function DashboardRedirect() {
  const { user } = useSelector((s) => s.auth);
  const homes = {
    super_admin: '/admin/dashboard',
    hr_admin: '/hr/dashboard',
    manager: '/manager/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
  };
  return <Navigate to={homes[user?.role] || '/login'} replace />;
}

export default function App() {
  const theme = useSelector((s) => s.ui.theme);
  useEffect(() => { applyTheme(theme); }, [theme]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ 
        style: { background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '12px' } 
      }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/register/student" element={<StudentRegisterPage />} />
        <Route path="/auth/register/staff" element={<StaffRegisterPage />} />
        <Route path="/auth/verify-email" element={<OTPVerifyPage />} />
        <Route path="/auth/pending" element={<PendingApprovalPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify/:code" element={<CertificateVerify />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/skills" element={<ProtectedRoute allowedRoles={['student']}><MySkillGap /></ProtectedRoute>} />
        <Route path="/student/projects" element={<ProtectedRoute allowedRoles={['student']}><MyProjects /></ProtectedRoute>} />
        <Route path="/student/lectures" element={<ProtectedRoute allowedRoles={['student']}><StudentLectures /></ProtectedRoute>} />
        <Route path="/student/learning-path" element={<ProtectedRoute allowedRoles={['student']}><LearningPath /></ProtectedRoute>} />
        <Route path="/student/certificates" element={<ProtectedRoute allowedRoles={['student']}><MyCertificates /></ProtectedRoute>} />
        <Route path="/student/messages" element={<ProtectedRoute allowedRoles={['student']}><StudentMessages /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/languages" element={<ProtectedRoute allowedRoles={['student']}><LanguageSection /></ProtectedRoute>} />
        <Route path="/student/videos" element={<ProtectedRoute allowedRoles={['student']}><StudentVideosPage /></ProtectedRoute>} />
        <Route path="/student/settings" element={<ProtectedRoute allowedRoles={['student']}><SettingsPage /></ProtectedRoute>} />

        {/* Manager */}
        <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/manager/team" element={<ProtectedRoute allowedRoles={['manager']}><TeamPage /></ProtectedRoute>} />
        <Route path="/manager/projects" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProjectsPage /></ProtectedRoute>} />
        <Route path="/manager/evaluation" element={<ProtectedRoute allowedRoles={['manager']}><EvaluationsPage /></ProtectedRoute>} />
        <Route path="/manager/lectures" element={<ProtectedRoute allowedRoles={['manager']}><ManagerLectures /></ProtectedRoute>} />
        <Route path="/manager/skills" element={<ProtectedRoute allowedRoles={['manager']}><SkillHeatMap /></ProtectedRoute>} />
        <Route path="/manager/messages" element={<ProtectedRoute allowedRoles={['manager']}><ManagerMessages /></ProtectedRoute>} />
        <Route path="/manager/profile" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProfile /></ProtectedRoute>} />
        <Route path="/manager/approvals" element={<ProtectedRoute allowedRoles={['manager']}><ApprovalRequests /></ProtectedRoute>} />
        <Route path="/manager/settings" element={<ProtectedRoute allowedRoles={['manager']}><SettingsPage /></ProtectedRoute>} />

        {/* HR */}
        <Route path="/hr/dashboard" element={<ProtectedRoute allowedRoles={['hr_admin']}><HRDashboard /></ProtectedRoute>} />
        <Route path="/hr/attendance" element={<ProtectedRoute allowedRoles={['hr_admin']}><AttendancePage /></ProtectedRoute>} />
        <Route path="/hr/interns" element={<ProtectedRoute allowedRoles={['hr_admin']}><InternsPage /></ProtectedRoute>} />
        <Route path="/hr/departments" element={<ProtectedRoute allowedRoles={['hr_admin']}><DeptComparison /></ProtectedRoute>} />
        <Route path="/hr/certificates" element={<ProtectedRoute allowedRoles={['hr_admin']}><HRCertificates /></ProtectedRoute>} />
        <Route path="/hr/evaluations" element={<ProtectedRoute allowedRoles={['hr_admin']}><HREvaluations /></ProtectedRoute>} />
        <Route path="/hr/messages" element={<ProtectedRoute allowedRoles={['hr_admin']}><HRMessages /></ProtectedRoute>} />
        <Route path="/hr/profile" element={<ProtectedRoute allowedRoles={['hr_admin']}><HRProfile /></ProtectedRoute>} />
        <Route path="/hr/settings" element={<ProtectedRoute allowedRoles={['hr_admin']}><SettingsPage /></ProtectedRoute>} />

        {/* Teacher */}
        <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/lectures" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherLectures /></ProtectedRoute>} />
        <Route path="/teacher/resources" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherResources /></ProtectedRoute>} />
        <Route path="/teacher/videos" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherVideosPage /></ProtectedRoute>} />
        <Route path="/teacher/qna" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherQnA /></ProtectedRoute>} />
        <Route path="/teacher/messages" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherMessages /></ProtectedRoute>} />
        <Route path="/teacher/profile" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherProfile /></ProtectedRoute>} />
        <Route path="/teacher/settings" element={<ProtectedRoute allowedRoles={['teacher']}><SettingsPage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/approvals" element={<ProtectedRoute allowedRoles={['super_admin']}><ApprovalRequests /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['super_admin']}><UsersPage /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['super_admin']}><DepartmentsPage /></ProtectedRoute>} />
        <Route path="/admin/skills" element={<ProtectedRoute allowedRoles={['super_admin']}><ManageSkills /></ProtectedRoute>} />
        <Route path="/admin/certificates" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminCertificates /></ProtectedRoute>} />
        <Route path="/admin/announcements" element={<ProtectedRoute allowedRoles={['super_admin']}><ManageAnnouncements /></ProtectedRoute>} />
        <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['super_admin']}><AuditTrailPage /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['super_admin']}><OrgSettings /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminProfile /></ProtectedRoute>} />

        {/* Shared */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/forums" element={<ProtectedRoute><DepartmentForums /></ProtectedRoute>} />
        <Route path="/help-board" element={<ProtectedRoute><HelpBoard /></ProtectedRoute>} />

        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
