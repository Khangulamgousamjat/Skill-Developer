import React from 'react';
import {
  User, Settings, Bot, FileText, Coffee, Users,
  ShieldAlert, BarChart3, LayoutDashboard,
  BookOpen, Video, Briefcase, TrendingUp, Award,
  Laptop2, MessageSquare, UploadCloud,
  CalendarCheck, FileUser, Building2,
  Target, LayoutList, LogOut
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutSuccess } from '../../store/slices/authSlice';

// ─── Role-specific navigation menus ───────────────────────────────
const NAV_CONFIG = {
  super_admin: [
    { id: 'overview',      label: 'Overview',          icon: LayoutDashboard, path: '/dashboard' },
    { id: 'approvals',     label: 'Role Approvals',    icon: ShieldAlert,     path: '/dashboard/approvals' },
    { id: 'users',         label: 'All Users',         icon: Users,           path: '/dashboard/users' },
    { id: 'departments',   label: 'Departments',       icon: Building2,       path: '/dashboard/departments' },
    { id: 'skills',        label: 'Skills Master',      icon: Target,          path: '/dashboard/skills-master' },
    { id: 'analytics',     label: 'Analytics',         icon: BarChart3,       path: '/dashboard/analytics' },
    { id: 'settings',      label: 'Platform Settings', icon: Settings,        path: '/dashboard/settings' },
  ],
  hr_admin: [
    { id: 'overview',      label: 'Overview',          icon: LayoutDashboard, path: '/dashboard' },
    { id: 'interns',       label: 'Intern Directory',  icon: Users,           path: '/dashboard/interns' },
    { id: 'departments',   label: 'Departments',       icon: Building2,       path: '/dashboard/departments' },
    { id: 'attendance',    label: 'Attendance',        icon: CalendarCheck,   path: '/dashboard/attendance' },
    { id: 'onboarding',    label: 'Onboarding',        icon: FileUser,        path: '/dashboard/onboarding' },
    { id: 'issue-certificate', label: 'Issue Credentials', icon: Award,    path: '/dashboard/issue-certificate' },
    { id: 'analytics',     label: 'HR Analytics',      icon: BarChart3,       path: '/dashboard/analytics' },
  ],
  manager: [
    { id: 'overview',      label: 'Overview',          icon: LayoutDashboard, path: '/dashboard' },
    { id: 'projects',      label: 'Projects',          icon: Target,          path: '/dashboard/projects' },
    { id: 'team',          label: 'My Team',           icon: Users,           path: '/dashboard/team' },
    { id: 'evaluations',   label: 'Evaluations',       icon: LayoutList,      path: '/dashboard/evaluations' },
    { id: 'progress',      label: 'Team Progress',     icon: TrendingUp,      path: '/dashboard/progress' },
    { id: 'messages',      label: 'Messages',          icon: MessageSquare,   path: '/dashboard/messages' },
  ],
  expert: [
    { id: 'overview',      label: 'Overview',          icon: LayoutDashboard, path: '/dashboard' },
    { id: 'lectures',      label: 'My Lectures',       icon: Video,           path: '/dashboard/expert-lectures' },
    { id: 'resources',     label: 'Resources',         icon: UploadCloud,     path: '/dashboard/resources' },
    { id: 'qna',           label: 'Q&A Dashboard',     icon: MessageSquare,   path: '/dashboard/qna' },
  ],
  student: [
    { id: 'overview',      label: 'My Dashboard',      icon: LayoutDashboard, path: '/dashboard' },
    { id: 'skills',        label: 'Skill Radar',       icon: Laptop2,         path: '/dashboard/skills' },
    { id: 'lectures',      label: 'Live Lectures',     icon: Video,           path: '/dashboard/lectures' },
    { id: 'projects',      label: 'My Projects',       icon: Briefcase,       path: '/dashboard/projects' },
    { id: 'progress',      label: 'Progress Tracking', icon: TrendingUp,      path: '/dashboard/progress' },
    { id: 'certificates',  label: 'Certificates',      icon: Award,           path: '/dashboard/certificates' },
  ],
};

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  hr_admin: 'HR Administrator',
  manager: 'Manager',
  expert: 'Expert',
  student: 'Student Intern',
};

const ROLE_COLORS = {
  super_admin: 'text-red-400',
  hr_admin: 'text-purple-400',
  manager: 'text-amber-400',
  expert: 'text-blue-400',
  student: 'text-emerald-400',
};

