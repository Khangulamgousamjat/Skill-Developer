import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutSuccess as logout } from '../../store/slices/authSlice';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Users, BookOpen, FolderOpen,
  Award, MessageSquare, User, Settings, Bell,
  ChevronLeft, ChevronRight, LogOut, Sun, Moon,
  BarChart2, Target, CheckSquare, Megaphone,
  ClipboardList, Building2, Lightbulb, GraduationCap,
  Menu, X, Trophy, AlertCircle
} from 'lucide-react';
import { setTheme } from '../../store/slices/uiSlice';
import { applyTheme } from '../../utils/applyTheme';
import { useLanguage } from '../../contexts/LanguageContext';
import ChatBot from '../chatbot/ChatBot';
import ProfileCompletionModal from '../modals/ProfileCompletionModal';

const NAV_KEYS_ROLES = {
  student: [
    { labelKey: 'dashboard',      icon: LayoutDashboard, path: '/student/dashboard' },
    { labelKey: 'skillGap',       icon: Target,          path: '/student/skills' },
    { labelKey: 'myProjects',    icon: FolderOpen,      path: '/student/projects' },
    { labelKey: 'lectures',       icon: BookOpen,        path: '/student/lectures' },
    { labelKey: 'learningPath',  icon: Lightbulb,       path: '/student/learning-path' },
    { labelKey: 'certificates',   icon: Award,           path: '/student/certificates' },
    { labelKey: 'leaderboard',    icon: Trophy,          path: '/leaderboard' },
    { labelKey: 'forum',          icon: MessageSquare,   path: '/forums' },
    { labelKey: 'helpBoard',      icon: AlertCircle,     path: '/help-board' },
    { labelKey: 'messages',       icon: MessageSquare,   path: '/student/messages' },
    { labelKey: 'profile',        icon: User,            path: '/student/profile' },
    { labelKey: 'settings',       icon: Settings,        path: '/student/settings' },
  ],
  manager: [
    { labelKey: 'dashboard',      icon: LayoutDashboard, path: '/manager/dashboard' },
    { labelKey: 'teamProgress',  icon: BarChart2,       path: '/manager/team' },
    { labelKey: 'projects',       icon: FolderOpen,      path: '/manager/projects' },
    { labelKey: 'lectures',       icon: BookOpen,        path: '/manager/lectures' },
    { labelKey: 'skillHeatMap', icon: Target,          path: '/manager/skills' },
    { labelKey: 'messages',       icon: MessageSquare,   path: '/manager/messages' },
    { labelKey: 'profile',        icon: User,            path: '/manager/profile' },
    { labelKey: 'settings',       icon: Settings,        path: '/manager/settings' },
  ],
  hr_admin: [
    { labelKey: 'dashboard',      icon: LayoutDashboard, path: '/hr/dashboard' },
    { labelKey: 'allInterns',    icon: Users,           path: '/hr/interns' },
    { labelKey: 'deptComparison',icon: BarChart2,       path: '/hr/departments' },
    { labelKey: 'certificates',   icon: Award,           path: '/hr/certificates' },
    { labelKey: 'evaluations',    icon: ClipboardList,   path: '/hr/evaluations' },
    { labelKey: 'messages',       icon: MessageSquare,   path: '/hr/messages' },
    { labelKey: 'profile',        icon: User,            path: '/hr/profile' },
    { labelKey: 'settings',       icon: Settings,        path: '/hr/settings' },
  ],
  teacher: [
    { labelKey: 'teacherDashboard', icon: LayoutDashboard, path: '/teacher/dashboard' },
    { labelKey: 'myLectures',      icon: BookOpen,        path: '/teacher/lectures' },
    { labelKey: 'resources',       icon: FolderOpen,      path: '/teacher/resources' },
    { labelKey: 'qna',             icon: MessageSquare,   path: '/teacher/qna' },
    { labelKey: 'messages',        icon: MessageSquare,   path: '/teacher/messages' },
    { labelKey: 'profile',         icon: User,            path: '/teacher/profile' },
    { labelKey: 'settings',        icon: Settings,        path: '/teacher/settings' },
  ],
  super_admin: [
    { labelKey: 'dashboard',      icon: LayoutDashboard, path: '/admin/dashboard' },
    { labelKey: 'approvals',      icon: CheckSquare,     path: '/admin/approvals' },
    { labelKey: 'users',          icon: Users,           path: '/admin/users' },
    { labelKey: 'departments',    icon: Building2,       path: '/admin/departments' },
    { labelKey: 'skills',         icon: Target,          path: '/admin/skills' },
    { labelKey: 'certificates',   icon: Award,           path: '/admin/certificates' },
    { labelKey: 'announcements',  icon: Megaphone,       path: '/admin/announcements' },
    { labelKey: 'systemLogs',    icon: ClipboardList,   path: '/admin/logs' },
    { labelKey: 'orgSettings',   icon: Settings,        path: '/admin/settings' },
    { labelKey: 'profile',        icon: User,            path: '/admin/profile' },
  ],
};

