import React, { useState, useEffect } from 'react';
import { 
  Calendar, Search, Filter, Download, 
  User, BookOpen, Clock, Loader2,
  CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const { t } = useLanguage();
  const isDarkMode = useSelector((s) => s.ui.theme === 'dark');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hr/attendance');
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load attendance logs');
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter(log => 
    (log.intern_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.lecture_title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-info)]/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[var(--color-info)]" />
              </div>
              Attendance Tracking
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">Monitor intern participation in live lectures and workshops</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-bold text-sm hover:translate-y-[-2px] transition-all shadow-sm hover:shadow-md">
            <Download size={18} className="text-[var(--color-primary)]" />
            Export Logs
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input 
              type="text"
              placeholder="Search by intern or lecture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm focus:ring-2 focus:ring-[var(--color-primary)]/50 outline-none transition-all text-[var(--color-text-primary)]"
            />
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-3">
            <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
            <input 
              type="date"
              className="bg-transparent border-none text-sm font-bold text-[var(--color-text-primary)] outline-none cursor-pointer"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">Loading attendance records...</p>
          </div>
        ) : (
          <div className="rounded-[2.5rem] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] bg-[var(--color-surface-2)]/50">
                  <tr>
                    <th className="px-8 py-5">Intern</th>
                    <th className="px-8 py-5">Lecture Session</th>
                    <th className="px-8 py-5">Joined At</th>
                    <th className="px-8 py-5">Duration</th>
                    <th className="px-8 py-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center">
                         <div className="flex flex-col items-center gap-3 opacity-20">
                            <AlertCircle size={40} className="text-[var(--color-text-muted)]" />
                            <p className="text-sm font-bold text-[var(--color-text-muted)]">No records found</p>
                         </div>
                      </td>
                    </tr>
                  ) : filtered.map(log => (
                    <tr key={log.id} className="hover:bg-[var(--color-surface-2)]/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[var(--color-surface-2)] flex items-center justify-center border border-[var(--color-border)]">
                            <User size={14} className="text-[var(--color-text-muted)]" />
                          </div>
                          <span className="font-bold text-sm text-[var(--color-text-primary)]">{log.intern_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} className="text-[var(--color-primary)]" />
                          <span className="text-sm font-medium text-[var(--color-text-secondary)]">{log.lecture_title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-[var(--color-text-muted)]">
                          {new Date(log.joined_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[var(--color-text-muted)]" />
                          <span className="text-xs font-black text-[var(--color-text-primary)]">{log.duration_watched_minutes} mins</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {log.duration_watched_minutes > 45 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-500/10">
                            <CheckCircle2 size={12} />
                            Present
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-wider border border-amber-500/10">
                            <AlertCircle size={12} />
                            Partial
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

