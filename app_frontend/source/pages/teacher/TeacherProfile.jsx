import DashboardLayout from '../../components/layout/DashboardLayout';
import ProfilePageTemplate from '../../components/profile/ProfilePageTemplate';
import { BookOpen, Users, Video } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TeacherProfile() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <ProfilePageTemplate>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-6 font-sora flex items-center gap-2">
                <Video size={18} className="text-[var(--color-primary)]" />
                {t('TeacherActivity') || "Teacher Teaching Activity"}
              </h2>
              <div className="space-y-4">
                 <p className="text-[var(--color-text-muted)] text-xs italic">
                   Manage your lectures and interact with students through the Teacher Console.
                 </p>
                 <div className="flex gap-4">
                    <div className="flex-1 bg-[var(--color-surface-2)] p-4 rounded-xl border border-[var(--color-border)]">
                       <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest">Live Sessions</p>
                       <p className="text-xl font-bold text-[var(--color-text-primary)]">24</p>
                    </div>
                    <div className="flex-1 bg-[var(--color-surface-2)] p-4 rounded-xl border border-[var(--color-border)]">
                       <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest">Students Mentored</p>
                       <p className="text-xl font-bold text-[var(--color-accent)]">148</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
              <div className="flex justify-between items-start mb-6">
                <BookOpen size={24} />
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-1 rounded">Verified Instructor</span>
              </div>
              <h3 className="font-bold font-sora text-lg mb-1">{t('teachingStats') || "Learning Analytics"}</h3>
              <p className="text-white/80 text-xs leading-relaxed mb-4">Analyze the engagement levels for each of your recorded sessions and lectures.</p>
              <button className="px-4 py-2 bg-white text-[var(--color-primary)] rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-white/90 transition-all flex items-center gap-2">
                 <Users size={14} /> View Student Feedback
              </button>
           </div>
        </div>
      </ProfilePageTemplate>
    </DashboardLayout>
  );
}
