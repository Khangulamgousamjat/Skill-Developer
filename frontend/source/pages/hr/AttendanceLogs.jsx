import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Users, Clock, Search, Filter, 
  Download, Calendar, Loader2, PlayCircle,
  TrendingUp, ArrowUpDown, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AttendanceLogs() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/hr/attendance');
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    (log.intern_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.lecture_title?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">Attendance Records</h1>
            <p className="text-[var(--color-text-muted)] mt-1">Detailed logs of student participation and engagement</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-5 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl font-bold text-sm hover:bg-[var(--color-surface-2)] transition-all">
                <Download size={18} />
                Export CSV
             </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
             <input 
               type="text" 
               placeholder="Search by student or lecture title..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10 pr-4 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm w-full outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
             />
           </div>
           <select 
             value={filterDept}
             onChange={(e) => setFilterDept(e.target.value)}
             className="px-4 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
           >
             <option value="All">All Departments</option>
             <option value="Coding">Coding</option>
             <option value="Design">Design</option>
             <option value="HR">HR</option>
           </select>
        </div>

        {/* Logs Table */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
           {loading ? (
             <div className="py-20 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p>Retrieving logs...</p>
             </div>
           ) : filteredLogs.length === 0 ? (
             <div className="py-20 text-center text-[var(--color-text-muted)]">
                <Clock size={40} className="mx-auto mb-3 opacity-20" />
                <p>No attendance logs found matching your criteria.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-[var(--color-surface-2)]/50 border-b border-[var(--color-border)]">
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Intern</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Lecture Session</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Engagement</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-right">Date & Time</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[var(--color-border)]">
                      <AnimatePresence>
                         {filteredLogs.map((log, idx) => (
                            <motion.tr 
                              key={log.id || idx}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="hover:bg-[var(--color-surface-2)]/30 transition-colors group cursor-pointer"
                            >
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold shrink-0">
                                        {log.intern_name?.charAt(0)}
                                     </div>
                                     <div>
                                        <p className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{log.intern_name}</p>
                                        <span className="text-[10px] text-[var(--color-text-muted)] font-black uppercase tracking-widest">Intern</span>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-5">
                                  <div className="flex flex-col gap-1">
                                     <p className="text-sm font-bold text-[var(--color-text-primary)] leading-tight">{log.lecture_title}</p>
                                     <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)] font-bold uppercase">
                                        <PlayCircle size={10} className="text-[var(--color-primary)]" /> Live Session
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-2">
                                     <div className="w-24 h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full ${log.duration_watched_minutes > 45 ? 'bg-green-500' : 'bg-amber-500'} transition-all`} 
                                          style={{ width: `${Math.min((log.duration_watched_minutes / 60) * 100, 100)}%` }} 
                                        />
                                     </div>
                                     <span className="text-xs font-bold text-[var(--color-text-primary)]">{log.duration_watched_minutes}m</span>
                                  </div>
                               </td>
                               <td className="px-8 py-5 text-right">
                                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{new Date(log.joined_at).toLocaleDateString()}</p>
                                  <p className="text-xs text-[var(--color-text-muted)]">{new Date(log.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                               </td>
                            </motion.tr>
                         ))}
                      </AnimatePresence>
                   </tbody>
                </table>
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
}