export const Sidebar = () => {
  const {
    isDarkMode, t,
    isSidebarOpen, setIsSidebarOpen,
    setIsSettingsOpen, handleCareerCoach,
    handleGenerateBio, handleStandupPrep, handleOneOnOnePrep
  } = useAppContext();

  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = NAV_CONFIG[role] || NAV_CONFIG['student'];
  const roleLabel = ROLE_LABELS[role] || 'Student Intern';
  const roleColor = ROLE_COLORS[role] || 'text-emerald-400';

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    dispatch(logoutSuccess());
    navigate('/login');
  };

  const handleNav = (path) => {
    navigate(path);
    setIsSidebarOpen(false); // Close on mobile navigation
  };

  // Show student AI toolkit only for students
  const showAIToolkit = role === 'student';

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
        />
      )}

      <div className={`
        w-64 flex flex-col border-r shrink-0 transition-all duration-300
        fixed inset-y-0 left-0 z-[101] lg:static lg:flex
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${t.sidebar}
      `}>
        {/* Logo / Branding */}
        <div className="flex flex-col items-center px-4 py-8 border-b border-white/10 relative">
          <button 
             onClick={() => setIsSidebarOpen(false)}
             className="lg:hidden absolute left-4 top-8 p-1.5 rounded-lg bg-white/5 text-slate-500"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <span className="text-[var(--color-accent)] font-bold text-lg leading-tight text-center font-sora tracking-tight">
            Smart Skill &
          </span>
          <span className="text-[var(--color-accent)] font-bold text-lg leading-tight text-center font-sora tracking-tight">
            Live Learning
          </span>
          <span className="text-white/40 text-[10px] mt-2 text-center font-black uppercase tracking-[3px]">
            Gous org
          </span>
        </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-200 ${
                active
                  ? 'font-semibold shadow-inner border'
                  : `${t.textMuted} ${t.hover}`
              }`}
              style={active ? {
                backgroundColor: 'rgba(244, 161, 0, 0.12)',
                color: '#F4A100',
                borderColor: 'rgba(244, 161, 0, 0.2)',
              } : {}}
            >
              <item.icon
                className="w-4 h-4 mr-3 flex-shrink-0"
                style={active ? { color: '#F4A100' } : {}}
              />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* AI Toolkit (student only) */}
      {showAIToolkit && (
        <div className={`px-3 pb-2 pt-1 border-t ${t.border}`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-1 ${t.textMuted}`}>AI Toolkit</p>
          <div className="grid grid-cols-2 gap-1.5 w-full">
            <button
              onClick={handleCareerCoach}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-md text-[10px] font-semibold transition-colors border shadow-sm text-center ${
                isDarkMode ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/20'
                           : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'}`}
            >
              <Bot className="w-3.5 h-3.5 mb-1" />Career Coach
            </button>
            <button
              onClick={handleGenerateBio}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-md text-[10px] font-semibold transition-colors border shadow-sm text-center ${
                isDarkMode ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/20'
                           : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200'}`}
            >
              <FileText className="w-3.5 h-3.5 mb-1" />LinkedIn Bio
            </button>
            <button
              onClick={handleStandupPrep}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-md text-[10px] font-semibold transition-colors border shadow-sm text-center ${
                isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/20'
                           : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}
            >
              <Coffee className="w-3.5 h-3.5 mb-1" />Daily Standup
            </button>
            <button
              onClick={handleOneOnOnePrep}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-md text-[10px] font-semibold transition-colors border shadow-sm text-center ${
                isDarkMode ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/20'
                           : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'}`}
            >
              <Users className="w-3.5 h-3.5 mb-1" />1-on-1 Prep
            </button>
          </div>
        </div>
      )}

      {/* User Profile Footer */}
      <div className={`p-3 border-t transition-colors duration-500 ${t.border} ${t.profileSection}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0 text-sm"
              style={{ background: 'linear-gradient(135deg, #1E3A5F, #2E5490)' }}
            >
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="ml-2.5 min-w-0">
              <p className={`text-sm font-medium leading-tight truncate ${t.textMain}`}>
                {user?.full_name || 'User'}
              </p>
              <p className={`text-[10px] mt-0.5 font-semibold ${roleColor}`}>{roleLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-1.5 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-800'}`}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className={`p-1.5 rounded-xl transition-all ${isDarkMode ? 'hover:bg-red-500/10 text-slate-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-500'}`}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
