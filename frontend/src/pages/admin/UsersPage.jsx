import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, Search, Filter, ShieldCheck, 
  UserPlus, UserX, UserCheck, Loader2, 
  MoreVertical, RefreshCw, ChevronLeft, 
  ChevronRight, Mail, Hash, Calendar,
  Shield, Activity, Ban, Clock, AlertCircle,
  Trash2, ShieldAlert, X
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../../components/shared/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const ROLES = ['all', 'student', 'Teacher', 'manager', 'hr_admin', 'super_admin'];
const STATUSES = ['all', 'active', 'pending_email', 'pending_approval', 'rejected', 'deactivated'];

const STATUS_CONFIG = {
  active:           { color: 'emerald', label: 'Active Service', icon: UserCheck },
  pending_email:    { color: 'blue',    label: 'Email Pending', icon: Mail },
  pending_approval: { color: 'amber',   label: 'Awaiting Auth', icon: Clock },
  rejected:         { color: 'red',     label: 'Auth Rejected', icon: UserX },
  deactivated:      { color: 'slate',   label: 'Deactivated',  icon: Ban },
};

const ROLE_CONFIG = {
  student:     { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  Teacher:      { color: 'text-blue-500',    bg: 'bg-blue-500/10' },
  manager:     { color: 'text-amber-500',   bg: 'bg-amber-500/10' },
  hr_admin:    { color: 'text-purple-500',  bg: 'bg-purple-500/10' },
  super_admin: { color: 'text-red-500',     bg: 'bg-red-500/10' },
};

export default function UsersPage() {
  const { t } = useLanguage();
  const isDarkMode = useSelector((s) => s.ui.theme === 'dark');
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [togglingId, setTogglingId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: 'single', userId: null, userName: '', confirmText: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const limit = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit });
      if (search) params.set('search', search);
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      
      const res = await api.get(`/admin/users?${params}`);
      if (res.data.success) {
        setUsers(res.data.data);
        setTotal(res.data.total);
      }
    } catch (err) {
      toast.error('Failed to synchronize user directory');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleToggle = async (userId) => {
    try {
      setTogglingId(userId);
      const res = await api.patch(`/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        toast.success(`User successfully ${res.data.newStatus}`);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, account_status: res.data.newStatus } : u));
      }
    } catch (err) {
      toast.error('Failed to update account status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleUserDelete = async () => {
    if (deleteModal.confirmText.toLowerCase() !== 'confirm') {
      toast.error('Please type "confirm" to proceed');
      return;
    }

    try {
      setIsDeleting(true);
      if (deleteModal.type === 'single') {
        const res = await api.delete(`/admin/users/${deleteModal.userId}`);
        if (res.data.success) {
          toast.success('User permanently removed');
          setUsers(prev => prev.filter(u => u.id !== deleteModal.userId));
        }
      } else {
        const res = await api.delete('/admin/users/bulk/all');
        if (res.data.success) {
          toast.success('All users removed except your account');
          fetchUsers();
        }
      }
      setDeleteModal({ isOpen: false, type: 'single', userId: null, userName: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deletion failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-500" />
              </div>
              User Directory
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">Manage global access, roles, and security compliance</p>
          </div>
          
          <div className="flex items-center gap-3">
              <button 
                onClick={() => setDeleteModal({ isOpen: true, type: 'bulk', userId: null, userName: 'EVERYONE', confirmText: '' })}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-500/5 group"
              >
                 <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                 Purge All Users
              </button>
              <div className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-5 py-3 shadow-sm">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-xs font-black uppercase tracking-widest text-[var(--color-text-primary)]">
                    {total} Active Identities
                 </span>
              </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
           <div className="lg:col-span-2 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" />
              <input 
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by identity or credentials..."
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all text-[var(--color-text-primary)]"
              />
           </div>
           
           <div className="relative">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm outline-none appearance-none text-[var(--color-text-primary)] focus:border-[var(--color-primary)] transition-all"
              >
                 <option value="all">Global Multi-Role</option>
                 {ROLES.filter(r => r !== 'all').map(r => (
                   <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>
                 ))}
              </select>
           </div>

           <div className="relative">
              <Activity className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm outline-none appearance-none text-[var(--color-text-primary)] focus:border-[var(--color-primary)] transition-all"
              >
                 <option value="all">All Operational States</option>
                 {STATUSES.filter(s => s !== 'all').map(s => (
                   <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                 ))}
              </select>
           </div>
        </div>

        {/* User Landscape */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] overflow-hidden shadow-sm min-h-[400px] flex flex-col">
           {loading ? (
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <tbody className="divide-y divide-[var(--color-border)]">
                      {[...Array(6)].map((_, i) => (
                         <tr key={i} className="animate-pulse">
                            <td className="px-8 py-6"><div className="flex items-center gap-4"><Skeleton className="w-12 h-12 rounded-[1.2rem]" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></div></div></td>
                            <td className="px-8 py-6"><Skeleton className="h-4 w-20 rounded-lg" /></td>
                            <td className="px-8 py-6"><Skeleton className="h-4 w-24 rounded-full" /></td>
                            <td className="px-8 py-6"><Skeleton className="h-4 w-28" /></td>
                            <td className="px-8 py-6 text-right"><Skeleton className="h-10 w-10 rounded-2xl ml-auto" /></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           ) : users.length === 0 ? (
             <div className="flex-1 flex items-center justify-center py-20">
                <EmptyState 
                   icon={AlertCircle}
                   title="Null Identity Matrix"
                   description="No individuals currently match your filter parameters or search criteria. Reconfigure the matrix to see results."
                   actionLabel="Reset System Filters"
                   onAction={() => {
                      setSearchInput('');
                      setRoleFilter('all');
                      setStatusFilter('all');
                   }}
                />
             </div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-[var(--color-surface-2)]/50 border-b border-[var(--color-border)]">
                         <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Platform Identity</th>
                         <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Structural Role</th>
                         <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Status</th>
                         <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Joined At</th>
                         <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-right">Control</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[var(--color-border)]">
                      {users.map(user => {
                        const status = STATUS_CONFIG[user.account_status] || STATUS_CONFIG.deactivated;
                        return (
                          <motion.tr 
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-[var(--color-surface-2)]/30 transition-colors group"
                          >
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                      {user.full_name?.charAt(0).toUpperCase()}
                                   </div>
                                   <div className="min-w-0">
                                      <p className="font-bold text-[var(--color-text-primary)] truncate">{user.full_name}</p>
                                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mt-1">
                                         <Mail size={12} />
                                         <span className="truncate">{user.email}</span>
                                      </div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border shrink-0 ${ROLE_CONFIG[user.role]?.color} ${ROLE_CONFIG[user.role]?.bg} border-current/20`}>
                                   {user.role?.replace('_', ' ')}
                                </span>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                   <div className={`w-2 h-2 rounded-full bg-${status.color}-500 shadow-xl shadow-${status.color}-500/20`} />
                                   <span className="text-[10px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">{status.label}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-2 text-[var(--color-text-muted)] font-medium text-xs">
                                   <Calendar size={14} />
                                   {new Date(user.created_at).toLocaleDateString()}
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center justify-end gap-3">
                                   <button 
                                      onClick={() => handleToggle(user.id)}
                                      disabled={togglingId === user.id}
                                      className={`p-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] transition-all ${user.account_status === 'active' ? 'text-red-500 hover:bg-red-500 hover:text-white' : 'text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                                   >
                                      {togglingId === user.id ? <Loader2 size={18} className="animate-spin" /> : 
                                       user.account_status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                                   </button>
                                    
                                    <div className="relative">
                                       <button 
                                          onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                                          className={`p-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all ${activeDropdown === user.id ? 'bg-[var(--color-surface)] ring-2 ring-[var(--color-primary)]/20' : ''}`}
                                       >
                                          <MoreVertical size={18} />
                                       </button>

                                       {activeDropdown === user.id && (
                                          <>
                                             <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                                             <motion.div 
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                className="absolute right-0 mt-2 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl z-20 py-2 overflow-hidden"
                                             >
                                                <button 
                                                   onClick={() => {
                                                      setDeleteModal({ isOpen: true, type: 'single', userId: user.id, userName: user.full_name });
                                                      setActiveDropdown(null);
                                                   }}
                                                   className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                                                >
                                                   <Trash2 size={16} />
                                                   Delete Account
                                                </button>
                                             </motion.div>
                                          </>
                                       )}
                                    </div>
                                </div>
                             </td>
                          </motion.tr>
                        );
                      })}
                   </tbody>
                </table>
             </div>
           )}

           {/* Pagination */}
           {totalPages > 1 && (
             <div className="mt-auto px-8 py-6 border-t border-[var(--color-border)] flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                   Structural Batch {page} of {totalPages}
                </p>
                <div className="flex items-center gap-3">
                   <button 
                     onClick={() => setPage(p => Math.max(1, p - 1))}
                     disabled={page === 1}
                     className="p-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)] disabled:opacity-20 hover:text-[var(--color-primary)] transition-all"
                   >
                      <ChevronLeft size={20} />
                   </button>
                   <button 
                     onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                     disabled={page === totalPages}
                     className="p-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)] disabled:opacity-20 hover:text-[var(--color-primary)] transition-all"
                   >
                      <ChevronRight size={20} />
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Heavy Delete Confirmation Modal */}
      <AnimatePresence>
         {deleteModal.isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
               >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
                  
                  <div className="flex items-center justify-between mb-8">
                     <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                        <ShieldAlert size={32} />
                     </div>
                     <button 
                        onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                        className="p-2 hover:bg-[var(--color-surface-2)] rounded-xl transition-colors"
                     >
                        <X size={20} className="text-[var(--color-text-muted)]" />
                     </button>
                  </div>

                  <h3 className="text-2xl font-bold font-sora text-[var(--color-text-primary)] mb-2">
                     {deleteModal.type === 'bulk' ? 'Purge Entire System?' : 'Delete Account?'}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-8">
                     You are about to permanently remove <span className="font-black text-red-500 underline">{deleteModal.userName}</span> from the structural matrix. 
                     This action is <span className="font-bold">irreversible</span> and will erase all associated data.
                  </p>

                  <div className="flex gap-4">
                     <button 
                        onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                        className="flex-1 py-4 rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-text-primary)] font-bold text-sm hover:translate-y-[-2px] transition-all"
                     >
                        Abort Mission
                     </button>
                     <button 
                        onClick={handleUserDelete}
                        disabled={isDeleting}
                        className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold text-sm hover:translate-y-[-2px] hover:shadow-xl hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                     >
                        {isDeleting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Confirm Deletion'}
                     </button>
                  </div>
                  
                  <p className="mt-6 text-[9px] text-center font-black uppercase tracking-[0.2em] text-red-500/40">
                     Warning: Level 5 Security Protocol Required
                  </p>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
