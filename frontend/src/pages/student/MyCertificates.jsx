import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Award, Download, ExternalLink, Loader2, ShieldCheck, Star, Zap, Globe, Cpu, Lock, Terminal, Box } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../api/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const BADGES = [
  { id: 1, title: 'Kernel Architect', icon: Cpu, color: 'from-blue-500 to-indigo-700', desc: 'Node.js Core Mastery' },
  { id: 2, title: 'UI Synthesis Lead', icon: Globe, color: 'from-emerald-400 to-teal-600', desc: 'Frontend Architecture' },
  { id: 3, title: 'Security Sentinel', icon: Lock, color: 'from-rose-500 to-orange-600', desc: 'Protocol Defense' },
  { id: 4, title: 'Tactical Deployer', icon: Box, color: 'from-amber-400 to-orange-500', desc: 'CI/CD Orchestration' },
];

export default function MyCertificates() {
  const { t } = useLanguage();
  const { user } = useSelector(state => state.auth);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('student_id', user.id)
        .order('issued_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (err) {
      toast.error('Failed to sync credentials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-16 pb-20 animate-in fade-in duration-700">
        
        {/* Header Unit */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] tracking-tight">Achievement Vault</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1.5 font-medium">Synchronize and verify your technical synthesis milestones</p>
          </div>
          <div className="flex items-center gap-4 bg-[var(--color-surface-2)] p-2 pr-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
             <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary)]/20">
                <Award size={24} />
             </div>
             <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Verified Assets</p>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">{certificates.length} Credentials</p>
             </div>
          </div>
        </div>

        {/* SECTION 1: BADGE CABINET (Premium Gamification) */}
        <div className="space-y-8">
           <div className="flex items-center gap-4">
              <Star className="text-amber-500" size={24} fill="currentColor" />
              <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Technical Badge Cabinet</h2>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {BADGES.map((badge, idx) => (
                <motion.div 
                  key={badge.id}
                  whileHover={{ y: -10, rotateY: 5 }}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-8 text-center shadow-sm relative group overflow-hidden"
                >
                   <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                   <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-white shadow-2xl relative z-10 group-hover:scale-110 transition-transform`}>
                      <badge.icon size={32} />
                   </div>
                   <h3 className="text-sm font-bold text-[var(--color-text-primary)] mt-6 mb-2 font-sora tracking-tight">{badge.title}</h3>
                   <p className="text-[10px] text-[var(--color-text-muted)] font-medium">{badge.desc}</p>
                   <div className="mt-4 flex justify-center">
                     <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/10">
                       Active
                     </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* SECTION 2: VERIFIED CERTIFICATES */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <ShieldCheck className="text-indigo-500" size={24} />
             <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Validated Credentials</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
               <div className="w-14 h-14 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin shadow-xl" />
               <p className="text-[10px] font-black uppercase tracking-[3px] text-[var(--color-text-muted)]">Verifying Digital Signatures...</p>
            </div>
          ) : certificates.length === 0 ? (
            <div className="bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-border)] rounded-[48px] p-24 text-center shadow-inner group">
              <div className="w-20 h-20 bg-[var(--color-surface-2)] rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform shadow-xl">
                 <Terminal size={32} className="text-[var(--color-text-muted)] opacity-20" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] font-sora mb-3">No Credentials Found</h2>
              <p className="text-[var(--color-text-muted)] max-w-sm mx-auto mb-10 font-medium">Complete courses and technical modules to generate your verified certifications.</p>
              <a href="/student/projects" className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-primary)] text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-[var(--color-primary)]/20 active:scale-95 transition-all">
                <Zap size={18} /> Explore Training Modules
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {certificates.map((cert, idx) => (
                <motion.div 
                  key={cert.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[48px] overflow-hidden shadow-sm hover:shadow-2xl hover:border-[var(--color-primary)]/20 transition-all flex flex-col"
                >
                  {/* Holographic Certificate Preview Card */}
                  <div className="aspect-[1.5/1] bg-gradient-to-br from-[#1E293B] to-[#0F172A] flex items-center justify-center p-12 relative overflow-hidden">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent)]" />
                     <div className="absolute inset-6 border border-white/10 rounded-3xl pointer-events-none" />
                     <ShieldCheck className="text-white opacity-5 absolute inset-0 m-auto w-40 h-40 group-hover:scale-125 transition-transform duration-1000" />
                     <div className="text-center relative z-10">
                        <Award size={64} className="text-amber-400 mx-auto mb-6 drop-shadow-[0_10px_20px_rgba(251,191,36,0.3)] group-hover:rotate-12 transition-transform" />
                        <h3 className="font-bold text-white font-sora text-lg leading-tight tracking-tight">{cert.title}</h3>
                        <p className="text-[9px] font-black text-indigo-400 mt-3 uppercase tracking-[0.4em] mb-2">{cert.certificate_type || 'Professional Synthesis'}</p>
                        <div className="h-1 w-12 bg-indigo-500 mx-auto rounded-full mt-4" />
                     </div>
                  </div>

                  <div className="p-8 space-y-8 flex-1 flex flex-col text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-1 opacity-50">Issued Data Hub</p>
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">{new Date(cert.issued_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-1 opacity-50">Verification Protocol</p>
                        <p className="text-[10px] font-mono font-bold text-indigo-500">{cert.verification_code}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 mt-auto">
                      <a 
                        href={cert.pdf_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-lg transition-all border border-[var(--color-border)]"
                      >
                        <Download size={16} />
                        Download PDF
                      </a>
                      <a 
                        href={`/verify/${cert.verification_code}`} 
                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-[var(--color-primary)] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[var(--color-primary)]/20"
                      >
                        <ExternalLink size={16} />
                        External Verify
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

