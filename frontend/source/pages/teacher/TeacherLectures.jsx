import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Video, Plus, 
  Users, CheckCircle2, AlertCircle, 
  MoreVertical, Search, Filter, Loader2,
  X, MapPin, Link as LinkIcon, Camera
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isAfter, isBefore } from 'date-fns';

export default function TeacherLectures() {
  const { t } = useLanguage();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLecture, setNewLecture] = useState({ 
    title: '', 
    description: '', 
    date: '', 
    time: '', 
    duration: 60,
    meeting_link: '' 
  });

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/teacher/lectures');
      if (res.data.success) {
        setLectures(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load lectures');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/teacher/lectures', newLecture);
      if (res.data.success) {
        toast.success('Lecture scheduled successfully');
        setIsModalOpen(false);
        setNewLecture({ title: '', description: '', date: '', time: '', duration: 60, meeting_link: '' });
        fetchLectures();
      }
    } catch (err) {
      toast.error('Failed to schedule lecture');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Live Class Scheduling</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">Manage your upcoming lectures and interactive sessions</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-semibold text-sm shadow-lg shadow-[var(--color-primary)]/20"
          >
            <Plus size={18} />
            Schedule Session
          </button>
        </div>

        {/* Categories / Filter Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
           <button className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold shadow-lg">All Sessions</button>
           <button className="px-5 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-xl text-xs font-bold hover:bg-[var(--color-surface-2)]">Today</button>
           <button className="px-5 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-xl text-xs font-bold hover:bg-[var(--color-surface-2)]">Recorded</button>
        </div>

        {/* Lectures List */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">fetching your schedule...</p>
          </div>
        ) : lectures.length === 0 ? (
          <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[40px] p-24 text-center">
            <Calendar size={64} className="mx-auto mb-4 text-[var(--color-text-muted)] opacity-20" />
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">No lectures found</h3>
            <p className="text-[var(--color-text-muted)] mt-2 italic max-w-xs mx-auto text-sm leading-relaxed">
              Start by scheduling your first interactive session with your students.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <AnimatePresence>
              {lectures.map((lecture) => {
                const lectureTime = new Date(`${lecture.date}T${lecture.time}`);
                const isUpcoming = isAfter(lectureTime, new Date());
                
                return (
                  <motion.div 
                    key={lecture.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all group relative text-left"
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                           <div className={`p-3 rounded-2xl ${isUpcoming ? 'bg-indigo-500/10 text-indigo-500' : 'bg-[var(--color-success)]/10 text-[var(--color-success)]'}`}>
                              <Video size={24}/>
                           </div>
                           <div>
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${isUpcoming ? 'border-indigo-500/20 text-indigo-500' : 'border-[var(--color-success)]/20 text-[var(--color-success)]'}`}>
                                {isUpcoming ? 'upcoming' : 'completed'}
                              </span>
                              <h3 className="font-bold text-[var(--color-text-primary)] text-lg h-7 mt-1.5 line-clamp-1">{lecture.title}</h3>
                           </div>
                        </div>
                        <button className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-xl transition-all"><MoreVertical size={20}/></button>
                      </div>

                      <p className="text-xs text-[var(--color-text-muted)] mb-8 leading-relaxed line-clamp-2 h-10">
                        {lecture.description || 'Dynamic interactive session covering relevant curriculum modules and technical deep-dives.'}
                      </p>

                      <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[var(--color-border)]">
                         <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-[var(--color-primary)]" />
                            <div>
                               <p className="text-[9px] font-black uppercase tracking-tight text-[var(--color-text-muted)]">Session Date</p>
                               <p className="text-xs font-bold text-[var(--color-text-primary)]">{format(new Date(lecture.date), 'MMM dd, yyyy')}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <Clock size={18} className="text-[var(--color-primary)]" />
                            <div>
                               <p className="text-[9px] font-black uppercase tracking-tight text-[var(--color-text-muted)]">Time & Duration</p>
                               <p className="text-xs font-bold text-[var(--color-text-primary)]">{lecture.time} • {lecture.duration}m</p>
                            </div>
                         </div>
                      </div>

                      <div className="mt-8 flex gap-3">
                         <button className="flex-1 py-3 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-95 transition-all flex items-center justify-center gap-2">
                           <Camera size={14}/> Start Session
                         </button>
                         <button className="flex-1 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-xs font-bold rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
                           <Users size={14}/> {lecture.students_enrolled || 0} Joined
                         </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Schedule Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                        <Plus size={32} />
                      </div>
                      <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)] leading-tight">Schedule New Lecture</h2>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-xl transition-all">
                      <X size={24}/>
                   </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Session Headline</label>
                    <input 
                      required
                      type="text" 
                      value={newLecture.title}
                      onChange={(e) => setNewLecture({...newLecture, title: e.target.value})}
                      placeholder="e.g. Masterclass in Scalable Architecture"
                      className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm focus:border-[var(--color-primary)] outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Date</label>
                        <input 
                          required
                          type="date" 
                          min={format(new Date(), 'yyyy-MM-dd')}
                          value={newLecture.date}
                          onChange={(e) => setNewLecture({...newLecture, date: e.target.value})}
                          className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm outline-none cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Start Time</label>
                        <input 
                          required
                          type="time" 
                          value={newLecture.time}
                          onChange={(e) => setNewLecture({...newLecture, time: e.target.value})}
                          className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm outline-none cursor-pointer"
                        />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Duration (Min)</label>
                        <select 
                          value={newLecture.duration}
                          onChange={(e) => setNewLecture({...newLecture, duration: parseInt(e.target.value)})}
                          className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm outline-none cursor-pointer"
                        >
                           <option value="30">30 Minutes</option>
                           <option value="45">45 Minutes</option>
                           <option value="60">1 Hour</option>
                           <option value="90">1.5 Hours</option>
                           <option value="120">2 Hours</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Meeting Type</label>
                        <div className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm font-bold text-[var(--color-primary)] flex items-center gap-2">
                           <LayoutGrid size={16} /> Virtual Class
                        </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Broadcast Link / URL</label>
                    <div className="relative">
                      <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input 
                        required
                        type="url" 
                        value={newLecture.meeting_link}
                        onChange={(e) => setNewLecture({...newLecture, meeting_link: e.target.value})}
                        placeholder="https://zoom.us/j/..."
                        className="w-full pl-11 pr-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-4 border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-primary)] rounded-2xl hover:bg-[var(--color-surface-2)] transition-all">Cancel</button>
                    <button type="submit" className="flex-1 px-5 py-4 bg-[var(--color-primary)] text-white text-sm font-bold rounded-2xl hover:opacity-90 shadow-xl shadow-[var(--color-primary)]/20 transition-all flex items-center justify-center gap-2">
                       Establish Class <ArrowRight size={18}/>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}


