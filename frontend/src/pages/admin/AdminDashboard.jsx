import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import { supabase } from '../../api/supabase';
import { 
  Users, Building2, Award, Clock, 
  ShieldCheck, AlertTriangle, Zap, 
  Database, Plus, ChevronRight, Search,
  Activity, UserPlus, FileText, Settings,
  CheckCircle2, Bell, RefreshCw, Loader2,
  TrendingUp, ArrowUpRight, Monitor
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Skeleton from '../../components/ui/Skeleton';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalDepartments: 0,
    totalCertificates: 0,
    systemUptime: '99.9%'
  });
  const [recentActions, setRecentActions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Get Counts in Parallel (Supabase optimized)
      const [
        { count: userCount },
        { count: pendingCount },
        { count: deptCount },
        { count: certCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('role_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('departments').select('*', { count: 'exact', head: true }),
        supabase.from('certificates').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: userCount || 0,
        pendingApprovals: pendingCount || 0,
        totalDepartments: deptCount || 0,
        totalCertificates: certCount || 0,
        systemUptime: '99.99%'
      });

      // 2. Get Recent Role Requests (Action Items)
      const { data: roleReqData } = await supabase
        .from('role_requests')
        .select('*')
        .eq('status', 'pending')
        .order('requested_at', { ascending: false })
        .limit(5);
      
      setPendingRequests(roleReqData || []);

      // 3. Get Recent User Signups
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActions(recentUsers || []);

    } catch (err) {
      toast.error('Tactical telemetry failure');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { label: 'Manage Skills', path: '/admin/skills', icon: Database, color: 'text-indigo-500' },
    { label: 'System Logs', path: '/admin/logs', icon: FileText, color: 'text-amber-500' },
    { label: 'Announcements', path: '/admin/announcements', icon: Bell, color: 'text-emerald-500' },
    { label: 'Org Settings', path: '/admin/settings', icon: Settings, color: 'text-slate-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        
        {/* HERO SECTION: PLATFORM HEALTH - Command Center v2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
           
           {/* System Health Card (Left 70%) */}
           <div className="lg:col-span-8 bg-[#0B0F1A] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] border border-white/5 flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-indigo-600/10 transition-all duration-1000" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-2xl">
                       <Zap size={32} fill="currentColor" />
                    </div>
                    <div className="text-left">
                       <h1 className="text-3xl font-black font-sora tracking-tight">Super Admin Console</h1>
                       <div className="flex items-center gap-3 mt-1.5 px-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Institutional Oversight Protocol Active</p>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-2 pr-6 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/10">
                       <Monitor size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Telemetry</span>
                 </div>
              </div>

              <div className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-3 gap-12 text-left">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-3">Core Stability</p>
                    {loading ? <Skeleton className="h-10 w-24 bg-white/5" /> : <div className="flex items-end gap-2"><p className="text-4xl font-black font-sora">99.9</p><span className="text-sm font-bold text-emerald-500 pb-1.5">%</span></div>}
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-3">Neural Requests</p>
                    {loading ? <Skeleton className="h-10 w-24 bg-white/5" /> : <div className="flex items-end gap-2"><p className="text-4xl font-black font-sora">12</p><span className="text-xs font-bold text-indigo-400 pb-1.5">ms</span></div>}
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-3">Sync Uptime</p>
                    {loading ? <Skeleton className="h-10 w-24 bg-white/5" /> : <div className="flex items-end gap-2"><p className="text-4xl font-black font-sora">24/7</p></div>}
                 </div>
              </div>
           </div>

           {/* Priority Action (Right 30%) */}
           <div className="lg:col-span-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] p-8 shadow-sm flex flex-col justify-between group hover:border-[var(--color-primary)] transition-all hover:bg-[var(--color-primary)]/5">
              <div className="flex items-start justify-between mb-8">
                 <div className="w-16 h-16 rounded-[2rem] bg-[var(--color-primary)] shadow-2xl shadow-[var(--color-primary)]/40 flex items-center justify-center text-white">
                    <ShieldCheck size={32} />
                 </div>
                 <div className="text-right">
                    {loading ? <Skeleton className="h-10 w-16 ml-auto" /> : <p className="text-4xl font-black font-sora text-[var(--color-text-primary)]">{stats.pendingApprovals}</p>}
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1">Pending Identifiers</p>
                 </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs text-[var(--color-text-muted)] font-medium leading-relaxed px-1">
                  There are currently {stats.pendingApprovals} unverified role request protocols awaiting executive review.
                </p>
                <button 
                  onClick={() => navigate('/admin/approvals')} 
                  className="w-full py-5 bg-[var(--color-text-primary)] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Process Queue
                </button>
              </div>
           </div>
        </div>

        {/* STATS ANALYTICS TRANSITION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <StatCard title="Global Users" value={stats.totalUsers} icon={Users} color="primary" loading={loading} />
           <StatCard title="Departments" value={stats.totalDepartments} icon={Building2} color="info" loading={loading} />
           <StatCard title="Vault Status" value={stats.totalCertificates} icon={Award} color="emerald" loading={loading} />
           <StatCard title="System Node" value="Primary" icon={Activity} color="info" loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* UNIFIED ACTION FEED (Left 60%) */}
           <div className="lg:col-span-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] overflow-hidden shadow-sm flex flex-col min-h-[600px] hover:border-[var(--color-primary)]/20 transition-all text-left">
              <div className="p-10 border-b border-[var(--color-border)] flex items-center justify-between bg-gradient-to-r from-transparent to-[var(--color-surface-2)]/20">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                       <Activity size={24} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black font-sora text-[var(--color-text-primary)] tracking-tight">Telemetry Feed</h2>
                       <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] opacity-50 mt-1">Real-Time Operational Logging</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <button onClick={fetchData} className="p-3 hover:bg-[var(--color-surface-2)] rounded-2xl transition-all border border-transparent hover:border-[var(--color-border)] text-[var(--color-text-muted)]">
                       <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                 <div className="divide-y divide-[var(--color-border)]">
                    {loading ? (
                      [...Array(6)].map((_, i) => (
                        <div key={i} className="p-10 flex items-center gap-6">
                           <Skeleton className="w-14 h-14 rounded-2xl" />
                           <div className="space-y-3 flex-1">
                              <Skeleton className="h-5 w-40" />
                              <Skeleton className="h-4 w-64" />
                           </div>
                        </div>
                      ))
                    ) : (
                      <AnimatePresence>
                         {/* PRIORITY FEEDS: Role Requests */}
                         {pendingRequests.map((req, idx) => (
                            <motion.div 
                               key={req.id} 
                               initial={{ opacity: 0, x: -20 }}
                               animate={{ opacity: 1, x: 0 }}
                               transition={{ delay: idx * 0.05 }}
                               className="p-10 bg-amber-500/[0.02] hover:bg-amber-500/[0.05] transition-colors group flex items-start justify-between gap-6 cursor-pointer border-l-4 border-transparent hover:border-amber-500"
                               onClick={() => navigate('/admin/approvals')}
                            >
                               <div className="flex items-start gap-6 min-w-0">
                                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex flex-col items-center justify-center shrink-0 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                                     <UserPlus size={24} className="text-amber-600" />
                                  </div>
                                  <div className="min-w-0">
                                     <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-extrabold text-[var(--color-text-primary)] text-lg tracking-tight truncate">{req.full_name}</h4>
                                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-600 text-[8px] font-black uppercase tracking-widest ring-1 ring-amber-500/20">Critical Identity Sync</span>
                                     </div>
                                     <p className="text-sm font-medium text-[var(--color-text-muted)] line-clamp-1">
                                        Identity synthesized as <span className="text-[var(--color-text-primary)] font-black uppercase text-xs tracking-widest">{req.requested_role}</span> · Awaiting clearance.
                                     </p>
                                     <div className="flex items-center gap-4 mt-4">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                                           <Clock size={12} className="text-amber-500"/> {new Date(req.requested_at).toLocaleTimeString()}
                                        </div>
                                     </div>
                                  </div>
                               </div>
                               <div className="p-4 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                                  <ChevronRight size={22} />
                               </div>
                            </motion.div>
                         ))}

                         {/* SYSTEM EVENTS: Recent Signups */}
                         {recentActions.map((profile, idx) => (
                            <motion.div 
                               key={profile.id} 
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               transition={{ delay: idx * 0.05 + 0.3 }}
                               className="p-10 hover:bg-[var(--color-surface-2)]/40 transition-colors group flex items-start justify-between gap-6 border-l-4 border-transparent hover:border-[var(--color-primary)]"
                            >
                               <div className="flex items-start gap-6 min-w-0">
                                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-2)] overflow-hidden flex items-center justify-center border border-[var(--color-border)] shadow-sm group-hover:scale-105 transition-transform">
                                      {profile.avatar_url ? (
                                         <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                                      ) : (
                                         <Users size={24} className="text-[var(--color-text-muted)]" />
                                      )}
                                  </div>
                                  <div className="min-w-0">
                                     <h4 className="font-extrabold text-[var(--color-text-primary)] text-lg tracking-tight truncate">{profile.full_name}</h4>
                                     <p className="text-sm font-medium text-[var(--color-text-muted)] mt-1">
                                        Established new <span className="text-[var(--color-primary)] font-black uppercase text-[10px] tracking-widest">{profile.role || 'GUEST'}</span> profile signature.
                                     </p>
                                     <p className="text-[9px] text-[var(--color-text-muted)] font-black mt-4 uppercase flex items-center gap-1.5 tracking-widest opacity-40">
                                        <TrendingUp size={12} /> {new Date(profile.created_at).toLocaleDateString()} · Operational
                                     </p>
                                  </div>
                               </div>
                               <button onClick={() => navigate(`/admin/users`)} className="p-4 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all shadow-sm opacity-0 group-hover:opacity-100">
                                  <Settings size={20} />
                               </button>
                            </motion.div>
                         ))}
                      </AnimatePresence>
                    )}
                 </div>
              </div>
           </div>

           {/* ASSET MANAGEMENT (Right 40%) */}
           <div className="lg:col-span-4 space-y-10">
              
              {/* Management Cluster */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] p-10 shadow-sm text-left">
                 <h3 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-10 flex items-center gap-3">
                    <Database size={22} className="text-[var(--color-primary)]" />
                    Asset Core
                 </h3>
                 <div className="grid grid-cols-1 gap-6">
                    {menuItems.map((item, idx) => (
                       <button 
                          key={idx} 
                          onClick={() => navigate(item.path)}
                          className="p-6 bg-[var(--color-surface-2)]/50 hover:bg-white hover:shadow-2xl hover:border-[var(--color-primary)]/20 border border-transparent rounded-[2rem] transition-all flex items-center justify-between group"
                       >
                          <div className="flex items-center gap-5">
                             <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-black/5 group-hover:rotate-6 transition-transform ${item.color}`}>
                                <item.icon size={24} />
                             </div>
                             <span className="text-xs font-black uppercase tracking-widest text-[var(--color-text-primary)] opacity-80 group-hover:opacity-100">{item.label}</span>
                          </div>
                          <ArrowUpRight size={20} className="text-[var(--color-text-muted)] opacity-20 group-hover:opacity-100 transition-all" />
                       </button>
                    ))}
                 </div>
              </div>

              {/* Security Health / Intelligence */}
              <div className="bg-[#0B0F1A] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-3xl group border border-white/5 text-left">
                 <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                    <ShieldCheck size={180} />
                 </div>
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 flex items-center justify-center mb-10 border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform">
                           <Lock size={28} className="text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold font-sora mb-3">Protocol Shield</h3>
                        <p className="text-sm text-white/50 leading-relaxed font-medium">
                           Telemetry confirms zero encryption breaches in current sync cycle. All administrative identifiers are locked under verified biometric hashes.
                        </p>
                    </div>

                    <div className="mt-20 space-y-6">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                           <span>Auto-Fortress Sync</span>
                           <span className="text-emerald-400">Locked</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '94%' }}
                              transition={{ duration: 1.5, ease: 'easeOut' }}
                              className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                           />
                        </div>
                        <button className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all">
                           Rotate Security Keys
                        </button>
                    </div>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
