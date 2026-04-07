import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Calendar, Clock, Plus, Trash2, 
  CheckCircle2, AlertCircle, ChevronRight,
  BookOpen, Video, Target, Loader2, Sparkles, X,
  CalendarCheck
} from 'lucide-react';
import { supabase } from '../../api/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function StudyPlanner() {
  const { t } = useLanguage();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ title: '', category: 'Study', date: '', time: '' });

  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // 1. Fetch Lectures
      const { data: lectures } = await supabase
        .from('lectures')
        .select('*')
        .order('date', { ascending: true });

      // 2. Fetch Projects (Assignments)
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .order('deadline', { ascending: true });

      // 3. Fetch Personal Study Sessions
      const { data: sessions } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('student_id', user.id)
        .order('date', { ascending: true });

      // Consolidate everything into a timeline
      const allEvents = [
        ...(lectures || []).map(l => ({ ...l, type: 'lecture', icon: Video, color: 'indigo' })),
        ...(projects || []).map(p => ({ ...p, type: 'assignment', icon: Target, date: p.deadline, color: 'rose' })),
        ...(sessions || []).map(s => ({ ...s, type: 'study', icon: BookOpen, color: 'emerald' }))
      ].sort((a, b) => new Date(a.date || a.deadline) - new Date(b.date || b.deadline));

      setEvents(allEvents);
    } catch (err) {
      toast.error('Tactical sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('study_sessions')
        .insert([{
          student_id: user.id,
          title: formData.title,
          category: formData.category,
          date: formData.date,
          time: formData.time,
          status: 'planned'
        }]);

      if (error) throw error;
      toast.success('Study session locked in');
      setIsAdding(false);
      setFormData({ title: '', category: 'Study', date: '', time: '' });
      fetchEvents();
    } catch (err) {
      toast.error('Failed to initialize session');
    }
  };

  const handleDelete = async (id, type) => {
    if (type !== 'study') return toast.error('System events cannot be deleted here');
    if (!window.confirm('Exterminate this session?')) return;

    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Session purged');
      fetchEvents();
    } catch (err) {
      toast.error('Purge failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] tracking-tight">Mission Control: Study Planner</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1.5 font-medium">Coordinate your tactical learning window and curriculum sync</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-[var(--color-primary)] text-white rounded-2xl hover:brightness-110 active:scale-95 transition-all font-bold text-sm shadow-xl shadow-[var(--color-primary)]/20"
          >
            <Plus size={20} />
            Initialize Mission Block
          </button>
        </div>

        {/* Timeline View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Timeline (Left) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center border border-[var(--color-primary)]/10">
                  <CalendarCheck size={22} />
               </div>
               <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Upcoming Mission Sequence</h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-28 bg-[var(--color-surface-2)]/50 animate-pulse rounded-[32px] border border-[var(--color-border)]" />)}
              </div>
            ) : events.length === 0 ? (
              <div className="p-24 text-center bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[48px] shadow-inner">
                <Sparkles size={48} className="mx-auto mb-6 text-[var(--color-border)] opacity-20" />
                <p className="text-[var(--color-text-muted)] italic font-medium">Your tactical calendar is currently clear. Sync with curriculum to start.</p>
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[var(--color-primary)]/20 before:to-transparent">
                {events.map((event, idx) => (
                  <motion.div 
                    key={event.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-6 group relative"
                  >
                    <div className={`w-16 h-16 rounded-[22px] bg-[var(--color-surface)] border-2 border-[var(--color-border)] group-hover:border-[var(--color-primary)]/40 flex flex-col items-center justify-center shrink-0 z-10 shadow-lg transition-all transform group-hover:scale-105 active:scale-95`}>
                       <span className="text-[9px] font-black uppercase text-[var(--color-text-muted)] leading-none mb-1 opacity-60">
                         {new Date(event.date || event.deadline).toLocaleString('default', { month: 'short' })}
                       </span>
                       <span className="text-xl font-bold text-[var(--color-text-primary)] leading-none">
                         {new Date(event.date || event.deadline).getDate()}
                       </span>
                    </div>

                    <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-[32px] shadow-sm hover:shadow-2xl hover:border-[var(--color-primary)]/30 transition-all flex items-center justify-between group/card overflow-hidden relative">
                      <div className={`absolute top-0 right-0 w-1.5 h-full bg-${event.color}-500/40`} />
                      
                      <div className="flex items-center gap-6 text-left">
                        <div className={`w-12 h-12 rounded-2xl bg-${event.color}-500/5 text-${event.color}-500 flex items-center justify-center border border-${event.color}-500/10 shadow-inner group-hover/card:scale-110 transition-transform`}>
                           <event.icon size={22} />
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                             <h4 className="font-bold text-[var(--color-text-primary)] text-lg leading-tight group-hover/card:text-[var(--color-primary)] transition-colors">{event.title}</h4>
                             <span className={`px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-${event.color}-500/5 text-${event.color}-500 border border-${event.color}-500/10`}>
                               {event.type}
                             </span>
                           </div>
                           <div className="flex items-center gap-4 text-[10px] text-[var(--color-text-muted)] font-black uppercase tracking-widest opacity-60">
                             <p className="flex items-center gap-1.5"><Clock size={12} className="text-indigo-400"/> {event.time || 'All Day'}</p>
                             <div className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                             <p className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500"/> {event.status || 'Active'}</p>
                           </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover/card:opacity-100 transition-all translate-x-4 group-hover/card:translate-x-0">
                         {event.type === 'study' && (
                           <button onClick={() => handleDelete(event.id, 'study')} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                         )}
                         <button className="p-3 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm">
                            <ChevronRight size={18} />
                         </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Productivity Stats (Right) */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl group border border-white/5 text-left">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                   <Target size={120} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                   <div>
                      <h3 className="text-2xl font-bold font-sora mb-4 tracking-tight">Mission Efficiency</h3>
                      <div className="space-y-6 mt-8">
                         <div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 px-1">
                               <span>Curriculum Sync</span>
                               <span>82%</span>
                            </div>
                            <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden border border-white/5 shadow-inner p-0.5">
                               <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 1.5 }} className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                            </div>
                         </div>
                         <div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 px-1">
                               <span>Self-Discipline</span>
                               <span>65%</span>
                            </div>
                            <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden border border-white/10 shadow-inner p-0.5">
                               <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1.5 }} className="h-full bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.3)]" />
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">AI Tactical Tip</p>
                      <p className="text-xs font-medium text-white/70 italic leading-relaxed">"Deep work sessions scheduled before 10 AM yield 40% higher skill synthesis."</p>
                   </div>
                </div>
             </div>

             <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-10 shadow-sm text-left group hover:border-[var(--color-primary)]/20 transition-all transition-colors">
                <h3 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-8">Asset Breakdown</h3>
                <div className="space-y-6">
                   <StatRow label="Lectures" value={events.filter(e => e.type === 'lecture').length} color="indigo" />
                   <StatRow label="Assignments" value={events.filter(e => e.type === 'assignment').length} color="rose" />
                   <StatRow label="Personal Blocks" value={events.filter(e => e.type === 'study').length} color="emerald" />
                </div>
             </div>
          </div>
        </div>

        {/* ADD SESSION MODAL */}
        <AnimatePresence>
          {isAdding && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-10 shadow-3xl text-left"
              >
                <div className="flex items-center justify-between mb-10">
                   <div>
                     <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Initialize Mission Block</h2>
                     <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1 px-1">Tactical Personal Scheduler</p>
                   </div>
                   <button onClick={() => setIsAdding(false)} className="p-3 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-2xl transition-all">
                      <X size={24} />
                   </button>
                </div>

                <form onSubmit={handleAddSession} className="space-y-8">
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3 px-1">Objective Title</label>
                      <input 
                        required
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Deep Research: Web3 Security"
                        className="w-full px-6 py-4.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm font-medium focus:border-[var(--color-primary)] outline-none transition-all shadow-inner"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3 px-1">Classification</label>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-6 py-4.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm font-bold outline-none shadow-inner appearance-none cursor-pointer"
                        >
                           <option value="Study">Self Study</option>
                           <option value="Research">Research</option>
                           <option value="Coding">Coding Lab</option>
                           <option value="Review">Unit Review</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3 px-1">Tactical Time</label>
                        <input 
                          required
                          type="time" 
                          value={formData.time}
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                          className="w-full px-6 py-4.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm font-bold outline-none shadow-inner"
                        />
                      </div>
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3 px-1">Execution Date</label>
                      <input 
                        required
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-6 py-4.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm font-bold outline-none shadow-inner"
                      />
                   </div>
                   
                   <div className="flex gap-4 pt-8">
                      <button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-5 py-4 border border-[var(--color-border)] text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] rounded-2xl hover:bg-[var(--color-surface-2)] transition-all">Discard</button>
                      <button type="submit" className="flex-1 px-5 py-4 bg-[var(--color-primary)] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 active:scale-95 shadow-2xl transition-all shadow-[var(--color-primary)]/20">Authorize Sync</button>
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

function StatRow({ label, value, color }) {
   return (
      <div className="flex items-center justify-between group/row">
         <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full bg-${color}-500 shadow-[0_0_10px_rgba(0,0,0,0.1)] group-hover/row:scale-150 transition-transform`} />
            <span className="text-xs font-bold text-[var(--color-text-muted)] group-hover/row:text-[var(--color-text-primary)] transition-colors">{label}</span>
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-primary)] bg-[var(--color-surface-2)] px-3 py-1 rounded-lg border border-[var(--color-border)]">{value}</span>
      </div>
   );
}
