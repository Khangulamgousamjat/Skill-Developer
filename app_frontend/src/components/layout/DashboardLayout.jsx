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
  Menu, X
} from 'lucide-react';
import { setTheme } from '../../store/slices/uiSlice';
import { applyTheme } from '../../utils/applyTheme';
import { useLanguage } from '../../contexts/LanguageContext';
import AIChatbot from '../shared/AIChatbot';

const NAV_KEYS_ROLES = {
  student: [
    { labelKey: 'dashboard',      icon: LayoutDashboard, path: '/student/dashboard' },
    { labelKey: 'skillGap',       icon: Target,          path: '/student/skills' },
    { labelKey: 'myProjects',    icon: FolderOpen,      path: '/student/projects' },
    { labelKey: 'lectures',       icon: BookOpen,        path: '/student/lectures' },
    { labelKey: 'learningPath',  icon: Lightbulb,       path: '/student/learning-path' },
    { labelKey: 'certificates',   icon: Award,           path: '/student/certificates' },
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
  expert: [
    { labelKey: 'dashboard',      icon: LayoutDashboard, path: '/expert/dashboard' },
    { labelKey: 'myLectures',    icon: BookOpen,        path: '/expert/lectures' },
    { labelKey: 'resources',      icon: FolderOpen,      path: '/expert/resources' },
    { labelKey: 'qna',            icon: MessageSquare,   path: '/expert/qna' },
    { labelKey: 'messages',       icon: MessageSquare,   path: '/expert/messages' },
    { labelKey: 'profile',        icon: User,            path: '/expert/profile' },
    { labelKey: 'settings',       icon: Settings,        path: '/expert/settings' },
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
      <div className="px-4 py-5 border-b border-[var(--color-border)]">
        {collapsed ? (
          <div className="flex justify-center">
            <span className="text-[var(--color-accent)] font-bold text-lg font-sora">SS</span>
          </div>
        ) : (
          <div>
            <p className="text-[var(--color-accent)] font-bold font-sora text-sm leading-tight">
              {t('brandTitleShort')}
            </p>
            <p className="text-white font-bold font-sora text-xs leading-tight mt-0.5">
              {t('brandTitleLong')}
            </p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-1.5 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]"></span>
              {t('orgName')}
            </p>
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
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--color-primary)]'
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
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]
                            flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[var(--color-text-primary)] text-xs font-semibold truncate">
                {user?.full_name || 'User'}
              </p>
              <p className="text-[var(--color-text-muted)] text-xs truncate capitalize">
                {(user?.role || 'student').replace('_', ' ')}
              </p>
            </div>
          </div>
        )}
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
        {user?.role === 'student' && <AIChatbot />}
      </div>
    </div>
  );
}
