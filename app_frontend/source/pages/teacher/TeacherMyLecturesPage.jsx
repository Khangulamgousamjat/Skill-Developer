import React, { useState, useEffect } from 'react';
import { 
  Video, Calendar, Clock, Plus, 
  ExternalLink, Users, MessageSquare, 
  CheckCircle2, XCircle, Loader2, MoreVertical,
  Target, Zap, BookOpen, AlertCircle, Trash2
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

export const TeacherMyLecturesPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    scheduledTime: '',
    link: ''
  });

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Teacher/lectures');
      if (res.data.success) {
        setLectures(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load your sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.loading('Scheduling your session...', { id: 'schedule' });
      await api.post('/Teacher/lectures', form);
      toast.success('Lecture broadcast scheduled!', { id: 'schedule' });
      setIsModalOpen(false);
      setForm({ title: '', description: '', scheduledTime: '', link: '' });
      fetchLectures();
    } catch (err) {
      toast.error('Scheduling failed', { id: 'schedule' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'live': return 'text-red-500 bg-red-500/10 border-red-500/20 animate-pulse';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold font-sora flex items-center gap-3 ${t.textMain}`}>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-indigo-500" />
            </div>
            Teacher Broadcasts
          </h2>
          <p className={`text-sm ${t.textMuted} mt-1`}>Scale your knowledge globally. Schedule and manage your live technical sessions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Schedule Session
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className={`text-xs font-black uppercase tracking-widest ${t.textMuted}`}>Syncing session history...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {lectures.length === 0 ? (
            <div className={`col-span-full py-20 text-center rounded-[40px] border border-dashed border-white/10 ${t.card}`}>
               <Video className="w-12 h-12 mx-auto mb-4 text-slate-700" />
               <p className="font-bold opacity-30">No sessions scheduled yet.</p>
            </div>
          ) : lectures.map(lecture => (
            <div key={lecture.id} className={`p-8 rounded-[40px] border relative group glare-hover transition-all ${t.card} ${t.borderSoft}`}>
               <div className="flex justify-between items-start mb-6">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(lecture.status)}`}>
                    {lecture.status}
                  </div>
                  <button className="text-slate-500 hover:text-white p-2 rounded-xl transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
               </div>

               <h3 className={`text-xl font-bold font-sora mb-2 ${t.textMain}`}>{lecture.title}</h3>
               <p className={`text-xs leading-relaxed mb-8 line-clamp-2 ${t.textMuted}`}>{lecture.description || 'No specialized technical description provided for this session.'}</p>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-9 h-9 rounded-xl bg-[var(--color-surface)]/5 flex items-center justify-center border border-white/5">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                     </div>
                     <div>
                        <p className={`text-[10px] font-black uppercase tracking-tighter opacity-50 ${t.textMuted}`}>Date</p>
                        <p className={`text-xs font-bold ${t.textMain}`}>{new Date(lecture.time).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-9 h-9 rounded-xl bg-[var(--color-surface)]/5 flex items-center justify-center border border-white/5">
                        <Clock className="w-4 h-4 text-amber-400" />
                     </div>
                     <div>
                        <p className={`text-[10px] font-black uppercase tracking-tighter opacity-50 ${t.textMuted}`}>Time</p>
                        <p className={`text-xs font-bold ${t.textMain}`}>{new Date(lecture.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                  <div className="flex -space-x-2">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                         {i}
                       </div>
                     ))}
                     <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[8px] font-black text-white">
                        +24
                     </div>
                  </div>
                  <a 
                    href={lecture.link} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[var(--color-surface)]/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-indigo-600 transition-all group"
                  >
                    Enter Session <ExternalLink className="w-3 h-3 group-hover:scale-110" />
                  </a>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
           <div className={`${t.card} w-full max-w-lg rounded-[40px] border ${t.borderSoft} p-10 shadow-2xl relative overflow-hidden text-left`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-400 to-indigo-500" />
              
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h3 className={`text-2xl font-bold font-sora ${t.textMain}`}>Schedule Broadcast</h3>
                    <p className={`text-xs ${t.textMuted} mt-1`}>Define the parameters for your technical knowledge scale.</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Session Title</label>
                    <input 
                      type="text" required placeholder="e.g. Advanced Microservices Patterns" 
                      value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                      className={`w-full px-5 py-3 rounded-2xl bg-[var(--color-surface)]/5 border ${t.borderSoft} text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Topic Description</label>
                    <textarea 
                      rows="3" placeholder="What will interns learn in this session?" 
                      value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                      className={`w-full px-5 py-3 rounded-2xl bg-[var(--color-surface)]/5 border ${t.borderSoft} text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none`}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Schedule Date & Time</label>
                       <input 
                         type="datetime-local" required
                         value={form.scheduledTime} onChange={e => setForm({...form, scheduledTime: e.target.value})}
                         className={`w-full px-5 py-3 rounded-2xl bg-[var(--color-surface)]/5 border ${t.borderSoft} text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Broadcast Link</label>
                       <input 
                         type="url" required placeholder="Zoom/Meet URL" 
                         value={form.link} onChange={e => setForm({...form, link: e.target.value})}
                         className={`w-full px-5 py-3 rounded-2xl bg-[var(--color-surface)]/5 border ${t.borderSoft} text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                       />
                    </div>
                 </div>

                 <div className="pt-4">
                    <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-indigo-500 transition-all active:scale-[0.98]">
                       Commit to Calendar →
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMyLecturesPage;

