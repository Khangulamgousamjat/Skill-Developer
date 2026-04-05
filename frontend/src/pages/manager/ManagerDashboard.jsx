import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import axiosInstance from '../../api/axios';
import {
   Users, ClipboardCheck, TrendingUp,
   Plus, CheckCircle, XCircle, Clock,
   ExternalLink, Search, Filter, Loader2,
   Briefcase, GraduationCap, Award, Play,
   ArrowRight
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
      completionRate: 0
   });
   const [reviews, setReviews] = useState([]);
   const [team, setTeam] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchDashboardData();
   }, []);

   const fetchDashboardData = async () => {
      try {
         setLoading(true);
         const [statsRes, reviewsRes, teamRes] = await Promise.all([
            axiosInstance.get('/manager/dashboard/stats'),
            axiosInstance.get('/manager/dashboard/pending-reviews'),
            axiosInstance.get('/manager/team')
         ]);

         if (statsRes.data.success) setStats(statsRes.data.data);
         if (reviewsRes.data.success) setReviews(reviewsRes.data.data);
         if (teamRes.data.success) setTeam(teamRes.data.data);
      } catch (err) {
         console.error('Failed to sync manager intelligence');
      } finally {
         setLoading(false);
      }
   };

   const handleReview = async (assignmentId, status) => {
      try {
         await axiosInstance.patch(`/manager/assignments/${assignmentId}/review`, { status });
         toast.success(status === 'approved' ? 'Deployment approved' : 'Revision requested');
         fetchDashboardData();
      } catch (err) {
         toast.error('Protocol failure during review transmission');
      }
   };

   if (loading && !stats.totalTeam) {
      return (
         <DashboardLayout>
            <div className="py-20 flex flex-col items-center justify-center">
               <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-[10px] font-black uppercase tracking-[4px] text-[var(--color-text-muted)] animate-pulse">Syncing Intelligence...</p>
            </div>
         </DashboardLayout>
      );
   }

   return (
      <DashboardLayout>
         <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div>
                  <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">Manager Oversight</h1>
                  <p className="text-[var(--color-text-muted)] mt-1">Reviewing the <span className="text-[var(--color-primary)] font-bold">{user?.department_name || 'Departmental'}</span> team performance</p>
               </div>
               <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/manager/projects')} className="flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-sm shadow-xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                     <Plus size={18} />
                     New Project
                  </button>
               </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <StatCard title="Total Team" value={stats.totalTeam} icon={Users} color="primary" loading={loading} />
               <StatCard title="Review Queue" value={stats.pendingReviews} icon={ClipboardCheck} color={stats.pendingReviews > 0 ? 'warning' : 'success'} loading={loading} />
               <StatCard title="Avg Team XP" value={stats.avgXP} icon={GraduationCap} color="indigo" loading={loading} />
               <StatCard title="Efficiency" value={stats.completionRate} icon={TrendingUp} color="emerald" loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

               {/* SUBMISSION REVIEW QUEUE (Left 60%) */}
               <div className="lg:col-span-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-full">
                  <div className="p-8 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-2)]/30">
                     <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
                           <Clock size={20} />
                        </div>
                        <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Review Queue</h2>
                     </div>
                     {reviews.length > 0 && (
                        <span className="px-3 py-1 bg-orange-500/10 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">{reviews.length} PENDING</span>
                     )}
                  </div>
                  <div className="flex-1 overflow-y-auto">
                     {reviews.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-[var(--color-text-muted)] opacity-40">
                           <CheckCircle size={60} strokeWidth={1} />
                           <p className="mt-4 font-bold">All caught up!</p>
                           <p className="text-xs mt-1">No pending project reviews for your team.</p>
                        </div>
                     ) : (
                        <div className="divide-y divide-[var(--color-border)]">
                           <AnimatePresence>
                              {Array.isArray(reviews) && reviews.map((req) => (
                                 <motion.div
                                    key={req.assignment_id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-8 hover:bg-[var(--color-surface-2)]/30 transition-colors group relative"
                                 >
                                    <div className="flex items-start justify-between gap-4">
                                       <div className="flex gap-4 min-w-0">
                                          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold shrink-0 shadow-inner">
                                             {req.intern_name?.charAt(0)}
                                          </div>
                                          <div className="min-w-0">
                                             <h4 className="font-bold text-[var(--color-text-primary)] truncate">{req.project_title}</h4>
                                             <p className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">Submitted by <span className="text-[var(--color-text-primary)]">{req.intern_name}</span></p>
                                             <div className="flex items-center gap-4 mt-3">
                                                <a href={req.submission_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:underline">
                                                   View Work <ExternalLink size={10} />
                                                </a>
                                                <span className="w-1 h-1 bg-[var(--color-border)] rounded-full" />
                                                <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest flex items-center gap-1">
                                                   <Clock size={10} /> {new Date(req.submitted_at).toLocaleDateString()}
                                                </p>
                                             </div>
                                          </div>
                                       </div>

                                       <div className="flex items-center gap-2">
                                          <button
                                             onClick={() => handleReview(req.assignment_id, 'approved')}
                                             className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                             title="Approve"
                                          >
                                             <CheckCircle size={18} />
                                          </button>
                                          <button
                                             onClick={() => handleReview(req.assignment_id, 'rejected')}
                                             className="p-2.5 bg-red-500/10 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                             title="Request Revision"
                                          >
                                             <XCircle size={18} />
                                          </button>
                                       </div>
                                    </div>
                                 </motion.div>
                              ))}
                           </AnimatePresence>
                        </div>
                     )}
                  </div>
                  <div className="p-4 bg-[var(--color-surface-2)]/30 border-t border-[var(--color-border)] text-center">
                     <button onClick={() => navigate('/manager/evaluation')} className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                        View Detailed Evaluation History
                     </button>
                  </div>
               </div>

               {/* TEAM OVERVIEW LIST (Right 40%) */}
               <div className="lg:col-span-2 space-y-8">
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col">
                     <div className="p-8 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/30">
                        <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Team Deployment</h2>
                     </div>
                     <div className="p-8 divide-y divide-[var(--color-border)] max-h-[600px] overflow-y-auto">
                        {Array.isArray(team) && team.map((member) => (
                           <div key={member.id} className="py-6 flex items-center justify-between group first:pt-0 last:pb-0">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] font-black text-sm group-hover:scale-110 transition-transform overflow-hidden shadow-sm">
                                    {member.profile_photo_url ? <img src={member.profile_photo_url} alt="" className="w-full h-full object-cover" /> : member.full_name?.charAt(0)}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{member.full_name}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-0.5">{member.skill_level || 'Junior'} Intern</p>
                                 </div>
                              </div>
                              <button
                                 onClick={() => navigate(`/profile/${member.id}`)}
                                 className="p-3 bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-indigo-500 rounded-xl transition-all"
                              >
                                 <ArrowRight size={16} />
                              </button>
                           </div>
                        ))}
                     </div>
                     <div className="p-4 bg-[var(--color-surface-2)]/30 border-t border-[var(--color-border)] text-center">
                        <button onClick={() => navigate('/manager/team')} className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                           View Global Team Directory
                        </button>
                     </div>
                  </div>

                  {/* Operational Briefing */}
                  <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2E5490] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                     <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 shadow-lg">
                           <Award size={24} className="text-amber-400" />
                        </div>
                        <h3 className="font-bold font-sora text-xl mb-4 leading-tight">Insight Engine</h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-8">
                           "Three interns have reached **Advanced** proficiency levels. Ready for project higher-tier assignment."
                        </p>
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[2px] text-amber-400 hover:text-white transition-all">
                           ANALYZE FLOW <TrendingUp size={14} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
}
