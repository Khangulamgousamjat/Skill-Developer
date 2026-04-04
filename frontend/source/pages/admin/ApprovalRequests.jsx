import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Users, CheckCircle, XCircle, Clock, 
  Search, Filter, ExternalLink, Loader2, 
  UserCheck, UserX, AlertCircle 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApprovalRequests() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, requestId: null, reason: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/role-requests');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      const res = await axiosInstance.patch(`/admin/role-requests/${id}/approve`);
      if (res.data.success) {
        toast.success('Request approved successfully!');
        setRequests(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error approving request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    const { requestId, reason } = rejectionModal;
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setProcessingId(requestId);
    try {
      const res = await axiosInstance.patch(`/admin/role-requests/${requestId}/reject`, { rejection_reason: reason });
      if (res.data.success) {
        toast.success('Request rejected');
        setRequests(prev => prev.filter(r => r.id !== requestId));
        setRejectionModal({ isOpen: false, requestId: null, reason: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error rejecting request');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">Approval Queue</h1>
            <p className="text-[var(--color-text-muted)] mt-1">Review and manage access for staff roles</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
               <input 
                 type="text" 
                 placeholder="Search requests..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm w-full md:w-64 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
               />
             </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-medium">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
              <div className="w-16 h-16 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-[var(--color-success)]" />
              </div>
              <p className="font-sora font-semibold text-lg text-[var(--color-text-primary)]">All Caught Up!</p>
              <p className="mt-1">There are no pending role requests.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-surface-2)]/50 border-b border-[var(--color-border)]">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">User</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Role & Dept</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Verification</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  <AnimatePresence>
                    {filteredRequests.map((req) => (
                      <motion.tr 
                        key={req.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-[var(--color-surface-2)]/30 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                               {req.profile_photo_url ? (
                                 <img src={req.profile_photo_url} className="w-full h-full rounded-full object-cover" />
                               ) : (
                                 <span className="font-bold text-[var(--color-primary)]">{req.full_name.charAt(0)}</span>
                               )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[var(--color-text-primary)] truncate">{req.full_name}</p>
                              <p className="text-xs text-[var(--color-text-muted)] truncate">{req.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold uppercase">
                              {req.requested_role.replace('_', ' ')}
                            </span>
                            <p className="text-xs text-[var(--color-text-muted)]">{req.department_name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                           <div className="max-w-[200px]">
                             <p className="text-xs font-bold text-[var(--color-text-primary)]">ID: {req.employee_id}</p>
                             <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2 italic" title={req.reason}>
                               "{req.reason}"
                             </p>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button
                               disabled={!!processingId}
                               onClick={() => handleApprove(req.id)}
                               className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                               title="Approve"
                             >
                               {processingId === req.id ? <Loader2 className="animate-spin" size={18} /> : <UserCheck size={18} />}
                             </button>
                             <button
                               disabled={!!processingId}
                               onClick={() => setRejectionModal({ isOpen: true, requestId: req.id, reason: '' })}
                               className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                               title="Reject"
                             >
                               <UserX size={18} />
                             </button>
                           </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rejection Modal */}
        {rejectionModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Reject Access</h3>
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Please provide a brief reason for rejecting this access request. This will be sent to the user via email.
              </p>

              <textarea 
                rows={4}
                value={rejectionModal.reason}
                onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Ex: Invalid organization ID provided..."
                className="w-full rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] p-4 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none mb-6"
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setRejectionModal({ isOpen: false, requestId: null, reason: '' })}
                  className="flex-1 py-3 rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-text-primary)] font-bold text-sm hover:translate-y-[-2px] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReject}
                  className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:translate-y-[-2px] hover:shadow-lg hover:shadow-red-500/20 transition-all"
                >
                  Confirm Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