export default function DashboardLayout({ children }) {
  const { t } = useLanguage();
  const { user } = useSelector((s) => s.auth);
  const { theme } = useSelector((s) => s.ui);
  const { unreadCount } = useSelector((s) => s.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = NAV_KEYS_ROLES[user?.role] || [];

  const handleLogout = async () => {
    try { await axiosInstance.post('/auth/logout'); } catch {}
    dispatch(logout());
    navigate('/login');
    toast.success(t('logoutSuccess') || 'Logged out successfully');
  };

  const handleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(next));
    applyTheme(next);
    localStorage.setItem('ssllm_theme', next);
  };

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--color-sidebar-bg)] border-r border-[var(--color-border)]">
      {/* Logo */}
      <div className={`px-4 py-8 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
        {collapsed ? (
          <div className="flex justify-center">
            <span className="text-[var(--color-accent)] font-bold text-xl font-sora">SS</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className={`${theme === 'dark' ? 'text-[var(--color-accent)]' : 'text-[var(--color-primary)]'} font-bold text-lg leading-tight text-center font-sora tracking-tight`}>
              Smart Skill &
            </span>
            <span className={`${theme === 'dark' ? 'text-[var(--color-accent)]' : 'text-[var(--color-primary)]'} font-bold text-lg leading-tight text-center font-sora tracking-tight`}>
              Live Learning
            </span>
            <span className={`${theme === 'dark' ? 'text-white/40' : 'text-slate-400'} text-[10px] mt-2 text-center font-black uppercase tracking-[3px]`}>
              Gous org
            </span>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5
                rounded-lg transition-all duration-200 text-sm font-medium
                ${active
                  ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold border border-[var(--color-accent)]/20'
                  : 'text-[var(--color-sidebar-text)] hover:bg-black/5 dark:hover:bg-white/5'
                }
              `}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="truncate">{t(item.labelKey)}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-2 py-3 border-t border-[var(--color-border)]">
          <div className={`flex items-center gap-3 px-3 py-2 mb-2 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2E5490]
                            flex items-center justify-center shrink-0 shadow-lg shadow-black/10">
              <span className="text-white text-xs font-bold font-sora">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[var(--color-sidebar-text)] text-sm font-bold truncate leading-tight">
                {user?.full_name || 'User'}
              </p>
              <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${user?.role === 'student' ? 'text-emerald-500' : 'text-[var(--color-accent)]'}`}>
                {(user?.role || 'student').replace('_', ' ')}
              </p>
            </div>
          </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2
                     text-[var(--color-text-muted)] hover:text-red-500
                     hover:bg-red-500/10 rounded-lg
                     transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          {!collapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className={`${theme} flex h-screen bg-[var(--color-bg)] overflow-hidden font-sans text-[var(--color-text-primary)]`}>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 z-20 shadow-lg ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 shadow-xl z-10 transition-transform bg-[var(--color-surface)] border-r border-[var(--color-border)]">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-6
                           bg-[var(--color-surface)] border-b border-[var(--color-border)] z-10 shadow-sm relative">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/50"
                    onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <button className="hidden md:flex p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/50"
                    onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <span className="font-sora font-semibold text-sm hidden sm:block">
              {user?.full_name ? `${t('welcome')}, ${user.full_name.split(' ')[0]}!` : t('appTitle')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleTheme} className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/50 transition-all" title={t('toggleTheme')}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="relative p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/50"
                    onClick={() => navigate(`/${user?.role === 'super_admin' ? 'admin' : user?.role?.replace('_admin','')}/messages`)}>
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--color-danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--color-surface)]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <div className="w-9 h-9 ml-2 rounded-full bg-[var(--color-primary)] flex items-center justify-center cursor-pointer border-2 border-[var(--color-border)] shadow-sm"
                 onClick={() => navigate(`/${user?.role === 'super_admin' ? 'admin' : user?.role?.replace('_admin','')}/profile`)}>
              <span className="text-white text-xs font-bold">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* AI Chatbot - Student Only */}
        {user?.role === 'student' && <ChatBot />}

        {/* Global Profile Completion Check */}
        {!user?.is_profile_completed && <ProfileCompletionModal />}
      </div>
    </div>
  );
}

