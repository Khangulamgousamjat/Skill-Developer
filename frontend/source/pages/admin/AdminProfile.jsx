import DashboardLayout from '../../components/layout/DashboardLayout';
import ProfilePageTemplate from '../../components/profile/ProfilePageTemplate';
import { ShieldAlert, Activity, Settings } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AdminProfile() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <ProfilePageTemplate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
           <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-6 font-sora flex items-center gap-2">
                <ShieldAlert size={18} className="text-rose-500" />
                {t('superAdminControl') || "Super Admin Privilege Overview"}
              </h2>
              <div className="space-y-4">
                 <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                   As a Super Admin, you have full control over the organizational workspace, including department creation, user management, and system logs.
                 </p>
                 <div className="flex gap-4 pt-4">
                    <div className="flex-1 p-4 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)]">
                       <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest">Total Users</p>
                       <p className="text-2xl font-bold font-sora text-[var(--color-primary)]">1,402</p>
                    </div>
                    <div className="flex-1 p-4 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)]">
                       <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest">System Health</p>
                       <p className="text-2xl font-bold font-sora text-emerald-500">99.9%</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-500/20">
              <div className="flex justify-between items-start mb-6">
                <Activity size={24} />
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-1 rounded">Admin Privilege</span>
              </div>
              <h3 className="font-bold font-sora text-lg mb-1">{t('adminSettings') || "Organization Settings"}</h3>
              <p className="text-white/80 text-xs leading-relaxed mb-4">Access critical system configurations and audit logs from the Control Center.</p>
              <button className="w-full py-2 bg-white text-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                 <Settings size={14} /> System Console
              </button>
           </div>
        </div>
      </ProfilePageTemplate>
    </DashboardLayout>
  );
}
