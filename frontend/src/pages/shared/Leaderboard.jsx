import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../api/supabase';
import { 
   Trophy, TrendingUp, Users, Award, Shield, 
   Loader2, ArrowUpRight, Zap, Star,
   ChevronRight, Target, Flame
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Leaderboard() {
   const { t } = useLanguage();
   const navigate = useNavigate();
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [aggregates, setAggregates] = useState({
      totalParticipants: 0,
      globalXP: 0
   });

   useEffect(() => {
      fetchLeaderboard();
   }, []);

   const fetchLeaderboard = async () => {
      setLoading(true);
      try {
         // Fetch top students by XP
         const { data: leaderboardData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'student')
            .order('total_xp', { ascending: false })
            .limit(50);

         if (error) throw error;

         // Fetch aggregates
         const { count: studentCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student');

         const totalXP = leaderboardData?.reduce((acc, curr) => acc + (curr.total_xp || 0), 0) || 0;

         setData(leaderboardData || []);
         setAggregates({
            totalParticipants: studentCount || 0,
            globalXP: totalXP
         });
      } catch (err) {
         toast.error('Rank synchronization failure');
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const getRankStyle = (idx) => {
      if (idx === 0) return 'from-yellow-400 via-amber-500 to-orange-600 shadow-yellow-500/40 border-yellow-400/20';
      if (idx === 1) return 'from-slate-200 via-slate-400 to-slate-600 shadow-slate-400/40 border-slate-300/20';
      if (idx === 2) return 'from-orange-400 via-orange-600 to-rose-700 shadow-orange-600/40 border-orange-500/20';
      return 'bg-[var(--color-surface-2)] border-[var(--color-border)]';
   };

   return (
      <DashboardLayout>
         <div className="space-y-12 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">

            {/* HERO: The Hall of Excellence */}
            <div className="group relative overflow-hidden bg-[#0A0F1D] border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-3xl text-left">
               <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:rotate-12 transition-transform duration-1000 grayscale">
                  <Trophy size={320} />
               </div>
               <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[var(--color-primary)]/10 rounded-full blur-[120px]" />
               
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                  <div className="max-w-2xl">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="px-4 py-1.5 bg-yellow-500 text-black rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/20">Elite Tier Access</div>
                        <div className="flex items-center gap-1.5 text-white/40 text-[9px] font-black uppercase tracking-widest">
                           <Flame size={12} className="text-orange-500" /> Season 4 Active
                        </div>
                     </div>
                     <h1 className="text-4xl md:text-6xl font-black font-sora text-white tracking-tighter leading-tight">
                        Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Excellence</span>
                     </h1>
                     <p className="text-white/40 mt-6 text-sm md:text-lg leading-relaxed font-medium max-w-lg">
                        The ultimate hierarchy of skill acquisition. Every interaction, project submission, and verified proficiency contributes to your institutional legacy.
                     </p>
                  </div>
                  <div className="flex gap-8">
                     <div className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center min-w-[160px] hover:scale-105 transition-transform">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Total Talents</p>
                        <p className="text-4xl font-black text-white font-sora">{aggregates.totalParticipants}</p>
                     </div>
                     <div className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center min-w-[160px] hover:scale-105 transition-transform">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Total Power</p>
                        <p className="text-4xl font-black text-yellow-500 font-sora">{(aggregates.globalXP / 1000).toFixed(1)}K</p>
                     </div>
                  </div>
               </div>
            </div>

            {loading ? (
               <div className="py-32 flex flex-col items-center justify-center gap-6">
                  <div className="w-16 h-16 border-4 border-white/5 border-t-yellow-500 rounded-full animate-spin shadow-2xl shadow-yellow-500/20" />
                  <p className="text-[10px] font-black uppercase tracking-[5px] text-[var(--color-text-muted)] animate-pulse">Synchronizing Global Ranks...</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* TOP 3 PODIUM: Mobile view list / Desktop view highlights */}
                  <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
                     {data.slice(0, 3).map((user, idx) => (
                        <motion.div
                           key={user.id}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: idx * 0.1 }}
                           onClick={() => navigate(`/profile/${user.id}`)}
                           className={`relative group cursor-pointer overflow-hidden p-10 rounded-[3rem] border border-white/5 bg-[#0D1222] shadow-2xl hover:border-white/20 transition-all text-left ${
                              idx === 0 ? 'md:scale-105 ring-4 ring-yellow-500/20' : ''
                           }`}
                        >
                           <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 blur-2xl ${getRankStyle(idx)}`} />
                           <div className="flex items-start justify-between relative z-10 mb-8">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl font-sora shadow-2xl border text-white ${getRankStyle(idx)}`}>
                                 {idx + 1}
                              </div>
                              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:rotate-45 transition-transform">
                                 <Award size={20} className={idx === 0 ? 'text-yellow-400' : 'text-white/40'} />
                              </div>
                           </div>

                           <div className="flex items-center gap-6 mb-8 relative z-10">
                              <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden shadow-2xl group-hover:scale-110 transition-transform">
                                 {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/20">
                                       {user.full_name?.charAt(0)}
                                    </div>
                                 )}
                              </div>
                              <div className="min-w-0 flex-1">
                                 <h3 className="text-xl font-black text-white tracking-tight truncate group-hover:text-yellow-400 transition-colors">
                                    {user.full_name}
                                 </h3>
                                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-1 truncate">
                                    {user.major || 'Institutional Fleet'}
                                 </p>
                              </div>
                           </div>

                           <div className="flex items-end justify-between relative z-10 pt-6 border-t border-white/5">
                              <div>
                                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Skill Magnitude</p>
                                 <div className="flex items-center gap-2 text-2xl font-black font-sora text-white">
                                    <Zap size={18} className="text-yellow-500" fill="currentColor" />
                                    {user.total_xp?.toLocaleString()}
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Proficiency</p>
                                 <span className="px-3 py-1 bg-white/5 rounded-xl text-[9px] font-black text-white/60 uppercase tracking-widest border border-white/10">
                                    Lvl {(user.total_xp / 1000).toFixed(0)}
                                 </span>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>

                  {/* MASTER TABLE: Remaining Ranks */}
                  <div className="lg:col-span-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] overflow-hidden shadow-sm flex flex-col text-left hover:border-[var(--color-primary)]/20 transition-all">
                     <div className="p-10 border-b border-[var(--color-border)] flex items-center justify-between bg-gradient-to-r from-transparent to-[var(--color-surface-2)]/20">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center border border-[var(--color-primary)]/20">
                              <Target size={24} />
                           </div>
                           <div>
                              <h2 className="text-2xl font-black font-sora text-[var(--color-text-primary)] tracking-tight">Skill Rankings</h2>
                              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] opacity-50 mt-1">Live Institutional Telemetry</p>
                           </div>
                        </div>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-[var(--color-surface-2)]/30 border-b border-[var(--color-border)]">
                                 <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)] w-24">Rank</th>
                                 <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Candidate Node</th>
                                 <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Division</th>
                                 <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-right">Power Level</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-[var(--color-border)]">
                              {data.slice(3).map((user, idx) => (
                                 <tr 
                                    key={user.id} 
                                    onClick={() => navigate(`/profile/${user.id}`)}
                                    className="hover:bg-[var(--color-surface-2)]/40 transition-colors cursor-pointer group"
                                 >
                                    <td className="px-10 py-6">
                                       <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center font-black text-sm text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:border-[var(--color-primary)]/20 transition-all shadow-sm shadow-black/5">
                                          {idx + 4}
                                       </div>
                                    </td>
                                    <td className="px-10 py-6">
                                       <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] overflow-hidden shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
                                             {user.avatar_url ? (
                                                <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
                                             ) : (
                                                <span className="font-black text-[var(--color-text-muted)] opacity-30">{user.full_name?.charAt(0)}</span>
                                             )}
                                          </div>
                                          <div>
                                             <p className="font-black text-[var(--color-text-primary)] text-base tracking-tight group-hover:text-[var(--color-primary)] transition-colors">{user.full_name}</p>
                                             <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-0.5 opacity-60 flex items-center gap-2">
                                                <Star size={10} className="text-yellow-500" fill="currentColor" /> Verified Account
                                             </p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-10 py-6">
                                       <span className="px-4 py-1.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-[9px] font-black uppercase tracking-widest text-[var(--color-text-primary)] shadow-sm">
                                          {user.department_name || (user.major ? user.major.slice(0, 12) + '...' : 'General')}
                                       </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                       <div className="flex flex-col items-end">
                                          <div className="flex items-center gap-2 text-lg font-black font-sora text-[var(--color-text-primary)]">
                                             <TrendingUp size={16} className="text-emerald-500" />
                                             {user.total_xp?.toLocaleString()}
                                          </div>
                                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] opacity-40 mt-1">Institutional XP Signature</p>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </DashboardLayout>
   );
}

