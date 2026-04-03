import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, 
  MapPin, Calendar, MoreVertical, 
  Download, Plus, UserCheck, UserPlus,
  Shield, Building2, Briefcase, Loader2
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AllInterns() {
  const { t } = useLanguage();
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/hr/interns');
      if (res.data.success) {
        setInterns(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load intern directory');
    } finally {
      setLoading(false);
    }
  };

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = 
      intern.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'all' || intern.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">Global Intern Directory</h1>
            <p className="text-[var(--color-text-muted)] mt-1.5 text-sm">Comprehensive database of all registered students and interns across departments</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-surface-2)] transition-all font-bold text-xs shadow-sm">
                <Download size={16}/> Export List
             </button>
             <button className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-bold text-xs shadow-lg shadow-[var(--color-primary)]/20">
                <UserPlus size={16}/> Bulk Add
             </button>
          </div>
        </div>

        {/* Search & Filter Hub */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-[32px] shadow-sm flex flex-col md:flex-row gap-6">
           <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search interns by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm focus:border-[var(--color-primary)] outline-none transition-all shadow-sm"
              />
           </div>
           <div className="flex gap-4">
              <div className="relative">
                 <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                 <select 
                   value={deptFilter}
                   onChange={(e) => setDeptFilter(e.target.value)}
                   className="pl-9 pr-8 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm font-bold text-[var(--color-text-primary)] outline-none appearance-none cursor-pointer"
                 >
                    <option value="all">All Units</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[4px] text-[var(--color-text-muted)] animate-pulse">Syncing Directory...</p>
          </div>
        ) : filteredInterns.length === 0 ? (
          <div className="py-24 text-center bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[40px] shadow-sm">
             <Users size={64} className="mx-auto mb-4 text-[var(--color-text-muted)] opacity-20" />
             <h3 className="text-xl font-bold text-[var(--color-text-primary)]">No interns match criteria</h3>
             <p className="text-sm text-[var(--color-text-muted)] mt-2 italic max-w-sm mx-auto">Try refining your filters or verify the global registration pool.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 text-left">
            <AnimatePresence>
              {filteredInterns.map((intern) => (
                <motion.div 
                  key={intern.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6">
                     <button className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-xl transition-all">
                        <MoreVertical size={18}/>
                     </button>
                  </div>
                  
                  <div className="flex items-center gap-5 mb-8">
                     <div className="w-16 h-16 rounded-[24px] bg-[var(--color-surface-2)] border-2 border-[var(--color-border)] flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                        {intern.profile_photo_url ? <img src={intern.profile_photo_url} className="w-full h-full object-cover" /> : <div className="text-2xl font-bold font-sora text-[var(--color-primary)]">{intern.full_name?.charAt(0)}</div>}
                     </div>
                     <div>
                        <h3 className="text-lg font-bold font-sora text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{intern.full_name}</h3>
                        <p className="text-xs text-[var(--color-text-muted)] font-medium flex items-center gap-1.5 mt-1">
                           <Mail size={12}/> {intern.email}
                        </p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-[var(--color-border)] mb-8">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Department</p>
                        <p className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5"><Building2 size={12} className="text-[var(--color-primary)]" /> {intern.department || 'General'}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Core Level</p>
                        <p className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5"><Briefcase size={12} className="text-amber-500" /> {intern.skill_level || 'Junior'}</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[var(--color-text-muted)]" />
                        <span className="text-[10px] font-bold text-[var(--color-text-muted)]">Joined {new Date(intern.created_at).toLocaleDateString()}</span>
                     </div>
                     <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/10 text-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-sm">
                        View Profile <UserCheck size={12}/>
                     </button>
                  </div>

                  {intern.is_top_performer && (
                    <div className="absolute top-0 left-8 px-3 py-1 bg-amber-500 text-white rounded-b-xl text-[8px] font-black uppercase tracking-tighter shadow-lg">
                       ★ Top Performer
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
