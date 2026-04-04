import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, Phone, 
  MapPin, Calendar, CheckCircle2, XCircle, 
  Clock, Loader2, MoreVertical, ShieldAlert,
  ArrowRight, UserCheck, LayoutGrid, List,
  BookOpen, Building2, ExternalLink
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function InternsPage() {
  const { t } = useLanguage();
  const isDarkMode = useSelector((s) => s.ui.theme === 'dark');
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hr/interns');
      if (res.data.success) {
        setInterns(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to synchronize intern directory');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (interns.length === 0) return toast.error('No data to export');
    
    const headers = ['Full Name', 'Email', 'Employee ID', 'Department', 'Status', 'Checklist Completed'];
    const rows = interns.map(i => [
      i.full_name,
      i.email,
      i.employee_id || 'N/A',
      i.department_name || 'Unassigned',
      i.account_status,
      i.checklist_completed ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `intern_directory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Directory exported successfully');
  };

  const filteredInterns = interns.filter(intern => {
    const name = intern.full_name || '';
    const email = intern.email || '';
    const empId = intern.employee_id || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          empId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || intern.department_name === deptFilter;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...new Set(interns.map(i => i.department_name).filter(Boolean))];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              Intern Directory
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">Manage onboarding status, assignments, and account access</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-bold text-sm hover:translate-y-[-2px] transition-all shadow-sm hover:shadow-md"
            >
               <Download size={18} className="text-[var(--color-primary)]" />
               Export CSV
            </button>
            <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
               >
                 <LayoutGrid size={20} />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
               >
                 <List size={20} />
               </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input 
              type="text" 
              placeholder="Search by name, email or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm focus:ring-2 focus:ring-[var(--color-primary)]/50 outline-none transition-all text-[var(--color-text-primary)]"
            />
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-3">
            <Filter className="w-4 h-4 text-[var(--color-text-muted)]" />
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-transparent border-none text-sm outline-none font-bold text-[var(--color-text-primary)] cursor-pointer"
            >
              {departments.map(dept => <option key={dept} value={dept} className="bg-[var(--color-surface)]">{dept}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">Synchronizing intern records...</p>
          </div>
        ) : filteredInterns.length === 0 ? (
          <div className="py-24 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem]">
            <Users className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-muted)] opacity-20" />
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">No interns found</h3>
            <p className="text-[var(--color-text-muted)] mt-1">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredInterns.map((intern) => (
              <div key={intern.id} className="p-8 rounded-[2.5rem] border bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-300 group shadow-sm flex flex-col h-full hover:shadow-xl hover:shadow-[var(--color-primary)]/5">
                 <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 flex items-center justify-center border border-[var(--color-primary)]/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                       <span className="text-2xl font-black text-[var(--color-primary)] uppercase">{intern.full_name?.charAt(0)}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${intern.account_status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                      {intern.account_status}
                    </div>
                 </div>

                 <h3 className="text-xl font-bold font-sora mb-1 text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{intern.full_name}</h3>
                 <p className="text-xs font-medium mb-8 text-[var(--color-text-muted)]">{intern.email}</p>

                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                       <p className="text-[10px] font-black uppercase tracking-tighter text-[var(--color-text-muted)] mb-1 opacity-60">Department</p>
                       <p className="text-xs font-bold text-[var(--color-text-primary)] truncate">{intern.department_name || 'Unassigned'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                       <p className="text-[10px] font-black uppercase tracking-tighter text-[var(--color-text-muted)] mb-1 opacity-60">Emp ID</p>
                       <p className="text-xs font-bold text-[var(--color-text-primary)]">{intern.employee_id || 'N/A'}</p>
                    </div>
                 </div>

                 <div className="space-y-4 mb-8 flex-1">
                    <div>
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2">
                          <span className="text-[var(--color-text-muted)]">Onboarding Progress</span>
                          <span className={intern.checklist_completed ? 'text-emerald-500' : 'text-amber-500'}>
                             {intern.checklist_completed ? '100%' : '45%'}
                          </span>
                       </div>
                       <div className="h-2 w-full bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                          <div 
                             className={`h-full transition-all duration-1000 ${intern.checklist_completed ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                             style={{ width: intern.checklist_completed ? '100%' : '45%' }}
                          />
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                       <div className="flex items-center gap-2">
                          <BookOpen size={14} className="text-[var(--color-primary)]" />
                          <span className="text-[10px] font-bold text-[var(--color-text-primary)]">{intern.completed_projects || 0} Projects</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[var(--color-text-muted)]" />
                          <span className="text-[10px] font-bold text-[var(--color-text-primary)]">Active</span>
                       </div>
                    </div>
                 </div>

                 <button className="w-full py-4 rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-2xl font-bold text-xs uppercase tracking-widest hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 hover:bg-[var(--color-primary)] hover:text-white group-hover:shadow-lg group-hover:shadow-[var(--color-primary)]/20 shadow-sm border border-[var(--color-border)]">
                    View Full Profile <ArrowRight className="w-3.5 h-3.5" />
                 </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[2.5rem] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] bg-[var(--color-surface-2)]/50">
                <tr>
                  <th className="px-8 py-5">Intern Profile</th>
                  <th className="px-8 py-5">Department</th>
                  <th className="px-8 py-5">Onboarding</th>
                  <th className="px-8 py-5 text-center">Projects</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredInterns.map((intern) => (
                  <tr key={intern.id} className="hover:bg-[var(--color-surface-2)]/30 transition-colors group cursor-default">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center font-bold text-[var(--color-primary)] text-sm">
                            {intern.full_name?.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-[var(--color-text-primary)]">{intern.full_name}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)]">{intern.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-xs font-bold text-[var(--color-text-secondary)]">{intern.department_name || 'N/A'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                         {intern.checklist_completed ? (
                           <CheckCircle2 size={16} className="text-emerald-500" />
                         ) : (
                           <Clock size={16} className="text-amber-500" />
                         )}
                         <span className={`text-xs font-bold ${intern.checklist_completed ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {intern.checklist_completed ? 'Completed' : 'In Progress'}
                         </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="text-xs font-black text-[var(--color-text-primary)]">{intern.completed_projects || 0}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2.5 rounded-xl hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all">
                         <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


