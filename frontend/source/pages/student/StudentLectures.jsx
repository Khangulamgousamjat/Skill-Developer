import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Video, Play, 
  User, CheckCircle2, AlertCircle, 
  Search, Filter, Loader2,
  Bell, Bookmark, Share2, Sparkles,
  Link as LinkIcon, ExternalLink
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isAfter, isBefore, addDays } from 'date-fns';

export default function StudentLectures() {
  const { t } = useLanguage();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/student/lectures');
      if (res.data.success) {
        setLectures(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const filteredLectures = lectures.filter(l => {
    const lectureTime = new Date(`${l.date}T${l.time}`);
    const isUpcoming = isAfter(lectureTime, new Date());
    if (filter === 'upcoming') return isUpcoming;
    if (filter === 'past') return !isUpcoming;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] tracking-tight">Interactive Live Classes</h1>
            <p className="text-[var(--color-text-muted)] mt-1.5 text-sm">Join real-time sessions with experts and clarify your doubts</p>
          </div>
          <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 rounded-2xl shadow-sm">
             <button 
               onClick={() => setFilter('all')}
               className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'all' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'}`}
             >
               Every Session
             </button>
             <button 
               onClick={() => setFilter('upcoming')}
               className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'upcoming' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'}`}
             >
               Upcoming
             </button>
             <button 
               onClick={() => setFilter('past')}
               className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'past' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'}`}
             >
               Past Sessions
             </button>
          </div>
        </div>

        {/* Schedule Hero Card */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-amber-600 rounded-[40px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                 <div className="flex items-center gap-2 mb-6 bg-black/10 backdrop-blur-md w-fit px-4 py-1.5 rounded-full border border-white/20">
                    <Sparkles size={14} className="text-amber-200" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Real-Time Learning</span>
                 </div>
                 <h2 className="text-4xl font-bold font-sora leading-tight mb-4">Never Miss a Session</h2>
                 <p className="text-white/80 text-lg leading-relaxed max-w-lg mb-8">
                    Stay on top of your growth by attending live masterclasses. All sessions are recorded and available within 24 hours.
                 </p>
                 <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                       <Calendar size={20} />
                       <span className="font-bold text-sm">Monthly Schedule Enabled</span>
                    </div>
                    <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                       <Bell size={20} className="animate-swing" />
                       <span className="font-bold text-sm">Notifications Active</span>
                    </div>
                 </div>
              </div>
              <div className="hidden lg:flex justify-end">
                 <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                       <div key={i} className={`w-28 h-28 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center gap-2 ${i % 2 === 0 ? 'translate-y-8' : ''}`}>
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                             <Video size={18} />
                          </div>
                          <span className="text-[8px] font-black tracking-widest uppercase opacity-60">Module {i}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Lectures List */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[4px] text-[var(--color-text-muted)] animate-pulse">Syncing Calendar...</p>
          </div>
        ) : filteredLectures.length === 0 ? (
          <div className="py-24 text-center bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[40px] shadow-sm">
            <div className="w-20 h-20 bg-[var(--color-surface-2)] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Calendar size={32} className="text-[var(--color-text-muted)] opacity-30" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">No sessions scheduled</h3>
            <p className="text-[var(--color-text-muted)] mt-2 italic text-sm">Check back later or explore the video library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredLectures.map((lecture) => {
                const lectureTime = new Date(`${lecture.date}T${lecture.time}`);
                const isUpcoming = isAfter(lectureTime, new Date());
                
                return (
                  <motion.div 
                    key={lecture.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 group relative text-left"
                  >
                    <div className="h-2 bg-gradient-to-r from-[var(--color-primary)] to-amber-500 opacity-50" />
                    <div className="p-8">
                       <div className="flex items-center justify-between mb-6">
                          <div className={`p-2.5 rounded-xl ${isUpcoming ? 'bg-indigo-500/10 text-indigo-500' : 'bg-[var(--color-success)]/10 text-[var(--color-success)]'}`}>
                             <Calendar size={20} />
                          </div>
                          <span className={`text-[8px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full border ${isUpcoming ? 'border-indigo-500/20 text-indigo-500' : 'border-[var(--color-success)]/20 text-[var(--color-success)] animate-pulse'}`}>
                             {isUpcoming ? 'upcoming' : 'recorded'}
                          </span>
                       </div>

                       <h3 className="text-lg font-bold font-sora text-[var(--color-text-primary)] mb-3 h-14 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors leading-relaxed">
                         {lecture.title}
                       </h3>
                       
                       <p className="text-xs text-[var(--color-text-muted)] mb-8 line-clamp-2 h-10 leading-relaxed italic">
                         {lecture.description || 'Full-scale interactive session on curriculum deep-dives and application.'}
                       </p>

                       <div className="flex flex-col gap-4 pt-6 border-t border-[var(--color-border)]">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center border border-[var(--color-border)] overflow-hidden">
                                   {lecture.teacher_photo ? <img src={lecture.teacher_photo} className="w-full h-full object-cover" /> : <User size={14} className="text-[var(--color-text-muted)]" />}
                                </div>
                                <span className="text-xs font-bold text-[var(--color-text-primary)]">{lecture.teacher_name}</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                                <Clock size={12} />
                                <span className="text-[10px] font-bold">{lecture.duration}m</span>
                             </div>
                          </div>
                          
                          <div className="flex items-center justify-between bg-[var(--color-surface-2)]/50 p-4 rounded-2xl border border-[var(--color-border)]">
                             <div>
                                <p className="text-[9px] font-black uppercase tracking-tight text-[var(--color-text-muted)]">Date & Time</p>
                                <p className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">
                                  {format(new Date(lecture.date), 'MMM dd')} • {lecture.time}
                                </p>
                             </div>
                             {isUpcoming ? (
                               <a 
                                 href={lecture.meeting_link} 
                                 target="_blank" 
                                 rel="noreferrer"
                                 className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20 hover:scale-110 transition-transform"
                               >
                                  <ExternalLink size={18} />
                               </a>
                             ) : (
                               <button className="w-10 h-10 rounded-xl bg-[var(--color-success)] text-white flex items-center justify-center shadow-lg shadow-[var(--color-success)]/10 hover:scale-110 transition-transform">
                                  <Play size={18} />
                               </button>
                             )}
                          </div>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
