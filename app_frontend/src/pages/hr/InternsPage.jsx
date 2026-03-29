import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, Phone, 
  MapPin, Calendar, CheckCircle2, XCircle, 
  Clock, Loader2, MoreVertical, ShieldAlert,
  ArrowRight, UserCheck, LayoutGrid, List,
  BookOpen, Building2, ExternalLink
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

export const InternsPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
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

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          intern.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (intern.employee_id && intern.employee_id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = deptFilter === 'All' || intern.department_name === deptFilter;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...new Set(interns.map(i => i.department_name).filter(Boolean))];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold font-sora flex items-center gap-3 ${t.textMain}`}>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            Intern Directory
          </h2>
          <p className={`text-sm ${t.textMuted} mt-1`}>Manage onboarding status, assignments, and account access for all student interns.</p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/5">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-[32px] ${t.card} border ${t.borderSoft} flex flex-col md:flex-row gap-4`}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name, email or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border ${t.borderSoft} text-sm focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600`}
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className={`bg-white/5 border ${t.borderSoft} rounded-2xl px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 ${t.textMain}`}
          >
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
          <p className={`text-xs font-black uppercase tracking-widest ${t.textMuted}`}>Synchronizing intern records...</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInterns.map((intern) => (
            <div key={intern.id} className={`p-8 rounded-[40px] border relative group glare-hover ${t.card} ${t.borderSoft}`}>
               <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                     <span className="text-2xl font-black text-purple-400">{intern.full_name.charAt(0)}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${intern.account_status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                    {intern.account_status}
                  </div>
               </div>

               <h3 className={`text-lg font-bold font-sora mb-1 ${t.textMain}`}>{intern.full_name}</h3>
               <p className={`text-xs font-medium mb-6 ${t.textMuted}`}>{intern.email}</p>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                     <p className={`text-[10px] font-black uppercase tracking-tighter ${t.textMuted} mb-1 opacity-60`}>Department</p>
                     <p className={`text-xs font-bold ${t.textMain}`}>{intern.department_name || 'Unassigned'}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                     <p className={`text-[10px] font-black uppercase tracking-tighter ${t.textMuted} mb-1 opacity-60`}>Emp ID</p>
                     <p className={`text-xs font-bold ${t.textMain}`}>{intern.employee_id || 'N/A'}</p>
                  </div>
               </div>

               <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center text-[11px]">
                     <span className={t.textMuted}>Onboarding</span>
                     <span className={`font-bold ${intern.checklist_completed ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {intern.checklist_completed ? 'Completed' : 'Pending'}
                     </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div 
                        className={`h-full transition-all duration-1000 ${intern.checklist_completed ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: intern.checklist_completed ? '100%' : '30%' }}
                     />
                  </div>
               </div>

               <button className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  View Full Profile <ArrowRight className="w-3.5 h-3.5" />
               </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={`rounded-[32px] overflow-hidden border ${t.borderSoft} ${t.card}`}>
          <table className="w-full text-left">
            <thead className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} bg-white/3`}>
              <tr>
                <th className="px-6 py-5">Intern Profile</th>
                <th className="px-6 py-5">Onboarding</th>
                <th className="px-6 py-5">Account Status</th>
                <th className="px-6 py-5">Last Active</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInterns.map((intern) => (
                <tr key={intern.id} className={`${t.hover} transition-colors group cursor-default`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center font-bold text-purple-400 text-sm">
                          {intern.full_name.charAt(0)}
                       </div>
                       <div>
                          <p className={`text-sm font-bold ${t.textMain}`}>{intern.full_name}</p>
                          <p className={`text-[10px] ${t.textMuted}`}>{intern.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       {intern.checklist_completed ? (
                         <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       ) : (
                         <Clock className="w-4 h-4 text-amber-500" />
                       )}
                       <span className={`text-xs font-bold ${intern.checklist_completed ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {intern.checklist_completed ? 'Ready' : 'In Progress'}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${intern.account_status === 'active' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                       {intern.account_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-xs ${t.textMuted}`}>{intern.last_active ? new Date(intern.last_active).toLocaleDateString() : 'Never'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-xl hover:bg-white/10 text-slate-400 transition-all">
                       <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InternsPage;
