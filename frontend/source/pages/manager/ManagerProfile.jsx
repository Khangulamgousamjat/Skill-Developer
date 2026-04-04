import DashboardLayout from '../../components/layout/DashboardLayout';
import ProfilePageTemplate from '../../components/profile/ProfilePageTemplate';
import { Users, BarChart2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ManagerProfile() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <ProfilePageTemplate>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-6 font-sora flex items-center gap-2">
                <Users size={18} className="text-[var(--color-primary)]" />
                {t('teamOverview') || "Team Overview"}
              </h2>
              <div className="space-y-4">
                 <p className="text-[var(--color-text-muted)] text-xs italic">
                   Manage your team members and their progress from the Team tab.
                 </p>
                 <div className="flex gap-4">
                    <div className="flex-1 bg-[var(--color-surface-2)] p-4 rounded-xl border border-[var(--color-border)]">
                       <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Total Members</p>
                       <p className="text-xl font-bold text-[var(--color-text-primary)]">12</p>
                    </div>
                    <div className="flex-1 bg-[var(--color-surface-2)] p-4 rounded-xl border border-[var(--color-border)]">
                       <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Active Projects</p>
                       <p className="text-xl font-bold text-[var(--color-accent)]">5</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <BarChart2 size={24} />
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-1 rounded">Managerial View</span>
              </div>
              <h3 className="font-bold font-sora text-lg mb-1">{t('managerStats') || "Managerial Analytics"}</h3>
              <p className="text-white/80 text-xs leading-relaxed mb-4">View detailed analytics of your department's growth and skill acquisition.</p>
              <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-white/90 transition-all">
                 View Reports
              </button>
           </div>
        </div>
      </ProfilePageTemplate>
    </DashboardLayout>
  );
}
