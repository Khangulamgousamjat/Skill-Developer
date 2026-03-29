import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutSuccess } from '../../store/slices/authSlice';
import { Clock, XCircle, LogOut } from 'lucide-react';

const PendingApprovalPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Assume we pass rejection details through router state if they try to login and are rejected
  // Or fetch it if we stored it
  const status = 'pending'; // 'pending' or 'rejected'
  const rejectionReason = ''; 
  const roleRequested = 'Manager';
  const department = 'Engineering';
  const submittedDate = new Date().toLocaleDateString();

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      
      <div className="text-center mb-6 relative z-10">
        <h1 className="font-sora font-bold text-xl text-white">
          Smart Skill & Live Learning Module
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Gous org
        </p>
      </div>

      <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative z-10 text-center">
        
        <div className="flex justify-center mb-6">
          {status === 'pending' ? (
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
               <Clock className="w-8 h-8 text-amber-500" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
               <XCircle className="w-8 h-8 text-red-500" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-3 font-sora">
          {status === 'pending' ? 'Account Pending Approval' : 'Access Request Denied'}
        </h2>
        
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          {status === 'pending' 
             ? 'Your request has been submitted. The Super Admin will review your request and you will receive an email with the decision.'
             : 'Unfortunately, your request to access the Smart Skill & Live Learning Module has not been approved.'}
        </p>

        {status === 'pending' ? (
           <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-6">
             PENDING
           </div>
        ) : (
           <div className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider mb-6">
             REJECTED
           </div>
        )}

        {status === 'rejected' && rejectionReason && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-red-400 mb-1">Reason for Rejection:</p>
            <p className="text-sm text-red-100">{rejectionReason}</p>
          </div>
        )}

        <div className="bg-white/5 border border-white/5 rounded-xl p-5 mb-8 text-left">
           <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-white/5 pb-2">Request Summary</h3>
           <div className="space-y-3">
             <div className="flex justify-between">
               <span className="text-sm text-slate-400">Role Requested</span>
               <span className="text-sm font-medium text-white">{roleRequested}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-sm text-slate-400">Department</span>
               <span className="text-sm font-medium text-white">{department}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-sm text-slate-400">Submitted On</span>
               <span className="text-sm font-medium text-white">{submittedDate}</span>
             </div>
           </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout & Return to Login
        </button>

      </div>
    </div>
  );
};

export default PendingApprovalPage;
