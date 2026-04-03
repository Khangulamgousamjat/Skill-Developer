import { useState, useEffect } from 'react';
import { 
  Megaphone, Plus, Calendar, Trash2, 
  Send, User, Clock, AlertCircle,
  Bell, CheckCircle2, Globe, Shield, Loader2
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function Announcements() {
  const { t } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: '', content: '', priority: 'normal', target_role: 'all' });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/announcements');
      if (res.data.success) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/admin/announcements', newAnn);
      if (res.data.success) {
        toast.success('Announcement broadcasted');
        setIsModalOpen(false);
        setNewAnn({ title: '', content: '', priority: 'normal', target_role: 'all' });
        fetchAnnouncements();
      }
    } catch (err) {
      toast.error('Failed to post announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement? It will disappear for all users.')) return;
    try {
      const res = await axiosInstance.delete(`/admin/announcements/${id}`);
      if (res.data.success) {
        toast.success('Announcement removed');
        fetchAnnouncements();
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const getPriorityStyles = (p) => {
    switch(p) {
      case 'high': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">System Announcements</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">Broadcast important updates to specific user roles</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-semibold text-sm shadow-lg shadow-[var(--color-primary)]/20"
          >
            <Plus size={18} />
            Post Announcement
          </button>
        </div>

        {/* Global Alert Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
           <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                 <Megaphone size={30} className="animate-bounce" />
              </div>
              <div>
                 <h2 className="text-xl font-bold font-sora">Broadcast Influence</h2>
                 <p className="text-white/80 text-sm mt-1">Updates reach matching roles instantly via dashboard alerts and notifications.</p>
              </div>
           </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)] opacity-50" />
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">fetching transmissions...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[32px] p-20 text-center">
               <Bell size={48} className="mx-auto mb-4 text-[var(--color-text-muted)] opacity-20" />
               <h3 className="font-bold text-[var(--color-text-primary)]">No active announcements</h3>
               <p className="text-sm text-[var(--color-text-muted)] mt-2 italic">Global communications will appear here once posted.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {announcements.map((ann) => (
                  <motion.div 
                    key={ann.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm group hover:shadow-xl transition-all relative text-left"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg border ${getPriorityStyles(ann.priority)}`}>
                            {ann.priority === 'high' ? <AlertCircle size={18}/> : <Megaphone size={18}/>}
                         </div>
                         <div className="px-3 py-1 bg-slate-500/10 border border-slate-500/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                            <Globe size={12}/> {ann.target_role === 'all' ? 'Everyone' : ann.target_role}
                         </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(ann.id)}
                        className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                         <Trash2 size={18}/>
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] font-sora mt-2">{ann.title}</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-3 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                    
                    <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] font-bold text-xs uppercase">
                             {ann.author_name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Broadcasted By</p>
                            <p className="text-xs font-bold text-[var(--color-text-primary)]">{ann.author_name || 'System Admin'}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-[10px] font-bold uppercase tracking-tight">
                          <Clock size={12}/> {format(new Date(ann.created_at), 'MMM dd, yyyy • HH:mm')}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Post Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                        <Send size={24} />
                      </div>
                      <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Post Announcement</h2>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-xl">
                      <Trash2 size={20}/>
                   </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Headline</label>
                    <input 
                      required
                      type="text" 
                      value={newAnn.title}
                      onChange={(e) => setNewAnn({...newAnn, title: e.target.value})}
                      placeholder="Maintenance Alert or Feature Launch..."
                      className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Target Audience</label>
                      <select 
                        required
                        value={newAnn.target_role}
                        onChange={(e) => setNewAnn({...newAnn, target_role: e.target.value})}
                        className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm outline-none cursor-pointer"
                      >
                         <option value="all">Everyone</option>
                         <option value="student">Only Students</option>
                         <option value="teacher">Only Teachers</option>
                         <option value="manager">Only Managers</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Priority Level</label>
                      <select 
                        required
                        value={newAnn.priority}
                        onChange={(e) => setNewAnn({...newAnn, priority: e.target.value})}
                        className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm outline-none cursor-pointer"
                      >
                         <option value="normal">Normal</option>
                         <option value="high">High (Red Alert)</option>
                         <option value="low">Low (Notice)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Announcement Body</label>
                    <textarea 
                      required
                      value={newAnn.content}
                      onChange={(e) => setNewAnn({...newAnn, content: e.target.value})}
                      placeholder="Enter detailed message here..."
                      className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm h-40 focus:border-[var(--color-primary)] outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-primary)] rounded-2xl hover:bg-[var(--color-surface-2)]">Discard</button>
                    <button type="submit" className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-white text-sm font-bold rounded-2xl hover:opacity-90 shadow-xl flex items-center justify-center gap-2">
                       <Megaphone size={18}/> Broadcast Now
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
