import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import { supabase } from '../../api/supabase';
import {
   Users, Award, ClipboardCheck, BookOpen,
   TrendingUp, ShieldCheck,
   ArrowUpRight, Plus, Eye, Clock, Building2,
   ChevronRight, UserCheck, Zap, Briefcase
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function HRDashboard() {
   const { t } = useLanguage();
   const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
   const [stats, setStats] = useState({
      totalInterns: 0,
      pendingOnboarding: 0,
      certificatesIssued: 0,
      avgAttendance: '94%'
   });
   const [interns, setInterns] = useState([]);
   const [attendance, setAttendance] = useState([]);

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      setLoading(true);
      try {
         // 1. Fetch Students (Intern Pool)
         const { data: studentDocs, count: studentCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .eq('role', 'student')
            .order('created_at', { ascending: false });

         // 2. Fetch Recent Attendance
         const { data: attData } = await supabase
            .from('attendance_logs')
            .select(`
               *,
               profiles:student_id (full_name, avatar_url)
            `)
            .order('joined_at', { ascending: false })
            .limit(5);

         // 3. Fetch Total Certs
         const { count: certCount } = await supabase
            .from('certificates')
            .select('*', { count: 'exact', head: true });

         setInterns(studentDocs || []);
         setAttendance(attData || []);
         setStats({
            totalInterns: studentCount || 0,
            pendingOnboarding: studentDocs?.filter(s => !s.bio || !s.skills_count).length || 0,
            certificatesIssued: certCount || 0,
            avgAttendance: '94.2%'
         });

      } catch (err) {
         toast.error('Personnel telemetry failure');
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const departments = [
      { name: 'Coding', items: interns.filter(i => (i.major || '').includes('CS')) },
      { name: 'Design', items: interns.filter(i => (i.major || '').includes('Design')) },
      { name: 'HR/Mgmt', items: interns.filter(i => (i.major || '').includes('Business')) },
      { name: 'Other', items: interns.filter(i => !i.major) },
   ];

   return (
      <DashboardLayout>
         <div className="space-y-12 pb-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">

            {/* HEADER: Recruitment Intelligence */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
               <div className="text-left">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <Briefcase size={22} />
                     </div>
                     <h1 className="text-3xl font-black font-sora text-[var(--color-text-primary)] tracking-tight">Personnel Center</h1>
                  </div>
                  <p className="text-[var(--color-text-muted)] text-sm font-medium">Strategic oversight for the institutional talent pipeline</p>
               </div>
               <div className="flex items-center gap-4">
                  <button 
                     onClick={() => navigate('/hr/evaluations')} 
                     className="group flex items-center gap-3 px-8 py-5 bg-[var(--color-primary)] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-[var(--color-primary)]/40 hover:scale-105 active:scale-95 transition-all"
                  >
                     <Zap size={18} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
                     Issue Global Credential
                  </button>
                  <button className="flex items-center gap-3 px-8 py-5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-[var(--color-surface-2)] transition-all shadow-sm">
                     <Eye size={18} />
                     Master Records
                  </button>
               </div>
            </div>

            {/* KEY METRICS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               <StatCard title="Active Interns" value={stats.totalInterns} icon={Users} color="primary" loading={loading} />
               <StatCard title="Onboarding" value={stats.pendingOnboarding} icon={ClipboardCheck} color={stats.pendingOnboarding > 0 ? 'warning' : 'emerald'} subtitle="Awaiting completion" loading={loading} />
               <StatCard title="Certs Validated" value={stats.certificatesIssued} icon={Award} color="info" loading={loading} />
               <StatCard title="Productivity" value={stats.avgAttendance} icon={TrendingUp} color="success" loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

               {/* ONBOARDING FLOW: Left 65% */}
               <div className="lg:col-span-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] overflow-hidden shadow-sm flex flex-col hover:border-[var(--color-primary)]/20 transition-all text-left">
                  <div className="p-10 border-b border-[var(--color-border)] flex items-center justify-between bg-gradient-to-r from-transparent to-[var(--color-surface-2)]/20">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                           <UserCheck size={24} />
                        </div>
                        <div>
                           <h2 className="text-2xl font-black font-sora text-[var(--color-text-primary)] tracking-tight">Onboarding Pipeline</h2>
                           <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] opacity-50 mt-1">Personnel synthesis tracking</p>
                        </div>
                     </div>
                     <button onClick={() => navigate('/hr/all-interns')} className="px-5 py-2.5 bg-[var(--color-surface-2)] rounded-xl text-[9px] font-black text-[var(--color-text-primary)] uppercase tracking-widest hover:bg-white transition-all border border-[var(--color-border)]">Inventory Report</button>
                  </div>
                  <div className="flex-1 overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-[var(--color-surface-2)]/30 border-b border-[var(--color-border)]">
                              <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Identifier</th>
                              <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Deployment Status</th>
                              <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-right">Synthesis Load</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                           {loading ? (
                              [...Array(5)].map((_, i) => (
                                 <tr key={i}>
                                    <td colSpan={3} className="px-10 py-6"><div className="w-full h-8 bg-[var(--color-surface-2)] animate-pulse rounded-xl" /></td>
                                 </tr>
                              ))
                           ) : interns.slice(0, 6).map(intern => (
                              <tr key={intern.id} className="hover:bg-[var(--color-surface-2)]/40 transition-colors cursor-pointer group" onClick={() => navigate(`/profile/${intern.id}`)}>
                                 <td className="px-10 py-6">
                                    <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-2)] overflow-hidden flex items-center justify-center border border-[var(--color-border)] shadow-sm group-hover:scale-105 transition-transform">
                                          {intern.avatar_url ? (
                                             <img src={intern.avatar_url} className="w-full h-full object-cover" alt="" />
                                          ) : (
                                             <span className="font-black text-[var(--color-text-muted)]">{intern.full_name?.charAt(0)}</span>
                                          )}
                                       </div>
                                       <div>
                                          <p className="font-extrabold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors text-base tracking-tight">{intern.full_name}</p>
                                          <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-black tracking-widest mt-0.5 opacity-50">{intern.major || 'General Synthesis'}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-10 py-6">
                                    <div className="flex items-center gap-2.5">
                                       <div className={`w-2 h-2 rounded-full ${intern.bio ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                       <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${intern.bio ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                                          {intern.bio ? 'Deployed' : 'Onboarding'}
                                       </span>
                                    </div>
                                 </td>
                                 <td className="px-10 py-6">
                                    <div className="flex flex-col items-end gap-2">
                                       <p className="text-[10px] font-black text-[var(--color-text-primary)] uppercase tracking-widest">{intern.bio ? '100' : '45'}%</p>
                                       <div className="w-32 h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden border border-[var(--color-border)] shadow-inner">
                                          <motion.div 
                                             initial={{ width: 0 }}
                                             animate={{ width: intern.bio ? '100%' : '45%' }}
                                             className={`h-full ${intern.bio ? 'bg-emerald-500' : 'bg-amber-500'} shadow-lg`} 
                                          />
                                       </div>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* ATTENDANCE: Right 35% */}
               <div className="lg:col-span-4 space-y-10">
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] p-10 shadow-sm h-full hover:border-[var(--color-primary)]/20 transition-all text-left flex flex-col">
                     <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4 text-left">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                              <Clock size={24} />
                           </div>
                           <div>
                              <h2 className="text-xl font-extrabold font-sora text-[var(--color-text-primary)] tracking-tight">Active Telemetry</h2>
                              <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)] opacity-50 mt-1">Live Learning Metrics</p>
                           </div>
                        </div>
                        <button onClick={() => navigate('/hr/attendance')} className="p-3 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] bg-[var(--color-surface-2)] rounded-2xl transition-all"><ArrowUpRight size={20} /></button>
                     </div>
                      <div className="space-y-8 flex-1">
                        {loading ? (
                           [...Array(4)].map((_, i) => <div key={i} className="w-full h-16 bg-[var(--color-surface-2)] animate-pulse rounded-2xl" />)
                        ) : attendance.length === 0 ? (
                           <p className="text-center py-12 text-[var(--color-text-muted)] text-[10px] font-black uppercase tracking-[0.2em] opacity-40">No Telemetry Cached</p>
                        ) : (
                           attendance.map((log, idx) => (
                              <div key={idx} className="flex gap-5 group items-center">
                                 <div className="w-2.5 h-14 bg-[var(--color-surface-2)] rounded-full flex flex-col justify-end overflow-hidden group-hover:scale-y-110 transition-transform">
                                    <div className="w-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ height: `${Math.min(log.duration_watched_minutes || 0, 100)}%` }} />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-black text-[var(--color-text-primary)] truncate tracking-tight">{log.profiles?.full_name}</h4>
                                    <div className="flex items-center justify-between mt-1 opacity-60">
                                       <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500">
                                          Session Node: {log.lecture_id?.slice(0, 8)}
                                       </p>
                                       <p className="text-[9px] text-[var(--color-text-muted)] font-black uppercase tracking-widest">{new Date(log.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                     <button onClick={() => navigate('/hr/attendance')} className="w-full mt-10 py-5 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--color-text-primary)] hover:text-white transition-all shadow-sm">
                        Audit Attendance Trail
                     </button>
                  </div>
               </div>
            </div>

            {/* LOWER HUB: Distribution & Protocol */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               {/* Department Load */}
               <div className="lg:col-span-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] p-10 shadow-sm text-left">
                  <h3 className="text-xl font-black font-sora text-[var(--color-text-primary)] mb-10 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center border border-[var(--color-primary)]/20 shadow-sm">
                        <Building2 size={20} />
                     </div>
                     Division Loadout
                  </h3>
                  <div className="space-y-8">
                     {departments.map((dept, idx) => (
                        <div key={idx} className="space-y-3">
                           <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
                              <span>{dept.name} Division</span>
                              <span className="text-[var(--color-text-muted)] opacity-50">{dept.items.length} Nodes</span>
                           </div>
                           <div className="w-full bg-[var(--color-surface-2)] h-2.5 rounded-full overflow-hidden border border-[var(--color-border)] shadow-inner">
                              <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${(dept.items.length / (stats.totalInterns || 1)) * 100}%` }}
                                 transition={{ delay: 0.5 + idx * 0.1, duration: 1 }}
                                 className="h-full bg-[var(--color-primary)] shadow-lg"
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Integrated Protocol Unit */}
               <div className="lg:col-span-8 bg-[#0B0F1A] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group shadow-3xl text-left">
                  <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000 grayscale">
                     <TrendingUp size={240} />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 h-full">
                     <div className="shrink-0 w-40 h-40 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-6 shadow-2xl border border-white/10 flex flex-col items-center justify-center text-center group-hover:scale-105 transition-transform">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Sync Delta</p>
                        <p className="text-5xl font-black text-indigo-500 font-sora shadow-indigo-500/50">{stats.pendingOnboarding}</p>
                        <div className="w-8 h-1 bg-indigo-500 mt-4 rounded-full" />
                     </div>
                     <div className="flex-1 space-y-5">
                        <h3 className="text-3xl font-black font-sora text-white tracking-tight">Recruitment Protocol v4</h3>
                        <p className="text-sm text-white/40 mt-3 max-w-xl leading-relaxed font-medium">
                           Organizational telemetry identifies {stats.pendingOnboarding} personnel signatures in partial synthesis state. Automated reminders are recommended to optimize institutional velocity.
                        </p>
                        <div className="flex gap-6 mt-10">
                           <button className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all">Execute Reminders</button>
                           <button className="px-10 py-5 bg-white/5 border border-white/10 text-white/80 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all">Log Protocol</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </DashboardLayout>
   );
}
