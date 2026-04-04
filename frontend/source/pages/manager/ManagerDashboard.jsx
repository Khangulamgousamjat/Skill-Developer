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
  Briefcase, GraduationCap, Award, Play
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
  const { user } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [team, setTeam] = useState([]);
  const [stats, setStats] = useState({
    totalTeam: 0,
    pendingReviews: 0,
    avgXP: 0,
    completionRate: '84%'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reviewRes, teamRes] = await Promise.all([
        axiosInstance.get('/manager/reviews').catch(() => ({ data: { success: false } })),
        axiosInstance.get('/manager/team').catch(() => ({ data: { success: false } }))
      ]);

      if (reviewRes.data?.success) {
        setReviews(reviewRes.data.data);
        setStats(prev => ({ ...prev, pendingReviews: reviewRes.data.data.length }));
      }

      if (teamRes.data?.success) {
        const teamData = teamRes.data.data;
        setTeam(teamData);
        setStats(prev => ({ 
          ...prev, 
          totalTeam: teamData.length,
          avgXP: teamData.length > 0 
            ? Math.round(teamData.reduce((acc, curr) => acc + (curr.total_xp || 0), 0) / teamData.length)
            : 0
        }));
      }

    } catch (err) {
      toast.error('Failed to load manager oversight data');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (id, status) => {
    try {
      const feedback = status === 'completed' ? 'Great work!' : 'Please revise the documentation and resubmit.';
      const res = await axiosInstance.patch(`/manager/reviews/${id}`, { status, feedback });
      if (res.data.success) {
        toast.success(`Project ${status === 'completed' ? 'Approved' : 'Rejected'}`);
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  const chartData = team.slice(0, 5).map(member => ({
    name: member.full_name?.split(' ')[0],
    xp: member.total_xp || 0
  }));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20 min-h-[50vh]">
          <div className="w-10 h-10 border-4 rounded-full animate-spin border-[var(--color-primary)] border-t-transparent shadow-lg" />
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
           <StatCard title="Total Team" value={stats.totalTeam} icon={Users} color="primary" />
           <StatCard title="Review Queue" value={stats.pendingReviews} icon={ClipboardCheck} color={stats.pendingReviews > 0 ? 'warning' : 'success'} />
           <StatCard title="Avg Team XP" value={stats.avgXP} icon={GraduationCap} color="indigo" />
           <StatCard title="Efficiency" value={stats.completionRate} icon={TrendingUp} color="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
           
           {/* SUBMISSION REVIEW QUEUE (Left 60%) */}
           <div className="lg:col-span-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-full">
              <div className="p-8 border-b border-[var(--color-border)] flex items-center justify-between">
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
                          {reviews.map((req) => (
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
                                   <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                      <button 
                                        onClick={() => handleReviewAction(req.assignment_id, 'completed')}
                                        className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all"
                                      >
                                         Approve
                                      </button>
                                      <button 
                                        onClick={() => handleReviewAction(req.assignment_id, 'todo')}
                                        className="px-4 py-2 bg-[var(--color-surface)] border border-red-500/20 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                      >
                                         Request Edit
                                      </button>
                                   </div>
                                </div>
                                {req.submission_notes && (
                                   <div className="mt-4 p-4 bg-[var(--color-surface-2)]/50 rounded-[1.5rem] text-xs text-[var(--color-text-secondary)] italic border border-[var(--color-border)]/50">
                                      "{req.submission_notes}"
                                   </div>
                                )}
                             </motion.div>
                          ))}
                       </AnimatePresence>
                    </div>
                 )}
              </div>
           </div>

           {/* TEAM PERFORMANCE (Right 40%) */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Top Learners</h3>
                    <TrendingUp size={20} className="text-[var(--color-success)]" />
                 </div>
                 <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.1} vertical={false} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '16px' }}
                            itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                          />
                          <Bar dataKey="xp" radius={[8, 8, 0, 0]}>
                             {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--color-primary)' : 'var(--color-surface-2)'} />
                             ))}
                          </Bar>
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* QUICK TEAM MANAGEMENT */}
              <div className="bg-[#1A1C23] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group">
                 <div className="absolute top-0 right-0 p-8 opacity-40 group-hover:scale-110 transition-transform duration-700">
                    <Users2 size={120} className="text-[var(--color-primary)]" />
                 </div>
                 <div className="relative z-10">
                    <h3 className="text-2xl font-bold font-sora mb-2">Team Sync</h3>
                    <p className="text-sm text-white/50 mb-8 max-w-[200px]">Quickly assess and manage your {stats.totalTeam} team members.</p>
                    
                    <div className="space-y-4">
                       <button onClick={() => navigate('/manager/team')} className="w-full py-4 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2">
                          Manage Profiles <ArrowRight size={14} />
                       </button>
                       <button onClick={() => navigate('/manager/evaluation')} className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                          Live Evaluations
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* BOTTOM SECTION: TEAM ROSTER OVERVIEW */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <Users size={20} />
                 </div>
                 <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Current Team Roster</h2>
              </div>
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
                    <input type="text" placeholder="Search team..." className="pl-9 pr-4 py-2 bg-[var(--color-surface-2)]/50 border border-[var(--color-border)] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[var(--color-primary)] w-48" />
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map(member => (
                 <div key={member.id} className="p-6 bg-[var(--color-surface-2)]/30 border border-[var(--color-border)]/50 rounded-[2rem] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-2)]/50 transition-all flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[var(--color-primary)]/20">
                       {member.full_name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                       <h4 className="font-bold text-sm text-[var(--color-text-primary)] truncate">{member.full_name}</h4>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase">Lvl {member.current_level || 1}</span>
                          <span className="text-[10px] font-black text-[var(--color-text-muted)]">{member.total_xp || 0} XP</span>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
