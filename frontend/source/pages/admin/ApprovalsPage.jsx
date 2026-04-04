import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  ShieldCheck, ShieldX, Clock, User2, Briefcase,
  FileText, Building2, Loader2, RefreshCw, CheckCircle2, XCircle
} from 'lucide-react';

const ROLE_COLOR = {
  manager:   { text: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
  Teacher:    { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  hr_admin:  { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  super_admin:{ text:'text-red-400',    bg: 'bg-red-500/10',    border:'border-red-500/20' },
};

const RequestCard = ({ req, onApprove, onReject, t, isDarkMode }) => {
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const rColor = ROLE_COLOR[req.requested_role] || ROLE_COLOR['manager'];

  const handleApprove = async () => {
    setLoading(true);
    await onApprove(req.id);
    setLoading(false);
  };
  const handleReject = async () => {
    setLoading(true);
    await onReject(req.id, reason);
    setLoading(false);
    setRejectMode(false);
  };

  return (
    <div className={`rounded-2xl overflow-hidden glare-hover ${t.card}`}>
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,#1E3A5F,#F4A100)' }} />
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-black text-white`}
              style={{ background: 'linear-gradient(135deg,#1E3A5F,#2E5490)' }}>
              {req.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={`font-bold text-sm ${t.textMain}`}>{req.full_name}</p>
              <p className={`text-xs ${t.textMuted}`}>{req.email}</p>
            </div>
          </div>
          <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${rColor.text} ${rColor.bg} ${rColor.border}`}>
            {req.requested_role.replace('_', ' ')}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {req.employee_id && (
            <div className={`flex items-center gap-2 text-xs ${t.textMuted}`}>
              <Briefcase className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#F4A100' }} />
              Employee ID: <span className={`font-semibold ${t.textMain}`}>{req.employee_id}</span>
            </div>
          )}
          {req.department_name && (
            <div className={`flex items-center gap-2 text-xs ${t.textMuted}`}>
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#F4A100' }} />
              {req.department_name}
            </div>
          )}
          <div className={`flex items-center gap-2 text-xs ${t.textMuted}`}>
            <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#F4A100' }} />
            {new Date(req.requested_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>

        {/* Reason */}
        {req.reason && (
          <div className={`flex gap-2 text-xs p-3 rounded-xl mb-4 ${isDarkMode ? 'bg-[var(--color-surface)]/5 text-slate-300' : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]'}`}>
            <FileText className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed italic">"{req.reason}"</span>
          </div>
        )}

        {/* Reject reason input */}
        {rejectMode && (
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason (required)"
            rows={2}
            className={`w-full text-xs rounded-xl p-2.5 border resize-none outline-none mb-3 ${t.input}`}
          />
        )}

        {/* Actions */}
        {!rejectMode ? (
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Approve
            </button>
            <button
              onClick={() => setRejectMode(true)}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl border transition-colors ${
                isDarkMode ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-red-200 text-red-600 hover:bg-red-50'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" /> Reject
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={loading || !reason.trim()}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldX className="w-3.5 h-3.5" />}
              Confirm Rejection
            </button>
            <button onClick={() => { setRejectMode(false); setReason(''); }} className={`px-4 text-xs font-semibold rounded-xl border transition-colors ${isDarkMode ? 'border-white/10 text-slate-400 hover:bg-[var(--color-surface)]/5' : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'}`}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ApprovalsPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/role-requests');
      setRequests(res.data.data || []);
    } catch {
      toast.error('Failed to load role requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleApprove = async (id) => {
    try {
      const res = await api.patch(`/admin/role-requests/${id}/approve`);
      toast.success(res.data.message);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (id, reason) => {
    try {
      const res = await api.patch(`/admin/role-requests/${id}/reject`, { rejection_reason: reason });
      toast.success(res.data.message);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Role Approvals</h2>
          <p className={t.textMuted}>Review and action pending staff access requests.</p>
        </div>
        <div className="flex items-center gap-3">
          {requests.length > 0 && (
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-red-500">{requests.length} Pending</span>
            </div>
          )}
          <button
            onClick={fetchRequests}
            disabled={loading}
            className={`p-2.5 rounded-xl border transition-colors ${isDarkMode ? 'border-white/10 hover:bg-[var(--color-surface)]/5 text-slate-400' : 'border-[var(--color-border)] hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'}`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-64 rounded-2xl animate-pulse ${isDarkMode ? 'bg-[var(--color-surface)]/5' : 'bg-[var(--color-surface-2)]'}`} />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className={`p-16 rounded-2xl text-center ${t.card}`}>
          <ShieldCheck className={`w-14 h-14 mx-auto mb-4 ${isDarkMode ? 'text-emerald-500/40' : 'text-emerald-300'}`} />
          <h3 className={`text-lg font-bold ${t.textMain}`}>All Clear!</h3>
          <p className={`mt-1 text-sm ${t.textMuted}`}>No pending role requests to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {requests.map(req => (
            <RequestCard key={req.id} req={req} onApprove={handleApprove} onReject={handleReject} t={t} isDarkMode={isDarkMode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalsPage;

