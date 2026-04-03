import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { AlertCircle, Plus, User, Clock, CheckCircle2, Loader2, Send, MessageSquare, Briefcase, Filter } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function HelpBoard() {
  const { t } = useLanguage();
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  
  const [requests, setRequests] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({ project_id: '', issue_description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchMyProjects();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/help-board');
      setRequests(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load help board');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProjects = async () => {
     try {
       const res = await axiosInstance.get('/student/projects');
       setProjects(res.data.data || []);
     } catch (err) {}
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post('/help-board', newRequest);
      toast.success('Help request posted!');
      setShowModal(false);
      setNewRequest({ project_id: '', issue_description: '' });
      fetchRequests();
    } catch (err) {
      toast.error('Failed to post request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id, currentStatus) => {
    const next = currentStatus === 'open' ? 'resolved' : 'open';
    try {
      await axiosInstance.patch(`/help-board/${id}/status`, { status: next });
      toast.success(`Request marked as ${next}`);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleHelpOut = (requesterId) => {
     navigate(`/student/messages`);
     // In a real app, we'd trigger a conversation start here
     toast.success('Opening messages to help your peer!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 p-8 rounded-3xl relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] flex items-center gap-3">
                  <AlertCircle size={32} className="text-red-500" />
                  {t('helpBoard')}
                </h1>
                <p className="text-[var(--color-text-muted)] mt-2 italic max-w-lg">
                  Stuck on a project task? Post it here or help your peers climb the ladder of success.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="px-8 py-3 bg-red-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
              >
                <Plus size={20} /> I Need Help
              </button>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50" />
        </div>

        {/* Filter Bar */}
        <div className="flex justify-between items-center bg-[var(--color-surface)] border border-[var(--color-border)] px-6 py-4 rounded-2xl shadow-sm">
           <div className="flex gap-4">
              <span className="text-xs font-bold text-[var(--color-primary)] px-3 py-1 bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]/20">All Requests</span>
              <span className="text-xs font-bold text-[var(--color-text-muted)] px-3 py-1 bg-[var(--color-surface-2)] rounded-full border border-[var(--color-border)] cursor-pointer hover:bg-black/5 transition-all">My Requests</span>
           </div>
           <button className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm font-bold">
              <Filter size={16} /> Filter by Project
           </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {loading ? (
             <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>
           ) : requests.length === 0 ? (
             <div className="col-span-full text-center py-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl">
                <p className="text-[var(--color-text-muted)] italic">No active help requests. Everyone is cruising!</p>
             </div>
           ) : (
             requests.map(req => (
               <motion.div 
                 key={req.id}
                 layoutId={req.id}
                 className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm flex flex-col group hover:shadow-xl hover:border-red-500/30 transition-all ${req.status === 'resolved' ? 'opacity-60 grayscale-[0.5]' : ''}`}
               >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--color-border)] flex items-center justify-center shrink-0">
                       {req.profile_photo_url ? <img src={req.profile_photo_url} className="w-full h-full object-cover" /> : <User size={18} className="text-[var(--color-text-muted)]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-bold text-sm text-[var(--color-text-primary)] truncate">{req.full_name}</p>
                       <p className="text-[10px] text-[var(--color-text-muted)] uppercase italic font-bold truncate leading-tight">{req.department_name}</p>
                    </div>
                    {req.status === 'resolved' && <CheckCircle2 size={24} className="text-[var(--color-success)]" />}
                  </div>

                  <div className="mb-4 bg-[var(--color-surface-2)] p-4 rounded-2xl border border-[var(--color-border)] border-dashed relative">
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed italic line-clamp-4">"{req.issue_description}"</p>
                    {req.project_title && (
                       <div className="mt-3 flex items-center gap-1.5 text-[var(--color-primary)] text-[10px] uppercase font-bold tracking-widest border-t border-[var(--color-border)] pt-2 border-dashed">
                          <Briefcase size={10} /> {req.project_title}
                       </div>
                    )}
                  </div>

                  <div className="mt-auto flex gap-3 pt-4 border-t border-[var(--color-border)]">
                     {req.requester_id === user.id ? (
                        <button 
                          onClick={() => handleResolve(req.id, req.status)}
                          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${req.status === 'open' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-white' : 'bg-red-500 text-white'}`}
                        >
                           {req.status === 'open' ? 'Mark Resolved' : 'Mark Open'}
                        </button>
                     ) : (
                        <button 
                          disabled={req.status === 'resolved'}
                          onClick={() => handleHelpOut(req.requester_id)}
                          className={`flex-1 py-2 px-4 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all ${req.status === 'resolved' ? 'opacity-20 cursor-not-allowed' : ''}`}
                        >
                           <MessageSquare size={14} /> Help Out
                        </button>
                     )}
                     <span className="text-[8px] text-[var(--color-text-muted)] uppercase font-bold shrink-0 mt-3">{format(new Date(req.created_at), 'MMM d, HH:mm')}</span>
                  </div>
               </motion.div>
             ))
           )}
        </div>
      </div>

      {/* New Request Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowModal(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="relative bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-lg rounded-3xl p-8 shadow-2xl"
             >
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center">
                     <AlertCircle size={24} className="text-red-500" />
                   </div>
                   <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">New Help Request</h2>
                </div>
                <form onSubmit={handleCreateRequest} className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Relating Project (Optional)</label>
                      <select 
                        value={newRequest.project_id}
                        onChange={(e) => setNewRequest({...newRequest, project_id: e.target.value})}
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-4 rounded-xl text-sm focus:border-[var(--color-primary)] outline-none"
                      >
                         <option value="">No specific project</option>
                         {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Describe the issue</label>
                      <textarea 
                        required
                        value={newRequest.issue_description}
                        onChange={(e) => setNewRequest({...newRequest, issue_description: e.target.value})}
                        placeholder="Explain what's blocking you..."
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-4 rounded-xl text-sm h-32 resize-none focus:border-[var(--color-primary)] outline-none"
                      />
                   </div>
                   <div className="flex gap-4 pt-2">
                      <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-[var(--color-border)] rounded-xl font-bold text-[var(--color-text-muted)]">Cancel</button>
                      <button 
                        type="submit" 
                        disabled={submitting}
                        className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                        {submitting && <Loader2 className="animate-spin" size={18}/>} Post Request
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

