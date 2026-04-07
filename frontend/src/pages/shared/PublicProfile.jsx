import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../api/supabase';
import { 
   Award, Shield, Target, ExternalLink, Mail, 
   Loader2, User as UserIcon, Zap, Star,
   Github, Linkedin, Globe, MapPin, 
   Calendar, CheckCircle2, TrendingUp
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function PublicProfile() {
   const { t } = useLanguage();
   const { id } = useParams();
   const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchProfile();
   }, [id]);

   const fetchProfile = async () => {
      setLoading(true);
      try {
         const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

         if (error) throw error;
         setProfile(data);
      } catch (err) {
         toast.error('Identity fetch failure');
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   if (loading) {
      return (
         <DashboardLayout>
            <div className="py-32 flex flex-col items-center justify-center gap-6">
               <div className="w-16 h-16 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin shadow-2xl shadow-[var(--color-primary)]/20" />
               <p className="text-[10px] font-black uppercase tracking-[5px] text-[var(--color-text-muted)] animate-pulse">Fetching Identity Signature...</p>
            </div>
         </DashboardLayout>
      );
   }

   if (!profile) {
      return (
         <DashboardLayout>
            <div className="py-32 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-[2.5rem] flex items-center justify-center mb-6 border border-rose-500/20">
                  <Shield size={40} />
               </div>
               <h2 className="text-2xl font-black font-sora text-[var(--color-text-primary)] tracking-tight">Identity Terminated</h2>
               <p className="text-sm text-[var(--color-text-muted)] mt-2 font-medium">The requested personnel signature does not exist in the institutional records.</p>
            </div>
         </DashboardLayout>
      );
   }

   return (
      <DashboardLayout>
         <div className="space-y-12 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* PROFILE HEADER: Identity Hub */}
            <div className="relative group">
               <div className="h-64 bg-[#0A0F1D] border border-white/5 rounded-[3rem] overflow-hidden shadow-3xl relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/20 to-indigo-500/20 opacity-40 mix-blend-overlay" />
                  <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                     <Target size={240} />
                  </div>
               </div>
               
               <div className="px-10 md:px-16 -mt-24 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-end gap-10">
                     <div className="w-48 h-48 rounded-[3.5rem] bg-[#0D1222] border-8 border-[var(--color-surface)] overflow-hidden shadow-3xl relative p-1">
                        <div className="w-full h-full rounded-[2.8rem] overflow-hidden border border-white/10 flex items-center justify-center bg-[var(--color-surface-2)]">
                           {profile.avatar_url ? (
                              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                           ) : (
                              <span className="text-5xl font-black text-white/20">{profile.full_name?.charAt(0)}</span>
                           )}
                        </div>
                        <div className="absolute bottom-4 right-4 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-[var(--color-surface)] flex items-center justify-center text-white shadow-lg">
                           <CheckCircle2 size={18} fill="currentColor" />
                        </div>
                     </div>

                     <div className="flex-1 pb-4 text-left">
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                           <h1 className="text-4xl md:text-5xl font-black font-sora text-[var(--color-text-primary)] tracking-tighter">
                              {profile.full_name}
                           </h1>
                           <span className="px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border border-[var(--color-primary)]/20">
                              {profile.role || 'Member'}
                           </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-[var(--color-text-muted)] text-sm font-medium">
                           <p className="flex items-center gap-2"><MapPin size={16} className="text-[var(--color-primary)]" /> {profile.major || 'Institutional Fleet'}</p>
                           <p className="flex items-center gap-2 w-1 h-1 bg-[var(--color-border)] rounded-full hidden md:block" />
                           <p className="flex items-center gap-2"><Calendar size={16} className="text-indigo-500" /> Joined {new Date(profile.created_at).toLocaleDateString()}</p>
                        </div>
                     </div>

                     <div className="flex gap-4 pb-6">
                        <button className="px-10 py-5 bg-[var(--color-primary)] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-[var(--color-primary)]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                           <Mail size={16} fill="currentColor" /> Connect Identity
                        </button>
                        <button className="p-5 bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-[1.5rem] hover:bg-white transition-all shadow-sm">
                           <Globe size={20} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
               {/* LEFT SIDEBAR: Stats & Metadata */}
               <div className="lg:col-span-4 space-y-10">
                  {/* Skill magnitude */}
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3.5rem] p-10 shadow-sm hover:border-[var(--color-primary)]/20 transition-all">
                     <h3 className="text-xl font-black font-sora text-[var(--color-text-primary)] mb-8 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center border border-yellow-500/20">
                           <Zap size={24} fill="currentColor" />
                        </div>
                        Institutional Power
                     </h3>
                     <div className="space-y-6">
                        <div className="p-8 bg-[var(--color-surface-2)] rounded-[2.5rem] border border-[var(--color-border)] group hover:bg-[var(--color-primary)] hover:border-transparent transition-all">
                           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--color-text-muted)] group-hover:text-white/60 mb-2">Aggregate XP Magnitude</p>
                           <p className="text-4xl font-black text-[var(--color-text-primary)] group-hover:text-white font-sora">{profile.total_xp?.toLocaleString() || 0}</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex-1 p-6 bg-[var(--color-surface-2)] rounded-3xl border border-[var(--color-border)] flex flex-col items-center justify-center">
                              <p className="text-[8px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Current Tier</p>
                              <p className="text-xl font-black text-[var(--color-primary)]">Lvl {(profile.total_xp / 1000).toFixed(0)}</p>
                           </div>
                           <div className="flex-1 p-6 bg-[var(--color-surface-2)] rounded-3xl border border-[var(--color-border)] flex flex-col items-center justify-center">
                              <p className="text-[8px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Growth Index</p>
                              <p className="text-xl font-black text-emerald-500">+12%</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Badges Cabinet */}
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3.5rem] p-10 shadow-sm hover:border-indigo-500/20 transition-all">
                     <h3 className="text-xl font-black font-sora text-[var(--color-text-primary)] mb-8 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                           <Award size={24} />
                        </div>
                        Achievement Vault
                     </h3>
                     <div className="grid grid-cols-2 gap-4">
                        {[1,2,3,4].map(i => (
                           <div key={i} className="flex flex-col items-center gap-3 p-6 bg-[var(--color-surface-2)] rounded-[2rem] border border-transparent hover:border-indigo-500/20 transition-all group grayscale hover:grayscale-0">
                              <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🏅</div>
                              <span className="text-[8px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Verified Badge</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* MAIN CONTENT: Bio & Activity */}
               <div className="lg:col-span-8 space-y-12">
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3.5rem] p-12 shadow-sm">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-text-muted)] mb-8 flex items-center gap-4">
                        <div className="w-1 h-1 bg-[var(--color-primary)] rounded-full" /> Narrative Protocol
                     </h3>
                     <div className="relative">
                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-primary)] to-transparent rounded-full opacity-20" />
                        <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed font-medium italic">
                           "{profile.bio || "Personnel narrative signature not found. User is currently operating under default institutional protocols."}"
                        </p>
                     </div>
                  </div>

                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3.5rem] p-12 shadow-sm">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-text-muted)] mb-10 flex items-center gap-4">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full" /> Transmission Timeline
                     </h3>
                     <div className="space-y-10">
                        {[1, 2].map((i) => (
                           <div key={i} className="flex gap-8 group">
                              <div className="relative">
                                 <div className="w-12 h-12 rounded-2xl bg-white border border-[var(--color-border)] flex items-center justify-center text-xl shadow-sm z-10 relative group-hover:scale-110 transition-transform">
                                    <Star size={20} className="text-yellow-500" fill="currentColor" />
                                 </div>
                                 <div className="absolute top-12 bottom-[-40px] left-1/2 -translate-x-1/2 w-0.5 bg-[var(--color-border)] last:hidden" />
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight group-hover:text-[var(--color-primary)] transition-colors">Phase {i === 1 ? 'IV' : 'III'} Completion</h4>
                                    <span className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">{i === 1 ? '2 Days Ago' : '1 Week Ago'}</span>
                                 </div>
                                 <p className="text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed">
                                    Successfully finalized the advanced synthesis for organizational task synchronization. Efficiency rating: 98.4%.
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </DashboardLayout>
   );
}

