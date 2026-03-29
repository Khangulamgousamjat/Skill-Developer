import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { AppProvider, useAppContext } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { AllModals } from './components/modals/AllModals';
import { Chatbot } from './components/chatbot/Chatbot';
import { CommandPalette } from './components/ui/CommandPalette';
import { NotificationCenter } from './components/ui/NotificationCenter';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import StudentRegisterPage from './pages/auth/StudentRegisterPage';
import StaffRegisterPage from './pages/auth/StaffRegisterPage';
import OTPVerifyPage from './pages/auth/OTPVerifyPage';
import PendingApprovalPage from './pages/auth/PendingApprovalPage';
import CertificateVerifyPage from './pages/public/CertificateVerifyPage';

// Role-Specific Dashboard Pages
import { SuperAdminDashboard } from './pages/dashboard/SuperAdminDashboard';
import HRAdminDashboard from './pages/dashboard/HRAdminDashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import { ExpertDashboard } from './pages/dashboard/ExpertDashboard';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import MessagesPage from './pages/dashboard/MessagesPage';

// Expert Tools
import ExpertMyLecturesPage from './pages/expert/ExpertMyLecturesPage';
import ExpertResourcesPage from './pages/expert/ExpertResourcesPage';
import ExpertQnAPage from './pages/expert/ExpertQnAPage';

// Student Pages (Phase 3)
import SkillsPage       from './pages/student/SkillsPage';
import ProjectsPage     from './pages/student/ProjectsPage';
import LecturesPage     from './pages/student/LecturesPage';
import ProgressPage     from './pages/student/ProgressPage';
import CertificatesPage from './pages/student/CertificatesPage';

// Admin Pages (Phase 4)
import ApprovalsPage   from './pages/admin/ApprovalsPage';
import UsersPage       from './pages/admin/UsersPage';
import AnalyticsPage   from './pages/admin/AnalyticsPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import { SkillsManagement } from './pages/admin/SkillsManagement';
import SettingsPage    from './pages/admin/SettingsPage';

// HR & Manager Pages (Phase 5)
import InternsPage          from './pages/hr/InternsPage';
import AttendancePage       from './pages/hr/AttendancePage';
import OnboardingPage       from './pages/hr/OnboardingPage';
import IssueCertificatePage from './pages/hr/IssueCertificatePage';
import TeamPage             from './pages/manager/TeamPage';
import EvaluationsPage      from './pages/manager/EvaluationsPage';
import ManagerProjectsPage  from './pages/manager/ManagerProjectsPage';

import { BookOpen, Bell, Command } from 'lucide-react';

// ─── Global CSS injected once ─────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    .glare-hover { position: relative; overflow: hidden; }
    .glare-hover::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(105deg, hsla(0,0%,0%,0) 60%, rgba(255,255,255,0.05) 70%, hsla(0,0%,0%,0) 100%);
      transition: 0.4s ease;
      background-size: 200% 200%, 100% 100%;
      background-repeat: no-repeat;
      background-position: -100% -100%, 0 0;
      z-index: 5;
    }
    .glare-hover:hover::before { background-position: 100% 100%, 0 0; }

    @keyframes blob {
      0%   { transform: translate(0px, 0px) scale(1); }
      33%  { transform: translate(30px, -50px) scale(1.1); }
      66%  { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob { animation: blob 7s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }

    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fade-in 0.3s ease forwards; }
  `}</style>
);

// ─── "Coming Soon" placeholder for unbuilt sub-routes ────────────
const ComingSoon = ({ title = 'Module Coming Soon' }) => {
  const { t, isDarkMode } = useAppContext();
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
      <BookOpen className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-slate-700' : 'text-gray-300'}`} />
      <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>{title}</h2>
      <p className={`mt-2 ${t.textMuted}`}>This section will be built in the next phase.</p>
    </div>
  );
};

// ─── Role-based overview redirect ────────────────────────────────
const RoleDashboardOverview = () => {
  const { role } = useSelector((state) => state.auth);
  switch (role) {
    case 'super_admin': return <SuperAdminDashboard />;
    case 'hr_admin':    return <HRAdminDashboard />;
    case 'manager':     return <ManagerDashboard />;
    case 'expert':      return <ExpertDashboard />;
    default:            return <StudentDashboard />;
  }
};

