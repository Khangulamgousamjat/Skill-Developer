import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { applyTheme } from './utils/applyTheme';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
    <div className="w-8 h-8 border-4 rounded-full animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
  </div>
);

// -- AUTH --
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const StudentRegisterPage = lazy(() => import('./pages/auth/StudentRegisterPage'));
const StaffRegisterPage = lazy(() => import('./pages/auth/StaffRegisterPage'));
const OTPVerifyPage = lazy(() => import('./pages/auth/OTPVerifyPage'));
const PendingApprovalPage = lazy(() => import('./pages/auth/PendingApprovalPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));

// -- STUDENT --
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const MySkillGap = lazy(() => import('./pages/student/MySkillGap'));
const MyProjects = lazy(() => import('./pages/student/MyProjects'));
const StudentLectures = lazy(() => import('./pages/student/StudentLectures'));
const LearningPath = lazy(() => import('./pages/student/LearningPath'));
const MyCertificates = lazy(() => import('./pages/student/MyCertificates'));
const StudentMessages = lazy(() => import('./pages/student/StudentMessages'));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'));
const LanguageSection = lazy(() => import('./pages/student/LanguageSection'));
const StudentVideosPage = lazy(() => import('./pages/student/StudentVideosPage'));
const StudyPlanner = lazy(() => import('./pages/student/StudyPlanner'));
const ChatPage = lazy(() => import('./pages/student/ChatPage'));

// -- MANAGER --
const ManagerDashboard = lazy(() => import('./pages/manager/ManagerDashboard'));
const TeamPage = lazy(() => import('./pages/manager/TeamPage'));
const EvaluationsPage = lazy(() => import('./pages/manager/EvaluationsPage'));
const ManagerProjectsPage = lazy(() => import('./pages/manager/ManagerProjectsPage'));
const ManagerLectures = lazy(() => import('./pages/manager/ManagerLectures'));
const SkillHeatMap = lazy(() => import('./pages/manager/SkillHeatMap'));
const ManagerMessages = lazy(() => import('./pages/manager/ManagerMessages'));
const ManagerProfile = lazy(() => import('./pages/manager/ManagerProfile'));

// -- HR --
const HRDashboard = lazy(() => import('./pages/hr/HRDashboard'));
const InternsPage = lazy(() => import('./pages/hr/InternsPage'));
const AttendancePage = lazy(() => import('./pages/hr/AttendancePage'));
const DeptComparison = lazy(() => import('./pages/hr/DeptComparison'));
const HRCertificates = lazy(() => import('./pages/hr/HRCertificates'));
const HREvaluations = lazy(() => import('./pages/hr/HREvaluations'));
const HRMessages = lazy(() => import('./pages/hr/HRMessages'));
const HRProfile = lazy(() => import('./pages/hr/HRProfile'));

// -- TEACHER --
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const TeacherLectures = lazy(() => import('./pages/teacher/TeacherLectures'));
const TeacherResources = lazy(() => import('./pages/teacher/TeacherResources'));
const TeacherVideosPage = lazy(() => import('./pages/teacher/TeacherVideosPage'));
const TeacherQnA = lazy(() => import('./pages/teacher/TeacherQnA'));
const TeacherMessages = lazy(() => import('./pages/teacher/TeacherMessages'));
const TeacherProfile = lazy(() => import('./pages/teacher/TeacherProfile'));

// -- ADMIN --
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ApprovalRequests = lazy(() => import('./pages/admin/ApprovalRequests'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const DepartmentsPage = lazy(() => import('./pages/admin/DepartmentsPage'));
const ManageSkills = lazy(() => import('./pages/admin/ManageSkills'));
const ManageAnnouncements = lazy(() => import('./pages/admin/ManageAnnouncements'));
const AuditTrailPage = lazy(() => import('./pages/admin/AuditTrailPage'));
const AdminCertificates = lazy(() => import('./pages/admin/AdminCertificates'));
const OrgSettings = lazy(() => import('./pages/admin/OrgSettings'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));

// -- PUBLIC/SHARED --
const CertificateVerify = lazy(() => import('./pages/public/CertificateVerify'));
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));
const SettingsPage = lazy(() => import('./pages/shared/SettingsPage'));
const PublicProfile = lazy(() => import('./pages/shared/PublicProfile'));
const Leaderboard = lazy(() => import('./pages/shared/Leaderboard'));
const DepartmentForums = lazy(() => import('./pages/shared/DepartmentForums'));
const HelpBoard = lazy(() => import('./pages/shared/HelpBoard'));

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
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/student/chat" element={<ProtectedRoute allowedRoles={['student']}><ChatPage /></ProtectedRoute>} />
          <Route path="/student/skills" element={<ProtectedRoute allowedRoles={['student']}><MySkillGap /></ProtectedRoute>} />
          <Route path="/student/projects" element={<ProtectedRoute allowedRoles={['student']}><MyProjects /></ProtectedRoute>} />
          <Route path="/student/lectures" element={<ProtectedRoute allowedRoles={['student']}><StudentLectures /></ProtectedRoute>} />
          <Route path="/student/learning-path" element={<ProtectedRoute allowedRoles={['student']}><LearningPath /></ProtectedRoute>} />
          <Route path="/student/certificates" element={<ProtectedRoute allowedRoles={['student']}><MyCertificates /></ProtectedRoute>} />
          <Route path="/student/messages" element={<ProtectedRoute allowedRoles={['student']}><StudentMessages /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
          <Route path="/student/languages" element={<ProtectedRoute allowedRoles={['student']}><LanguageSection /></ProtectedRoute>} />
          <Route path="/student/videos" element={<ProtectedRoute allowedRoles={['student']}><StudentVideosPage /></ProtectedRoute>} />
          <Route path="/student/planner" element={<ProtectedRoute allowedRoles={['student']}><StudyPlanner /></ProtectedRoute>} />
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
      </Suspense>
    </BrowserRouter>
  );
}
