import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Bell, Plus, Trash2, Edit, 
  Save, X, Loader2, Megaphone,
  Globe, Info, AlertTriangle, CheckCircle,
  Shield, Building2, User, SearchX
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../../components/shared/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

export default function ManageAnnouncements() {
  const { t } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    body: '', 
    type: 'info', 
    targetRole: 'all', 
    targetDepartmentId: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [annRes, deptRes] = await Promise.all([
        axiosInstance.get('/admin/announcements'),
        axiosInstance.get('/admin/departments')
      ]);
      
      if (annRes.data.success) setAnnouncements(annRes.data.data);
      if (deptRes.data.success) setDepartments(deptRes.data.data);
    } catch (err) {
      toast.error('Failed to synchronize global broadcasts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        targetRole: formData.targetRole === 'all' ? null : formData.targetRole,
        targetDepartmentId: formData.targetDepartmentId === '' ? null : formData.targetDepartmentId
      };

      if (editingAnn) {
        await axiosInstance.patch(`/admin/announcements/${editingAnn.id}`, payload);
        toast.success('Broadcast updated successfully');
      } else {
        await axiosInstance.post('/admin/announcements', payload);
        toast.success('Platform-wide announcement broadcasted');
      }
      setIsModalOpen(false);
      setEditingAnn(null);
      setFormData({ title: '', body: '', type: 'info', targetRole: 'all', targetDepartmentId: '' });
      fetchData();
    } catch (err) {
      toast.error('Protocol failure: Could not transmit broadcast');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Initiate wipe protocol for this announcement?')) return;
    try {
      await axiosInstance.delete(`/admin/announcements/${id}`);
      toast.success('Broadcast neutralized');
      fetchData();
    } catch (err) {
      toast.error('Neutralization failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner">
                <Megaphone size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">Global Broadcasts</h1>
                <p className="text-[var(--color-text-muted)] text-sm mt-0.5">Push critical updates and situational alerts to the entire fleet</p>
             </div>
          </div>
          <button 
            onClick={() => { 
                setEditingAnn(null); 
                setFormData({ title: '', body: '', type: 'info', targetRole: 'all', targetDepartmentId: '' }); 
                setIsModalOpen(true); 
            }}
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Transmit Signal
          </button>
        </div>

        {/* List of Announcements */}
        <div className="grid grid-cols-1 gap-6">
           {loading ? (
              <div className="space-y-6">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="p-10 border border-[var(--color-border)] rounded-[3rem] bg-[var(--color-surface)] space-y-6">
                       <div className="flex items-start gap-8">
                          <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                          <div className="flex-1 space-y-4">
                             <Skeleton className="h-8 w-1/2" />
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-3/4" />
                          </div>
                       </div>
                       <div className="flex gap-4 pt-4">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-3 w-40" />
                       </div>
                    </div>
                 ))}
              </div>
           ) : announcements.length === 0 ? (
              <div className="py-20 flex justify-center">
                 <EmptyState 
                    icon={Megaphone}
                    title="Zero Active Signals"
                    description="No site-wide announcements are currently in circulation. Use the broadcast control to initialize a new one."
                    actionLabel="Initialize First Broadcast"
                    onAction={() => setIsModalOpen(true)}
                 />
              </div>
           ) : (
              <AnimatePresence>
                 {announcements.map(ann => (
                    <motion.div 
                       key={ann.id}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       className={`p-10 border rounded-[3rem] shadow-sm flex flex-col md:flex-row gap-8 items-start relative transition-all group hover:shadow-2xl hover:shadow-indigo-500/5 ${
                          ann.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10' : 
                          ann.type === 'error' ? 'bg-red-500/5 border-red-500/10' : 
                          'bg-[var(--color-surface)] border-[var(--color-border)]'
                       }`}
                    >
                       <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border transition-transform group-hover:rotate-12 ${
                          ann.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' : 
                          ann.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-600' : 
                          'bg-indigo-500/10 border-indigo-500/20 text-indigo-600'
                       }`}>
                          {ann.type === 'warning' ? <AlertTriangle size={28} /> : 
                           ann.type === 'error' ? <Shield size={28} /> : 
                           <Bell size={28} />}
                       </div>
                       
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                             <h3 className="text-2xl font-bold font-sora text-[var(--color-text-primary)] leading-tight">{ann.title}</h3>
                             {ann.target_role && (
                               <span className="bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border border-indigo-500/20">
                                 Target: {ann.target_role?.replace('_', ' ')}
                               </span>
                             )}
                          </div>
                          <p className="text-md text-[var(--color-text-secondary)] leading-relaxed mb-8 font-medium">
                             {ann.body}
                          </p>
                          <div className="flex flex-wrap items-center gap-6 text-[10px] text-[var(--color-text-muted)] font-black tracking-[0.2em] uppercase">
                             <span className="flex items-center gap-2 px-3 py-1 bg-[var(--color-surface-2)] rounded-lg">
                                <Globe size={14} className="text-indigo-500" /> Site-wide
                             </span>
                             <span className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-emerald-500" /> Published {new Date(ann.created_at).toLocaleDateString()}
                             </span>
                             {ann.author_name && (
                               <span className="flex items-center gap-2">
                                  <User size={14} /> Issued by {ann.author_name}
                               </span>
                             )}
                          </div>
                       </div>

                       <div className="flex md:flex-col gap-3 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                             onClick={() => { 
                               setEditingAnn(ann); 
                               setFormData({ 
                                 title: ann.title, 
                                 body: ann.body, 
                                 type: ann.type, 
                                 targetRole: ann.target_role || 'all', 
                                 targetDepartmentId: ann.target_department_id || '' 
                               }); 
                               setIsModalOpen(true); 
                             }}
                             className="p-4 bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-indigo-500 rounded-2xl transition-all shadow-sm hover:scale-110"
                          >
                             <Edit size={20} />
                          </button>
                          <button 
                             onClick={() => handleDelete(ann.id)}
                             className="p-4 bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-red-500 rounded-2xl transition-all shadow-sm hover:scale-110"
                          >
                             <Trash2 size={20} />
                          </button>
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
           )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-[var(--color-surface)] border border-white/10 rounded-[3rem] p-12 w-full max-w-2xl shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-[var(--color-text-primary)]">
                     <Megaphone size={200} />
                  </div>

                  <div className="flex items-center justify-between mb-10 relative z-10">
                    <h2 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">{editingAnn ? 'Refine Broadcast' : 'Initialize Broadcast'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-[var(--color-surface-2)] rounded-2xl transition-colors text-[var(--color-text-muted)]">
                       <X size={28} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-2">Signal Heading</label>
                       <input 
                          type="text" 
                          required
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Critical System Upgrade: Sector 7"
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-5 rounded-2xl text-md outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-[var(--color-text-primary)]"
                       />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-2">Broadcast Severity</label>
                          <select 
                             value={formData.type}
                             onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                             className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 appearance-none cursor-pointer text-[var(--color-text-primary)]"
                          >
                             <option value="info">Info / Standard</option>
                             <option value="warning">Warn / Critical</option>
                             <option value="error">Fatal / Emergency</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-2">Audience Scope</label>
                          <select 
                             value={formData.targetRole}
                             onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
                             className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 appearance-none cursor-pointer text-[var(--color-text-primary)]"
                          >
                             <option value="all">Global (All Users)</option>
                             <option value="student">Interns Only</option>
                             <option value="manager">Managers Only</option>
                             <option value="Teacher">Teachers Only</option>
                          </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-2">Message Payload</label>
                       <textarea 
                          rows={4}
                          required
                          value={formData.body}
                          onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                          placeholder="Decrypt the intended message for the audience..."
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-6 rounded-2xl text-md outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none transition-all text-[var(--color-text-primary)]"
                       />
                    </div>

                    <div className="flex gap-4 pt-6">
                       <button 
                         type="button" 
                         onClick={() => setIsModalOpen(false)}
                         className="flex-1 py-5 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[var(--color-border)] transition-all"
                       >
                          Abort Signal
                       </button>
                       <button 
                         disabled={submitting}
                         type="submit" 
                         className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-indigo-600/30 transition-all disabled:opacity-50"
                       >
                          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Megaphone size={18} />}
                          {editingAnn ? 'Update Broadcast' : 'Execute Broadcast'}
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