const DashboardShell = () => {
  const { t, isSidebarOpen, setIsSidebarOpen, isNotifOpen, setIsNotifOpen } = useAppContext();
  const { role } = useSelector((state) => state.auth);

  const showChatbot = role === 'student';

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-500 ${t.bg}`}>
      <GlobalStyles />
      
      {/* Mobile Header Bar */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 border-b flex items-center justify-between px-6 z-[100] ${t.sidebar} backdrop-blur-xl`}>
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-900 font-black text-xs">S</div>
            <span className="text-white font-black text-xs uppercase tracking-widest font-sora">SSLLM Platform</span>
         </div>
         <div className="flex items-center gap-3">
           <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 rounded-xl bg-blue-500/10 text-blue-500 relative">
             <Bell className="w-5 h-5" />
             {notifications.some(n=>!n.read) && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-900 border border-white/20"></span>}
           </button>
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl bg-white/5 text-slate-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
           </button>
         </div>
      </div>

      <Sidebar />
      <div className="flex-1 overflow-auto pt-16 lg:pt-0 relative">
        {/* Desktop Top Nav */}
        <div className={`hidden lg:flex sticky top-0 left-0 right-0 h-20 items-center justify-between px-10 z-40 ${t.bg} backdrop-blur-3xl border-b border-white/5`}>
           <div className="flex items-center gap-8">
              <h2 className={`font-sora font-black text-xl tracking-tight ${t.textMain}`}>Internal <span className="text-amber-500">SSLLM-X</span></h2>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-slate-500 font-black cursor-pointer hover:bg-white/10" onClick={() => setIsCommandPaletteOpen(true)}>
                 <Command className="w-3 h-3" /> CTRL + K
              </div>
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2.5 rounded-2xl relative transition-all ${t.hover} ${isNotifOpen ? 'bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/30' : 'text-slate-400'}`}
              >
                 <Bell className="w-5 h-5" />
                 {notifications.some(n=>!n.read) && <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-slate-900 shadow-xl"></span>}
              </button>
           </div>
        </div>

        <div className="p-8 max-w-6xl mx-auto">
          {/* Nested sub-routes render here */}
          <Routes>
            {/* OVERVIEW - role-specific */}
            <Route index element={<RoleDashboardOverview />} />

            {/* STUDENT routes */}
            <Route path="skills"        element={<SkillsPage />} />
            <Route path="lectures"      element={<LecturesPage />} />
            <Route path="projects"      element={<ProjectsPage />} />
            <Route path="progress"      element={<ProgressPage />} />
            <Route path="certificates"  element={<CertificatesPage />} />

            {/* STAFF: Super Admin routes */}
            <Route path="approvals"     element={<ApprovalsPage />} />
            <Route path="users"         element={<UsersPage />} />
            <Route path="analytics"     element={<AnalyticsPage />} />
            <Route path="departments"   element={<DepartmentsPage />} />
            <Route path="skills-master"  element={<SkillsManagement />} />
            <Route path="settings"      element={<SettingsPage />} />
            {/* STAFF: HR Admin routes */}
            <Route path="interns"       element={<InternsPage />} />
            <Route path="attendance"    element={<AttendancePage />} />
            <Route path="onboarding"    element={<OnboardingPage />} />
            <Route path="issue-certificate" element={<IssueCertificatePage />} />
            
            {/* STAFF: Manager routes */}
            <Route path="team"          element={<TeamPage />} />
            <Route path="evaluations"   element={<EvaluationsPage />} />
            <Route path="manager-projects" element={<ManagerProjectsPage />} />
            <Route path="messages"      element={<MessagesPage />} />

            {/* EXPERT routes */}
            <Route path="expert-lectures" element={<ExpertMyLecturesPage />} />
            <Route path="resources"     element={<ExpertResourcesPage />} />
            <Route path="qna"           element={<ExpertQnAPage />} />


            <Route path="*"             element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>

      <AllModals />
      <CommandPalette />
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      {showChatbot && <Chatbot />}
    </div>
  );
};

// ─── App Routes ───────────────────────────────────────────────────
const AppRoutes = () => {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: '#1E293B', color: '#fff', border: '1px solid #334155' } }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Auth Routes */}
        <Route path="/login"              element={<LoginPage />} />
        <Route path="/register/student"   element={<StudentRegisterPage />} />
        <Route path="/register/staff"     element={<StaffRegisterPage />} />
        <Route path="/verify-email"       element={<OTPVerifyPage />} />
        <Route path="/pending-approval"   element={<PendingApprovalPage />} />
        <Route path="/verify/:code"      element={<CertificateVerifyPage />} />

        {/* Protected Dashboard - with nested routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardShell />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

// ─── Root ─────────────────────────────────────────────────────────
function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;