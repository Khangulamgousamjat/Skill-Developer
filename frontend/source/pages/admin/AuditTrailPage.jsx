import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  FileText, Search, Filter, 
  Trash2, RefreshCw, Loader2,
  ShieldAlert, User, ShieldCheck, 
  Clock, Server, ChevronRight,
  Database, Activity, Globe, Monitor
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../../components/shared/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

export default function AuditTrailPage() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/logs');
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to retrieve system audit stream');
    } finally {
      setLoading(false);
    }
  };

  const getSeverity = (action) => {
    const act = action?.toLowerCase() || '';
    if (act.includes('error') || act.includes('fail') || act.includes('delete') || act.includes('rejected')) return 'error';
    if (act.includes('update') || act.includes('toggle') || act.includes('approve')) return 'warning';
    return 'info';
  };

  const filteredLogs = logs.filter(log => 
    (log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.user_name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterAction === 'All' || log.action === filterAction)
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-3xl bg-slate-500/10 flex items-center justify-center text-slate-500 shadow-inner border border-slate-500/20">
                <Activity size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">System Audit Trail</h1>
                <p className="text-[var(--color-text-muted)] text-sm mt-0.5">Immutable record of platform administrative operations and state changes</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={fetchLogs} 
                className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl hover:bg-[var(--color-surface-2)] transition-all shadow-sm active:scale-95"
                title="Refresh Feed"
             >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
             </button>
             <div className="h-10 w-[1px] bg-[var(--color-border)] mx-2 hidden md:block" />
             <div className="px-5 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl flex items-center gap-3 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-primary)]">Monitoring Active</span>
             </div>
          </div>
        </div>

        {/* Intelligence Matrix (Filters) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
           <div className="lg:col-span-3 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Query system events, identities, or operational payloads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-[var(--color-surface)] border border-[var(--color-border)] text-sm outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all text-[var(--color-text-primary)] shadow-sm"
              />
           </div>
           <div className="relative">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <select 
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full pl-12 pr-6 py-5 rounded-[2rem] bg-[var(--color-surface)] border border-[var(--color-border)] text-sm outline-none appearance-none cursor-pointer font-bold text-[var(--color-text-primary)] focus:border-[var(--color-primary)] transition-all"
              >
                <option value="All">All Operations</option>
                {Array.from(new Set(logs.map(l => l.action))).map(act => (
                  <option key={act} value={act}>{act?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}</option>
                ))}
              </select>
           </div>
        </div>

        {/* Audit Stream */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] overflow-hidden shadow-sm min-h-[400px] flex flex-col">
           <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-[var(--color-surface-2)]/50 border-b border-[var(--color-border)] sticky top-0 z-10 backdrop-blur-md">
                       <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Operational Event</th>
                       <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Executing Identity</th>
                       <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Audit Segment</th>
                       <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-right">Chronology</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[var(--color-border)]">
                    {loading && logs.length === 0 ? (
                       [...Array(6)].map((_, i) => (
                          <tr key={i} className="animate-pulse">
                             <td className="px-10 py-8"><div className="flex gap-5"><Skeleton className="w-14 h-14 rounded-2xl shrink-0" /><div className="space-y-2 flex-1"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-64" /></div></div></td>
                             <td className="px-10 py-8"><div className="flex items-center gap-4"><Skeleton className="w-10 h-10 rounded-xl" /><div className="space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-2 w-12" /></div></div></td>
                             <td className="px-10 py-8"><Skeleton className="h-4 w-16 rounded-full" /></td>
                             <td className="px-10 py-8 text-right"><div className="space-y-2 ml-auto"><Skeleton className="h-3 w-20 ml-auto" /><Skeleton className="h-5 w-24 rounded-lg ml-auto" /></div></td>
                          </tr>
                       ))
                    ) : filteredLogs.length === 0 ? (
                       <tr>
                          <td colSpan="4" className="py-20 text-center">
                             <EmptyState 
                                icon={Activity}
                                title="Null Activity Detected"
                                description="No historical records found for the current query matrix. Adjust your filters or wait for system events."
                                actionLabel="Refresh Data Stream"
                                onAction={fetchLogs}
                             />
                          </td>
                       </tr>
                    ) : (
                       filteredLogs.map(log => {
                          const severity = getSeverity(log.action);
                          return (
                            <motion.tr 
                               key={log.id} 
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               className="hover:bg-[var(--color-surface-2)]/30 transition-colors group cursor-default"
                            >
                               <td className="px-10 py-8">
                                  <div className="flex items-center gap-5">
                                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-105 shadow-inner ${
                                        severity === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                                        severity === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 
                                        'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
                                     }`}>
                                        {severity === 'error' ? <ShieldAlert size={28} /> : 
                                         severity === 'warning' ? <Server size={28} /> : 
                                         <ShieldCheck size={28} />}
                                     </div>
                                     <div className="min-w-0">
                                        <p className="font-bold text-[var(--color-text-primary)] text-lg mb-1 tracking-tight uppercase text-xs">{log.action?.replace('_', ' ')}</p>
                                        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-2 max-w-lg">
                                           {log.description}
                                        </p>
                                        {log.ip_address && (
                                          <div className="flex items-center gap-2 mt-2 text-[10px] font-black text-slate-500">
                                             <Monitor size={12} />
                                             IP: {log.ip_address}
                                          </div>
                                        )}
                                     </div>
                                  </div>
                               </td>
                               <td className="px-10 py-8">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/5 flex items-center justify-center text-white font-black text-xs shadow-lg">
                                        {log.user_name?.charAt(0).toUpperCase() || 'S'}
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold text-[var(--color-text-primary)]">{log.user_name || 'System Auto'}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] opacity-60">{log.user_role || 'automated'}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-10 py-8">
                                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                     severity === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                                     severity === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 
                                     'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
                                  }`}>
                                     {severity}
                                  </span>
                               </td>
                               <td className="px-10 py-8 text-right">
                                  <div className="flex flex-col items-end gap-1.5">
                                     <p className="text-sm font-bold text-[var(--color-text-primary)]">{new Date(log.created_at).toLocaleDateString()}</p>
                                     <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-surface-2)] rounded-lg text-[10px] text-[var(--color-text-muted)] font-black uppercase tracking-widest border border-[var(--color-border)]">
                                        <Clock size={12} className="text-indigo-500" />
                                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                     </div>
                                  </div>
                               </td>
                            </motion.tr>
                          );
                       })
                    )}
                 </tbody>
              </table>
           </div>
           
           {/* Footer */}
           {!loading && logs.length > 0 && (
             <div className="px-10 py-6 border-t border-[var(--color-border)] bg-[var(--color-surface-2)]/30 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                   Total Audit Trail Integrity: {logs.length} Blocks
                </p>
                <div className="flex items-center gap-2 text-indigo-500 hover:text-indigo-400 cursor-pointer transition-all">
                   <span className="text-[10px] font-black uppercase tracking-widest">Generate Forensic Export</span>
                   <ChevronRight size={16} />
                </div>
             </div>
           )}
        </div>

      </div>
    </DashboardLayout>
  );
}
