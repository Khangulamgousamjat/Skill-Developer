import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, MoreVertical, 
  UserCheck, UserX, Shield, Trash2, 
  Mail, Phone, Building2, Calendar,
  ChevronDown, ArrowUpDown, Loader2
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await axiosInstance.patch(`/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        toast.success('User status updated');
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' ? user.is_active : !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    const roles = {
      super_admin: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      manager: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      hr_admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      teacher: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      student: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    };
    return roles[role] || 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">User Management</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">Manage global user accounts and permissions</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchUsers}
              className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] transition-all shadow-sm"
            >
              <ArrowUpDown size={18} />
            </button>
            <button className="px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-semibold text-sm shadow-lg shadow-[var(--color-primary)]/20">
              Add New User
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
            />
          </div>
          <div className="flex gap-4">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm px-4 py-2 rounded-xl text-[var(--color-text-primary)] outline-none cursor-pointer"
            >
              <option value="all">Every Role</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="hr_admin">HR Admin</option>
              <option value="manager">Managers</option>
              <option value="super_admin">Super Admins</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm px-4 py-2 rounded-xl text-[var(--color-text-primary)] outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Suspended</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto text-left">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-2)] p-4 border-b border-[var(--color-border)]">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">User Details</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Role & Dept</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Joined Date</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)] mx-auto" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-4">Loading user directory...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center text-[var(--color-text-muted)] italic">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[var(--color-surface-2)] transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center shrink-0 overflow-hidden">
                             {user.profile_photo_url ? <img src={user.profile_photo_url} className="w-full h-full object-cover" /> : <UserCheck size={20} className="text-[var(--color-text-muted)]" />}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--color-text-primary)] text-sm">{user.full_name}</p>
                            <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5"><Mail size={12} /> {user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5">
                          <span className={`w-fit px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full border ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                          <span className="text-[10px] text-[var(--color-text-muted)] font-medium flex items-center gap-1">
                            <Building2 size={10} /> {user.department || 'Unassigned'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-left">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${user.is_active ? 'text-[var(--color-success)]' : 'text-rose-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-[var(--color-success)]' : 'bg-rose-500'}`} />
                          {user.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-[var(--color-text-muted)]">
                        {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                           <button 
                             onClick={() => handleToggleStatus(user.id)}
                             title={user.is_active ? 'Suspend User' : 'Activate User'}
                             className={`p-2 rounded-xl transition-all ${user.is_active ? 'text-rose-500 hover:bg-rose-500/10' : 'text-[var(--color-success)] hover:bg-[var(--color-success)]/10'}`}
                           >
                              {user.is_active ? <UserX size={18}/> : <UserCheck size={18}/>}
                           </button>
                           <button className="p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]">
                              <MoreVertical size={18}/>
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-[var(--color-surface-2)] border-t border-[var(--color-border)] flex items-center justify-between">
             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Showing {filteredUsers.length} of {users.length} Users</p>
             <div className="flex gap-2">
               <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] text-xs hover:bg-white transition-all disabled:opacity-30" disabled>Previous</button>
               <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] text-xs hover:bg-white transition-all disabled:opacity-30" disabled>Next</button>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
