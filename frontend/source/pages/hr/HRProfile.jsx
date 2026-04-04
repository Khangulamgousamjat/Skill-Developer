import DashboardLayout from '../../components/layout/DashboardLayout';
import ProfilePageTemplate from '../../components/profile/ProfilePageTemplate';
import { Award, ShieldCheck, Mail } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function HRProfile() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <ProfilePageTemplate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
           <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-6 font-sora flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                {t('hrResponsibilities') || "HR Administrative Overview"}
              </h2>
              <div className="space-y-4">
                 <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                   As an HR Admin, you oversee the recruitment, certification, and evaluation processes for all departments.
                 </p>
                 <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)]">
                       <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest">Total Interns</p>
                       <p className="text-2xl font-bold font-sora text-[var(--color-primary)]">240</p>
                    </div>
                    <div className="p-4 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)]">
                       <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest">Pending Evals</p>
                       <p className="text-2xl font-bold font-sora text-rose-500">18</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <Award size={24} />
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-1 rounded">HR Verified</span>
              </div>
              <h3 className="font-bold font-sora text-lg mb-1">{t('hrCertification') || "Certificate Issuance"}</h3>
              <p className="text-white/80 text-xs leading-relaxed mb-4">You have the authority to issue and verify certificates for completed modules.</p>
              <button className="w-full py-2 bg-white text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                 <Mail size={14} /> Open Cert Portal
              </button>
           </div>
        </div>
      </ProfilePageTemplate>
    </DashboardLayout>
  );
}
