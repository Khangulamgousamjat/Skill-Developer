import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProfilePageTemplate from '../../components/profile/ProfilePageTemplate';
import { Award, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function StudentProfile() {
  const { t } = useLanguage();
  const { user } = useSelector((s) => s.auth);

  return (
    <DashboardLayout>
      <ProfilePageTemplate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
           <div className="lg:col-span-2">
              {/* Optional: Add learning stats or progress charts here */}
           </div>
           
           <div className="space-y-6">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                 <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-6 font-sora flex items-center gap-2">
                   <Award size={18} className="text-[var(--color-accent)]" />
                   {t('yourBadges') || "Your Badges"}
                 </h2>
                 <div className="grid grid-cols-3 gap-4">
                   {user?.badges?.length > 0 ? (
                     user.badges.map((b, i) => (
                       <div key={i} className="flex flex-col items-center gap-2">
                         <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center text-xl">
                           {b.icon || '🏆'}
                         </div>
                         <span className="text-[9px] text-[var(--color-text-muted)] font-bold text-center leading-tight uppercase">{b.name}</span>
                       </div>
                     ))
                   ) : (
                     <div className="col-span-3 text-center py-6 text-[var(--color-text-muted)] text-xs italic">
                       No badges earned yet.
                     </div>
                   )}
                 </div>
              </div>

              <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
                 <div className="flex justify-between items-start mb-6">
                   <TrendingUp size={24} />
                   <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-1 rounded">Rank #124</span>
                 </div>
                 <h3 className="font-bold font-sora text-lg mb-1">{t('weeklyChallenge') || "Weekly Challenge"}</h3>
                 <p className="text-white/80 text-xs leading-relaxed mb-4">Complete 3 mini-projects this week to earn "Sprint Master" badge.</p>
                 <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-white transition-all duration-1000" />
                 </div>
              </div>
           </div>
        </div>
      </ProfilePageTemplate>
    </DashboardLayout>
  );
}
