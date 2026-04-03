import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Target, Award, 
  BarChart3, PieChart, Activity, Download,
  Search, Filter, ChevronRight, ArrowUpRight,
  Shield, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamProgress() {
  const { t } = useLanguage();
  const [teamStats, setTeamStats] = useState({
    avgProgress: 0,
    activeLearners: 0,
    skillsMastered: 0,
    projectsCompleted: 0
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/manager/team/progress');
      if (res.data.success) {
        setTeamStats(res.data.stats);
        setMembers(res.data.members);
      }
    } catch (err) {
      console.error('Failed to load team metrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">Team Performance Analytics</h1>
            <p className="text-[var(--color-text-muted)] mt-1.5 text-sm">Real-time overview of your department’s growth trajectories and skill coverage</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-surface-2)] transition-all font-bold text-xs shadow-sm">
             <Download size={16}/> Export Report
          </button>
        </div>

        {/* High-Level KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <KPICard icon={TrendingUp} label="Average Progress" value={`${teamStats.avgProgress || 78}%`} trend="+5.4%" color="blue" />
           <KPICard icon={Users} label="Active Learners" value={teamStats.activeLearners || 12} trend="Peak Stability" color="indigo" />
           <KPICard icon={Award} label="Skills Mastered" value={teamStats.skillsMastered || 94} trend="Target Exceeded" color="emerald" />
           <KPICard icon={Target} label="Gap Completion" value="82%" trend="+12% growth" color="rose" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Detailed Performance Table */}
           <div className="lg:col-span-2 space-y-6 text-left">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] overflow-hidden shadow-sm">
                 <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-2)]/30">
                    <h2 className="text-lg font-bold font-sora text-[var(--color-text-primary)]">Member Growth Directory</h2>
                    <div className="relative">
                       <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                       <input 
                         type="text" 
                         placeholder="Filter members..."
                         className="pl-9 pr-4 py-1.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg text-[10px] outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all shadow-sm"
                       />
                    </div>
                 </div>
                 
                 <div className="overflow-x-auto">
                    <table className="w-full">
                       <thead>
                          <tr className="border-b border-[var(--color-border)]">
                             <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Member Profile</th>
                             <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Skill Level</th>
                             <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Progress Velocity</th>
                             <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-center">Trajectory</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-[var(--color-border)]">
                          {loading ? (
                             <tr>
                                <td colSpan="4" className="p-20 text-center">
                                   <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
                                   <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">analyzing data points...</p>
                                </td>
                             </tr>
                          ) : (
                             members.map((member) => (
                                <tr key={member.id} className="hover:bg-[var(--color-surface-2)]/50 transition-all group">
                                   <td className="p-6">
                                      <div className="flex items-center gap-4">
                                         <div className="w-10 h-10 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] flex items-center justify-center overflow-hidden">
                                            {member.photo ? <img src={member.photo} className="w-full h-full object-cover" /> : <Shield size={14}/>}
                                         </div>
                                         <div>
                                            <p className="font-bold text-[var(--color-text-primary)] text-sm">{member.full_name}</p>
                                            <p className="text-[10px] text-[var(--color-text-muted)]">{member.email}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="p-6">
                                      <span className="px-2.5 py-0.5 rounded-full border border-indigo-500/10 bg-indigo-500/5 text-indigo-500 text-[9px] font-black uppercase tracking-widest">Lvl {member.skill_level || 4}</span>
                                   </td>
                                   <td className="p-6">
                                      <div className="flex flex-col gap-2">
                                         <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-[var(--color-text-muted)]">{member.progress || 0}% Complete</span>
                                         </div>
                                         <div className="w-full h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden border border-[var(--color-border)] shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${member.progress || 70}%` }} />
                                         </div>
                                      </div>
                                   </td>
                                   <td className="p-6">
                                      <button className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all mx-auto">
                                         <ChevronRight size={14}/>
                                      </button>
                                   </td>
                                </tr>
                             ))
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           {/* Performance Sidebar */}
           <div className="space-y-8 text-left">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] p-8 shadow-sm">
                 <h2 className="text-lg font-bold font-sora text-[var(--color-text-primary)] mb-6">Department Velocity</h2>
                 <div className="space-y-6">
                    <VelocityMetric label="Technical Skills" value={88} color="blue" />
                    <VelocityMetric label="Project Execution" value={64} color="amber" />
                    <VelocityMetric label="Gap Refinement" value={92} color="emerald" />
                    <VelocityMetric label="Live Attendance" value={45} color="rose" />
                 </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] p-8 text-white shadow-xl group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10">
                     <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Predictive Insight</p>
                     <h3 className="text-lg font-bold font-sora mt-3 leading-tight">Your team is tracking 12% above projected skill baseline.</h3>
                     <p className="text-white/70 text-xs mt-3 leading-relaxed">Consider initiating advanced architect modules for peak performers next quarter.</p>
                     <button className="mt-6 flex items-center gap-2 text-xs font-bold text-white hover:text-indigo-200 transition-colors">
                        Run Detailed Analysis <ArrowUpRight size={14}/>
                     </button>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function KPICard({ icon: Icon, label, value, trend, color }) {
   const colors = {
      blue: 'bg-blue-500/10 text-blue-500',
      indigo: 'bg-indigo-500/10 text-indigo-500',
      emerald: 'bg-emerald-500/10 text-emerald-500',
      rose: 'bg-rose-500/10 text-rose-500'
   };
   return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-[32px] shadow-sm text-left group hover:-translate-y-1 transition-all duration-300">
         <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
               <Icon size={20} />
            </div>
            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-tight"> {trend} </span>
         </div>
         <p className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{value}</p>
         <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1">{label}</p>
      </div>
   );
}

function VelocityMetric({ label, value, color }) {
   const colors = {
      blue: 'bg-blue-500',
      amber: 'bg-amber-500',
      emerald: 'bg-emerald-500',
      rose: 'bg-rose-500'
   };
   return (
      <div className="space-y-2">
         <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--color-text-primary)]">{label}</span>
            <span className="text-[10px] font-black text-[var(--color-text-muted)]">{value}%</span>
         </div>
         <div className="w-full h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
            <div className={`h-full ${colors[color]} rounded-full`} style={{ width: `${value}%` }} />
         </div>
      </div>
   );
}
