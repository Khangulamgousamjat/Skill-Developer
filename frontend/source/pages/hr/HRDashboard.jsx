import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import axiosInstance from '../../api/axios';
import { 
  Users, Award, ClipboardCheck, BookCheck, 
  TrendingUp, Users2, ShieldCheck, 
  ArrowUpRight, Plus, Eye, Clock, Building
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function HRDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterns: 0,
    pendingOnboarding: 0,
    certificatesIssued: 0,
    avgAttendance: '92%'
  });
  const [interns, setInterns] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [internsRes, attendanceRes, certsRes] = await Promise.all([
        axiosInstance.get('/hr/interns').catch(() => ({ data: { success: false } })),
        axiosInstance.get('/hr/attendance').catch(() => ({ data: { success: false } })),
        axiosInstance.get('/certificates').catch(() => ({ data: { success: false } })) // Assuming get all certs for HR
      ]);

      if (internsRes.data?.success) {
        const data = internsRes.data.data;
        setInterns(data.slice(0, 5));
        setStats(prev => ({
          ...prev,
          totalInterns: data.length,
          pendingOnboarding: data.filter(i => !i.checklist_completed).length
        }));
      }

      if (attendanceRes.data?.success) {
        setAttendance(attendanceRes.data.data.slice(0, 5));
      }

      if (certsRes.data?.success) {
        setStats(prev => ({ ...prev, certificatesIssued: certsRes.data.data.length }));
      }

    } catch (err) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    { name: 'Coding', count: Math.floor(stats.totalInterns * 0.45) },
    { name: 'Design', count: Math.floor(stats.totalInterns * 0.25) },
    { name: 'HR', count: Math.floor(stats.totalInterns * 0.15) },
    { name: 'Other', count: Math.floor(stats.totalInterns * 0.15) },
  ];

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
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">HR Management Hub</h1>
            <p className="text-[var(--color-text-muted)] mt-1">Personnel overview & organizational performance</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => navigate('/hr/evaluations')} className="flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Plus size={18} />
                Issue Certificate
             </button>
             <button className="flex items-center gap-2 px-5 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl font-bold text-sm hover:bg-[var(--color-surface-2)] transition-all">
                <Eye size={18} />
                View All Records
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard title="Total Interns" value={stats.totalInterns} icon={Users} color="primary" />
           <StatCard title="Onboarding" value={stats.pendingOnboarding} icon={ClipboardCheck} color={stats.pendingOnboarding > 0 ? 'warning' : 'success'} subtitle="Pending completion" />
           <StatCard title="Certs Issued" value={stats.certificatesIssued} icon={Award} color="emerald" />
           <StatCard title="Avg Attendance" value={stats.avgAttendance} icon={ShieldCheck} color="info" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
           
           {/* Detailed Onboarding List (Left 60%) */}
           <div className="lg:col-span-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-full">
              <div className="p-8 border-b border-[var(--color-border)] flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <ClipboardCheck size={20} className="text-[var(--color-warning)]" />
                    <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Onboarding Progress</h2>
                 </div>
                 <button onClick={() => navigate('/hr/all-interns')} className="text-xs font-bold text-[var(--color-primary)] hover:underline uppercase tracking-widest">See Detailed List</button>
              </div>
              <div className="flex-1 overflow-y-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-[var(--color-surface-2)]/50 border-b border-[var(--color-border)]">
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Intern</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Status</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-right">Completion</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                       {interns.map(intern => (
                          <tr key={intern.id} className="hover:bg-[var(--color-surface-2)]/30 transition-colors cursor-pointer group" onClick={() => navigate(`/profile/${intern.id}`)}>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold shrink-0">
                                      {intern.full_name?.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{intern.full_name}</p>
                                      <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">{intern.department_name}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                   intern.checklist_completed ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'
                                }`}>
                                   {intern.checklist_completed ? 'Finished' : 'In Progress'}
                                </span>
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex flex-col items-end gap-1.5">
                                   <p className="text-xs font-bold text-[var(--color-text-primary)]">{intern.checklist_completed ? '100%' : '45%'}</p>
                                   <div className="w-24 h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                                      <div className={`h-full ${intern.checklist_completed ? 'bg-green-500' : 'bg-amber-500'} transition-all`} style={{ width: intern.checklist_completed ? '100%' : '45%' }} />
                                   </div>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Attendance Feed (Right 40%) */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 shadow-sm h-full">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <Clock size={20} className="text-[var(--color-info)]" />
                       <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Recent Attendance</h2>
                    </div>
                    <button onClick={() => navigate('/hr/attendance')} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"><ArrowUpRight size={20} /></button>
                 </div>
                 <div className="space-y-6">
                    {attendance.length === 0 ? (
                       <p className="text-center py-8 text-[var(--color-text-muted)] italic">No attendance records found yet.</p>
                    ) : (
                       attendance.map((log, idx) => (
                          <div key={idx} className="flex gap-4 group">
                             <div className="w-1.5 h-12 bg-blue-500/10 rounded-full flex flex-col justify-end overflow-hidden group-hover:bg-blue-500/20 transition-colors">
                                <div className="w-full bg-blue-500" style={{ height: `${Math.min(log.duration_watched_minutes, 60)}%` }} />
                             </div>
                             <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-[var(--color-text-primary)] truncate">{log.intern_name}</h4>
                                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 truncate">{log.lecture_title}</p>
                                <div className="flex items-center justify-between mt-1">
                                   <p className="text-[10px] font-bold text-[var(--color-info)]">{log.duration_watched_minutes} min watched</p>
                                   <p className="text-[9px] text-[var(--color-text-muted)] font-black uppercase">{new Date(log.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
                 <button onClick={() => navigate('/hr/attendance')} className="w-full mt-8 py-4 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-2xl font-bold text-xs uppercase tracking-widest hover:translate-y-[-2px] transition-all">
                    Full Attendance Log
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Department Breakdown */}
           <div className="lg:col-span-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-lg font-bold font-sora text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                 <Building size={18} className="text-[var(--color-primary)]" />
                 Departments
              </h3>
              <div className="space-y-5">
                 {departments.map((dept, idx) => (
                    <div key={idx} className="space-y-1.5">
                       <div className="flex justify-between items-end text-xs font-bold text-[var(--color-text-primary)]">
                          <span>{dept.name}</span>
                          <span className="text-[var(--color-text-muted)]">{dept.count}</span>
                       </div>
                       <div className="w-full bg-[var(--color-surface-2)] h-2 rounded-full overflow-hidden">
                          <div 
                             className="h-full bg-[var(--color-primary)] transition-all duration-1000" 
                             style={{ width: `${(dept.count / (stats.totalInterns || 1)) * 100}%` }} 
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Quick Announcement Box */}
           <div className="lg:col-span-3 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 translate-z-0">
                 <div className="shrink-0 w-32 h-32 bg-[var(--color-surface)] rounded-3xl p-4 shadow-xl shadow-indigo-500/10 border border-white/10 flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Pending</p>
                    <p className="text-4xl font-black text-indigo-600 font-sora">{stats.pendingOnboarding}</p>
                 </div>
                 <div className="flex-1">
                    <h3 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Optimize Productivity</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-2 max-w-lg">
                       There are {stats.pendingOnboarding > 0 ? stats.pendingOnboarding : 'no'} students currently in the onboarding stage. Reach out to them to ensure their integration into the organization is seamless.
                    </p>
                    <div className="flex gap-4 mt-6">
                       <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Send Reminders</button>
                       <button className="px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-indigo-600 rounded-xl font-bold text-sm hover:translate-y-[-2px] transition-all">Download Protocol</button>
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <TrendingUp size={120} />
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
