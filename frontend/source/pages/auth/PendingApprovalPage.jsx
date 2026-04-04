import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess as logout } from '../../store/slices/authSlice';

export default function PendingApprovalPage() {
  const { theme } = useSelector((state) => state.ui);
  const [status, setStatus] = useState('pending'); // pending, approved, rejected
  const [reason, setReason] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let interval;
    const checkStatus = async () => {
      try {
        const res = await axiosInstance.get('/auth/me'); // Or the equivalent user route
        const userStatus = res.data?.data?.user?.account_status || 'pending_approval';
        
        if (userStatus === 'active') {
          setStatus('approved');
          setTimeout(() => navigate('/login'), 2000); // Redirect to login for fresh tokens
        } else if (userStatus === 'rejected') {
          setStatus('rejected');
          setReason(res.data?.data?.user?.rejection_reason || 'Does not meet organization criteria.');
        }
      } catch (error) {
        // Handle gracefully, might use a specific role-requests/me endpoint instead
        // Wait, the prompt says GET /api/role-requests/my
        try {
           const rrRes = await axiosInstance.get('/role-requests/my');
           const reqStatus = rrRes.data?.data?.status;
           if (reqStatus === 'approved') {
              setStatus('approved');
              setTimeout(() => navigate('/login'), 2000);
           } else if (reqStatus === 'rejected') {
              setStatus('rejected');
           }
        } catch(e) {}
      }
    };

    checkStatus();
    interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = async () => {
    try { await axiosInstance.post('/auth/logout'); } catch {}
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className={`${theme} min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4 transition-colors duration-300`}>
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl p-8 text-center flex flex-col items-center">
        
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mb-6">
           <span className="text-[var(--color-accent)] font-bold text-2xl font-sora">SS</span>
        </div>

        <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-2">
          {status === 'pending' && 'Account Pending Approval'}
          {status === 'approved' && 'Account Approved!'}
          {status === 'rejected' && 'Request Rejected'}
        </h2>

        {status === 'pending' && (
          <>
            <div className="my-4 inline-flex items-center justify-center px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-500/20">
              PENDING
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-6 max-w-[280px]">
              Your access request has been submitted to the Super Admin. You will be able to login once approved.
            </p>
            <div className="w-10 h-10 border-4 rounded-full animate-spin border-[var(--color-border)] border-t-amber-500 mb-6" />
          </>
        )}

        {status === 'approved' && (
          <>
            <div className="my-4 inline-flex items-center justify-center px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider rounded-full border border-green-500/20">
              APPROVED
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-6 max-w-[280px]">
              Redirecting you to the login page...
            </p>
          </>
        )}

        {status === 'rejected' && (
          <>
            <div className="my-4 inline-flex items-center justify-center px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider rounded-full border border-red-500/20">
              REJECTED
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 rounded-xl mb-6 text-left w-full">
              <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase mb-1">Reason</p>
              <p className="text-sm text-[var(--color-text-primary)]">{reason || 'No reason provided.'}</p>
            </div>
          </>
        )}

        <button 
          onClick={handleLogout}
          className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-border)] transition-colors mt-2"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

