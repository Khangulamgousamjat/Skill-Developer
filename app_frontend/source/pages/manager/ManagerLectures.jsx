import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Video, Plus, 
  Users, MapPin, Search, Filter,
  Loader2, CheckCircle2, AlertCircle,
  ExternalLink, CalendarDays, MoreVertical,
  ChevronRight, BrainCircuit
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManagerLectures() {
  const { t } = useLanguage();
  const isDarkMode = useSelector((s) => s.ui.theme === 'dark');
  const [lectures, setLectures] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledAt: '',
    meetingLink: '',
    TeacherId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lectRes, usersRes] = await Promise.all([
        api.get('/manager/lectures'),
        api.get('/api/users?role=Teacher') // Assuming this works or I'll just filter
      ]);
      
      if (lectRes.data.success) {
        setLectures(lectRes.data.data);
      }
      
      // If users endpoint doesn't support filtering yet, I'll filter here
      const TeacherUsers = (usersRes.data.data || []).filter(u => u.role === 'Teacher' || u.role === 'teacher');
      setTeachers(TeacherUsers);
    } catch (err) {
      toast.error('Failed to synchronize lecture schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      setScheduling(true);
      const res = await api.post('/manager/lectures', formData);
      if (res.data.success) {
        toast.success('Lecture successfully scheduled');
        setShowScheduleModal(false);
        setFormData({ title: '', description: '', scheduledAt: '', meetingLink: '', TeacherId: '' });
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to broadcast lecture schedule');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              Learning Sessions
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">Strategic scheduling and coordination of departmental lectures</p>
          </div>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2.5 px-8 py-4 bg-[var(--color-primary)] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-[var(--color-primary)]/20 hover:translate-y-[-4px] active:scale-95 transition-all group"
          >
             <Plus size={18} />
             Schedule Session
             <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-5">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] tracking-[0.2em]">Retrieving departmental calendar...</p>
          </div>
        ) : lectures.length === 0 ? (
          <div className="py-32 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem]">
             <Calendar className="w-20 h-20 mx-auto mb-6 text-[var(--color-text-muted)] opacity-20" />
             <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">Calendar empty</h3>
             <p className="text-[var(--color-text-muted)] mt-2">Start by scheduling your department's first Teacher session</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {lectures.map(lecture => (
              <div key={lecture.id} className="group p-8 rounded-[3rem] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/5 relative overflow-hidden flex flex-col">
                 {/* Visual Accent */}
                 <div className="absolute top-0 right-0 p-8 text-[var(--color-primary)]/5 group-hover:scale-110 transition-transform duration-700">
                    <BrainCircuit size={120} />
                 </div>

                 <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                       <div className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                          {lecture.status}
                       </div>
                    </div>
                    <button className="p-3 rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                       <MoreVertical size={18} />
                    </button>
                 </div>

                 <div className="flex-1 relative z-10">
                    <h3 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                       {lecture.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] mb-8 line-clamp-3 leading-relaxed">{lecture.description}</p>
                    
                    <div className="space-y-4 mb-8">
                       <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-surface-2)]/50 border border-[var(--color-border)]/50">
                          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shadow-inner">
                             <Clock size={18} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Time & Date</p>
                             <p className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">
                                {new Date(lecture.scheduled_at).toLocaleString([], { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                             </p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-surface-2)]/50 border border-[var(--color-border)]/50">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                             <Users size={18} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Session Teacher</p>
                             <p className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">{lecture.Teacher_name}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-auto pt-6 border-t border-[var(--color-border)]/50 flex items-center gap-4 relative z-10">
                    <a 
                       href={lecture.meeting_link} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex-1 py-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all shadow-sm active:scale-95"
                    >
                       <Video size={16} /> Enter Classroom
                    </a>
                    <button className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)]/50 transition-all">
                       <ExternalLink size={18} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* Schedule Modal */}
        <AnimatePresence>
          {showScheduleModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-24 overflow-hidden">
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 onClick={() => setShowScheduleModal(false)}
                 className="absolute inset-0 bg-[var(--color-background)]/80 backdrop-blur-xl"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: 20 }}
                 className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3.5rem] shadow-2xl relative z-10 overflow-hidden"
               >
                  <div className="p-10 sm:p-14">
                    <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)] mb-2">Schedule Matrix Session</h2>
                    <p className="text-sm text-[var(--color-text-muted)] mb-10">Broadcast a new learning opportunity to your department.</p>
                    
                    <form onSubmit={handleSchedule} className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] ml-1">Lecture Designation</label>
                          <input 
                            required
                            type="text"
                            placeholder="e.g., Advanced React Architecture"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-[var(--color-text-primary)] text-sm shadow-sm"
                          />
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] ml-1">Session Teacher</label>
                             <select 
                               required
                               value={formData.TeacherId}
                               onChange={(e) => setFormData({...formData, TeacherId: e.target.value})}
                               className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-[var(--color-text-primary)] text-sm shadow-sm"
                             >
                                <option value="">Select Domain Teacher</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] ml-1">Initiation Time</label>
                             <input 
                               required
                               type="datetime-local"
                               value={formData.scheduledAt}
                               onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                               className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-[var(--color-text-primary)] text-sm shadow-sm"
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] ml-1">Live Environment Link</label>
                          <div className="relative">
                             <Video className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                             <input 
                               required
                               type="url"
                               placeholder="https://zoom.us/j/..."
                               value={formData.meetingLink}
                               onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                               className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-[var(--color-text-primary)] text-sm shadow-sm"
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] ml-1">Abstract & Objectives</label>
                          <textarea 
                            rows="3"
                            placeholder="Briefly describe the session goals..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-[var(--color-text-primary)] text-sm shadow-sm resize-none"
                          />
                       </div>

                       <div className="pt-6 flex gap-4">
                          <button 
                            type="button" 
                            onClick={() => setShowScheduleModal(false)}
                            className="flex-1 py-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all active:scale-95 shadow-sm"
                          >
                             Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={scheduling}
                            className="flex-1 py-4 rounded-2xl bg-[var(--color-primary)] text-white text-xs font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-[var(--color-primary)]/20 hover:translate-y-[-4px] active:scale-95 disabled:opacity-50"
                          >
                             {scheduling ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Broadcast Schedule"}
                          </button>
                       </div>
                    </form>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
