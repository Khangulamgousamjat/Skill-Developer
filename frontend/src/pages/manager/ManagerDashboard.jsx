import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import { supabase } from '../../api/supabase';
import {
   Users, ClipboardCheck, TrendingUp,
   Plus, CheckCircle, XCircle, Clock,
   ExternalLink, Search, Filter, Loader2,
   Briefcase, GraduationCap, Award, Play,
   ArrowRight, Zap, Target
} from 'lucide-react';
import {
   BarChart, Bar, XAxis, YAxis,
   CartesianGrid, Tooltip, ResponsiveContainer,
   Cell
} from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ManagerDashboard() {
   const { t } = useLanguage();
   const navigate = useNavigate();
   const { user } = useSelector((state) => state.auth);
   const [stats, setStats] = useState({
      totalTeam: 0,
      pendingReviews: 0,
      avgXP: 0,
      completionRate: '0%'
   });
   const [reviews, setReviews] = useState([]);
   const [team, setTeam] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (user) fetchDashboardData();
   }, [user]);

   const fetchDashboardData = async () => {
      setLoading(true);
      try {
         // 1. Fetch Team (Students in same department)
         const { data: teamDocs, count: teamCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .eq('role', 'student')
            .eq('department_name', user.department_name)
            .order('full_name', { ascending: true });

         // 2. Fetch Pending Reviews from Assignments
         const { data: reviewDocs } = await supabase
            .from('assignments')
            .select(`
               *,
               profiles:student_id (full_name, avatar_url)
            `)
            .eq('status', 'submitted')
            .in('student_id', teamDocs?.map(t => t.id) || [])
            .order('submitted_at', { ascending: false });

         const totalXP = teamDocs?.reduce((acc, curr) => acc + (curr.total_xp || 0), 0) || 0;
         const avgXP = teamCount > 0 ? Math.round(totalXP / teamCount) : 0;

         setTeam(teamDocs || []);
         setReviews(reviewDocs || []);
         setStats({
            totalTeam: teamCount || 0,
            pendingReviews: reviewDocs?.length || 0,
            avgXP: avgXP,
            completionRate: '88%' // Simulated metric
         });

      } catch (err) {
         toast.error('Strategic telemetry failure');
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const handleReview = async (assignmentId, status) => {
      try {
         const { error } = await supabase
            .from('assignments')
            .update({ 
               status: status === 'approved' ? 'completed' : 'revision_requested',
               reviewed_at: new Date().toISOString()
            })
            .eq('id', assignmentId);

         if (error) throw error;
         
         toast.success(status === 'approved' ? 'Deployment approved' : 'Revision requested');
         fetchDashboardData();
      } catch (err) {
         toast.error('Protocol failure during review transmission');
      }
   };

   if (loading && team.length === 0) {
      return (
         <DashboardLayout>
            <div className="py-32 flex flex-col items-center justify-center gap-6">
               <div className="w-16 h-16 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin shadow-2xl shadow-[var(--color-primary)]/20" />
               <p className="text-[10px] font-black uppercase tracking-[5px] text-[var(--color-text-muted)] animate-pulse">Syncing Operational Intelligence...</p>
            </div>
         </DashboardLayout>
      );
   }

   return (
      <DashboardLayout>
         <div className="space-y-12 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">

            {/* HEADER: Strategic Command */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
               <div className="text-left">
                  <div className="flex items-center gap-4 mb-2">
                     <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20 shadow-sm">
                        <Target size={26} />
                     </div>
                     <h1 className="text-4xl font-black font-sora text-[var(--color-text-primary)] tracking-tight">Strategic Oversight</h1>
                  </div>
                  <p className="text-[var(--color-text-muted)] text-sm font-medium">Aggregated performance monitoring for the <span className="text-indigo-500 font-black">{user?.department_name || 'Fleet'}</span> Division</p>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => navigate('/manager/projects')} className="group flex items-center gap-3 px-8 py-5 bg-[var(--color-primary)] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-[var(--color-primary)]/40 hover:scale-105 active:scale-95 transition-all">
                     <Plus size={18} />
                     Initiate Project
                  </button>
               </div>
            </div>

            {/* STATS ANALYTICS: Team Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               <StatCard title="Team Clusters" value={stats.totalTeam} icon={Users} color="primary" loading={loading} />
               <StatCard title="Review Queue" value={stats.pendingReviews} icon={ClipboardCheck} color={stats.pendingReviews > 0 ? 'warning' : 'emerald'} subtitle="Awaiting clearance" loading={loading} />
               <StatCard title="Aggregate XP" value={stats.avgXP} icon={GraduationCap} color="info" loading={loading} />
               <StatCard title="Division Delta" value={stats.completionRate} icon={TrendingUp} color="success" loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

               {/* SUBMISSION REVIEW QUEUE: Left 65% */}
               <div className="lg:col-span-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] overflow-hidden shadow-sm flex flex-col h-full hover:border-indigo-500/20 transition-all text-left">
                  <div className="p-10 border-b border-[var(--color-border)] flex items-center justify-between bg-gradient-to-r from-transparent to-[var(--color-surface-2)]/20">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center border border-orange-500/20">
                           <Clock size={24} />
                        </div>
                        <div>
                           <h2 className="text-2xl font-black font-sora text-[var(--color-text-primary)] tracking-tight">Review Protocol</h2>
                           <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] opacity-50 mt-1">Personnel deployment verification</p>
                        </div>
                     </div>
                     <span className="px-5 py-2.5 bg-orange-500/10 text-orange-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-orange-500/20">{reviews.length} REQUESTS</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                     {reviews.length === 0 ? (
                        <div className="py-24 flex flex-col items-center justify-center text-[var(--color-text-muted)] opacity-40">
                           <div className="w-20 h-20 bg-[var(--color-surface-2)] rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner">
                              <CheckCircle size={40} strokeWidth={1} />
                           </div>
                           <p className="font-extrabold uppercase text-[10px] tracking-[4px]">Queue Synchronized</p>
                           <p className="text-xs mt-2 font-medium">All divisional work signatures have been processed.</p>
                        </div>
                     ) : (
                        <div className="divide-y divide-[var(--color-border)] px-4">
                           <AnimatePresence>
                              {reviews.map((req, idx) => (
                                 <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-10 hover:bg-[var(--color-surface-2)]/40 rounded-[2.5rem] transition-all group relative mb-4 mt-2 border border-transparent hover:border-[var(--color-border)]"
                                 >
                                    <div className="flex items-start justify-between gap-8">
                                       <div className="flex gap-6 min-w-0">
                                          <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] font-black text-lg shrink-0 shadow-sm">
                                             {req.profiles?.avatar_url ? <img src={req.profiles.avatar_url} className="w-full h-full object-cover" alt="" /> : req.profiles?.full_name?.charAt(0)}
                                          </div>
                                          <div className="min-w-0">
                                             <div className="flex items-center gap-3 mb-1.5">
                                                <h4 className="font-extrabold text-[var(--color-text-primary)] text-lg tracking-tight truncate">{req.project_title}</h4>
                                                <span className="px-3 py-1 rounded-xl bg-orange-500/10 text-orange-600 text-[8px] font-black uppercase tracking-widest ring-1 ring-orange-500/20">Awaiting Clearance</span>
                                             </div>
                                             <p className="text-sm font-medium text-[var(--color-text-muted)]">Submitted by <span className="text-[var(--color-text-primary)] font-black">{req.profiles?.full_name}</span></p>
                                             <div className="flex items-center gap-10 mt-5">
                                                <a href={req.submission_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] hover:brightness-125 transition-all">
                                                   PREVIEW WORK <ExternalLink size={12} />
                                                </a>
                                                <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)] font-black uppercase tracking-widest">
                                                   <Clock size={12} className="text-orange-500" /> {new Date(req.submitted_at).toLocaleDateString()}
                                                </div>
                                             </div>
                                          </div>
                                       </div>

                                       <div className="flex items-center gap-4">
                                          <button
                                             onClick={() => handleReview(req.id, 'approved')}
                                             className="p-5 bg-emerald-500/10 text-emerald-600 rounded-3xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-emerald-500/20 group/btn"
                                          >
                                             <CheckCircle size={22} className="group-hover/btn:scale-110 transition-transform" />
                                          </button>
                                          <button
                                             onClick={() => handleReview(req.id, 'rejected')}
                                             className="p-5 bg-rose-500/10 text-rose-600 rounded-3xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-500/20 group/btn"
                                          >
                                             <XCircle size={22} className="group-hover/btn:scale-110 transition-transform" />
                                          </button>
                                       </div>
                                    </div>
                                 </motion.div>
                              ))}
                           </AnimatePresence>
                        </div>
                     )}
                  </div>
               </div>

               {/* TEAM LOADOUT: Right 35% */}
               <div className="lg:col-span-4 space-y-10">
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] overflow-hidden shadow-sm flex flex-col hover:border-indigo-500/20 transition-all text-left h-full">
                     <div className="p-10 border-b border-[var(--color-border)] bg-gradient-to-r from-transparent to-[var(--color-surface-2)]/20">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                              <Briefcase size={20} />
                           </div>
                           <h2 className="text-xl font-black font-sora text-[var(--color-text-primary)] tracking-tight">Active Fleet</h2>
                        </div>
                     </div>
                     <div className="p-6 space-y-2 flex-1 overflow-y-auto">
                        {team.map((member, idx) => (
                           <motion.div 
                              key={member.id} 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-6 flex items-center justify-between group hover:bg-[var(--color-surface-2)]/50 rounded-3xl transition-all"
                           >
                              <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] font-black text-sm group-hover:scale-110 transition-transform overflow-hidden shadow-sm shadow-black/5">
                                    {member.avatar_url ? <img src={member.avatar_url} alt="" className="w-full h-full object-cover" /> : <Users size={20} />}
                                 </div>
                                 <div>
                                    <h4 className="font-extrabold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors text-base tracking-tight">{member.full_name}</h4>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mt-1 opacity-60">{member.total_xp || 0} XP ACCUMULATED</p>
                                 </div>
                              </div>
                              <button
                                 onClick={() => navigate(`/profile/${member.id}`)}
                                 className="p-4 bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-indigo-500 rounded-2xl transition-all border border-transparent hover:border-indigo-500/20 shadow-sm"
                              >
                                 <ArrowRight size={20} />
                              </button>
                           </motion.div>
                        ))}
                     </div>
                     <div className="p-8 bg-[var(--color-surface-2)]/30 border-t border-[var(--color-border)]">
                        <button onClick={() => navigate('/manager/team')} className="w-full py-4 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--color-text-muted)] hover:text-indigo-500 transition-all">
                           Global Division Inventory
                        </button>
                     </div>
                  </div>

                  {/* Strategic Briefing */}
                  <div className="bg-[#0B0F1A] rounded-[3rem] p-12 text-white shadow-3xl relative overflow-hidden group text-left border border-white/5">
                     <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-125 transition-transform duration-1000" />
                     <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                           <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-3xl flex items-center justify-center mb-10 border border-white/10 shadow-2xl">
                              <Award size={28} className="text-amber-400" />
                           </div>
                           <h3 className="font-black font-sora text-2xl mb-4 tracking-tight">Intelligence Feed</h3>
                           <p className="text-white/40 text-sm leading-relaxed mb-10 font-medium">
                              Divisional telemetry indicates multiple personnel clusters ready for transition to high-tier project synthesis.
                           </p>
                        </div>
                        <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/50 hover:text-amber-400 transition-all w-full py-4 border border-white/5 rounded-2xl bg-white/5 justify-center">
                           ANALYZE SYNTHESIS <TrendingUp size={16} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
}
