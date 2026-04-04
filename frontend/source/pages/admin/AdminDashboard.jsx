import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import axiosInstance from '../../api/axios';
import { 
  Users, Building2, Award, Clock, 
  ShieldCheck, AlertTriangle, Zap, 
  Database, Plus, ChevronRight, Search,
  Activity, UserPlus, FileText, Settings,
  CheckCircle2, Bell, RefreshCw, Loader2
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
      const [usersRes, deptsRes, roleReqRes, certsRes] = await Promise.all([
        axiosInstance.get('/users?limit=5&sort=newest').catch(() => ({ data: { success: false } })),
        axiosInstance.get('/departments').catch(() => ({ data: { success: false } })),
        axiosInstance.get('/admin/role-requests?status=pending').catch(() => ({ data: { success: false } })),
        axiosInstance.get('/certificates').catch(() => ({ data: { success: false } }))
      ]);

      if (usersRes.data?.success) {
        setRecentActions(usersRes.data.data.map(u => ({ ...u, type: 'user_joined' })));
        setStats(prev => ({ ...prev, totalUsers: usersRes.data.pagination?.total || usersRes.data.data.length }));
      }

      if (deptsRes.data?.success) {
        setStats(prev => ({ ...prev, totalDepartments: deptsRes.data.data.length }));
      }

      if (roleReqRes.data?.success) {
        setPendingRequests(roleReqRes.data.data.slice(0, 5));
        setStats(prev => ({ ...prev, pendingApprovals: roleReqRes.data.data.length }));
      }

      if (certsRes.data?.success) {
        setStats(prev => ({ ...prev, totalCertificates: certsRes.data.data.length }));
      }

    } catch (err) {
      toast.error('Failed to load platform analytics');
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
      <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* HERO SECTION: PLATFORM HEALTH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
           
           {/* System Health Card */}
           <div className="lg:col-span-8 bg-[#0F1117] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5 flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000" />
              
              <div className="relative z-10 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                       <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                       <h1 className="text-3xl font-bold font-sora">Super Admin Console</h1>
                       <p className="text-white/40 text-sm mt-1">Institutional Oversight & System Control</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">All Systems Operational</span>
                 </div>
              </div>

              <div className="relative z-10 mt-12 grid grid-cols-3 gap-8">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Global Health</p>
                    {loading ? <Skeleton className="h-8 w-20 bg-white/10" /> : <p className="text-2xl font-bold font-sora">99.8%</p>}
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Active Clusters</p>
                    {loading ? <Skeleton className="h-8 w-20 bg-white/10" /> : <p className="text-2xl font-bold font-sora">3 Regionally</p>}
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Platform Uptime</p>
                    {loading ? <Skeleton className="h-8 w-20 bg-white/10" /> : <p className="text-2xl font-bold font-sora">{stats.systemUptime}</p>}
                 </div>
              </div>
           </div>

           {/* Quick Stats Column */}
           <div className="lg:col-span-4 grid grid-cols-1 gap-6">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2rem] p-6 shadow-sm flex flex-col justify-between group hover:border-[var(--color-primary)] transition-all">
                 <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                       <ShieldCheck size={28} />
                    </div>
                    <div className="text-right">
                       {loading ? <Skeleton className="h-8 w-12 ml-auto" /> : <p className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{stats.pendingApprovals}</p>}
                       <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Awaiting Verification</p>
                    </div>
                 </div>
                 <button onClick={() => navigate('/admin/approvals')} className="w-full py-3 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-xl font-bold text-xs uppercase tracking-widest group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                    Process Approvals
                 </button>
              </div>
              
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
                 <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                       <Award size={28} />
                    </div>
                    <div className="text-right">
                       {loading ? <Skeleton className="h-8 w-12 ml-auto" /> : <p className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{stats.totalCertificates}</p>}
                       <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Verified Achievements</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* STATS ANALYTICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="primary" loading={loading} />
           <StatCard title="Departments" value={stats.totalDepartments} icon={Building2} color="info" loading={loading} />
           <StatCard title="Storage Load" value="4.2 GB" icon={Database} color="warning" loading={loading} />
           <StatCard title="Uptime Status" value="Online" icon={Activity} color="emerald" loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
           
           {/* UNIFIED ACTION FEED (Left 30%) */}
           <div className="lg:col-span-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col min-h-[500px]">
              <div className="p-8 border-b border-[var(--color-border)] flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                       <Activity size={20} />
                    </div>
                    <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Action Center</h2>
                 </div>
                 <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="p-2 hover:bg-[var(--color-surface-2)] rounded-lg transition-colors text-[var(--color-text-muted)]">
                       <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button 
                       onClick={() => navigate('/admin/logs')}
                       className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline px-2"
                    >
                       View Audit Trail
                    </button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                 <div className="divide-y divide-[var(--color-border)]">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <div key={i} className="p-8 flex items-center gap-4">
                           <Skeleton className="w-12 h-12 rounded-2xl" />
                           <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                           </div>
                        </div>
                      ))
                    ) : (
                      <AnimatePresence>
                         {/* Priority: Pending Approvals */}
                         {pendingRequests.map(req => (
                            <motion.div 
                               key={req.id} 
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               className="p-8 bg-amber-500/5 hover:bg-amber-500/10 transition-colors group flex items-start justify-between gap-4"
                            >
                               <div className="flex items-start gap-4 min-w-0">
                                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex flex-col items-center justify-center shrink-0 border border-amber-500/20">
                                     <UserPlus size={20} className="text-amber-600" />
                                  </div>
                                  <div className="min-w-0">
                                     <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-[var(--color-text-primary)] text-sm truncate">{req.full_name}</h4>
                                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 text-[9px] font-black uppercase tracking-tighter">PENDING APPROVAL</span>
                                     </div>
                                     <p className="text-xs text-[var(--color-text-muted)] line-clamp-1 truncate">Requesting <span className="text-[var(--color-text-primary)] font-bold">{req.requested_role?.replace('_', ' ')}</span> role</p>
                                     <p className="text-[10px] text-[var(--color-text-muted)] mt-2 font-bold uppercase flex items-center gap-1">
                                        <Clock size={10} /> {new Date(req.requested_at).toLocaleTimeString() || 'Just now'}
                                     </p>
                                  </div>
                               </div>
                               <button onClick={() => navigate('/admin/approvals')} className="p-3 bg-white border border-[var(--color-border)] rounded-2xl text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm">
                                  <ChevronRight size={20} />
                                </button>
                            </motion.div>
                         ))}

                         {/* Recent User Signups */}
                         {recentActions.map(action => (
                            <motion.div 
                               key={action.id} 
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               className="p-8 hover:bg-[var(--color-surface-2)]/30 transition-colors group flex items-start justify-between gap-4"
                            >
                               <div className="flex items-start gap-4 min-w-0">
                                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-2)] flex flex-col items-center justify-center shrink-0 border border-[var(--color-border)]">
                                     <CheckCircle2 size={20} className="text-emerald-500" />
                                  </div>
                                  <div className="min-w-0">
                                     <h4 className="font-bold text-[var(--color-text-primary)] text-sm truncate">{action.full_name}</h4>
                                     <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">Joined the <span className="text-[var(--color-text-primary)] font-bold">{action.role?.replace('_', ' ')}</span> fleet</p>
                                     <p className="text-[10px] text-[var(--color-text-muted)] mt-2 font-bold uppercase flex items-center gap-1">
                                        <Clock size={10} /> {new Date(action.created_at).toLocaleTimeString() || 'Active session'}
                                     </p>
                                  </div>
                               </div>
                               <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => navigate(`/admin/users`)} className="p-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all">
                                     <Settings size={18} />
                                  </button>
                               </div>
                            </motion.div>
                         ))}
                      </AnimatePresence>
                    )}
                 </div>
              </div>
           </div>

           {/* PLATFORM MANAGEMENT HUB (Right 20%) */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* Management Grid */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 shadow-sm">
                 <h3 className="text-lg font-bold font-sora text-[var(--color-text-primary)] mb-8 flex items-center gap-2">
                    <Database size={18} className="text-[var(--color-primary)]" />
                    Platform Assets
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                    {menuItems.map((item, idx) => (
                       <button 
                          key={idx} 
                          onClick={() => navigate(item.path)}
                          className="p-6 bg-[var(--color-surface-2)]/40 hover:bg-[var(--color-surface-2)]/70 border border-transparent hover:border-[var(--color-border)] rounded-[2rem] transition-all flex flex-col items-center text-center gap-3 group"
                       >
                          <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform ${item.color}`}>
                             <item.icon size={22} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-primary)] opacity-60 group-hover:opacity-100">{item.label}</span>
                       </button>
                    ))}
                 </div>
              </div>

              {/* System Health / Alerts */}
              <div className="bg-gradient-to-br from-slate-900 to-[#070D1A] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group border border-white/5">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                    <Settings size={140} />
                 </div>
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                          <ShieldCheck size={24} className="text-blue-400" />
                       </div>
                       <h3 className="text-xl font-bold font-sora mb-2">Internal Compliance</h3>
                       <p className="text-xs text-white/40 leading-relaxed font-medium">
                          The platform is currently operating under standard institutional protocols. No unauthorized access attempts detected.
                       </p>
                    </div>

                    <div className="mt-12 space-y-4">
                       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                          <span>Auto-Diagnostics</span>
                          <span className="text-emerald-400">Stable</span>
                       </div>
                       <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="w-[90%] h-full bg-blue-500 rounded-full" />
                       </div>
                       <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                          Secure API Keys
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
