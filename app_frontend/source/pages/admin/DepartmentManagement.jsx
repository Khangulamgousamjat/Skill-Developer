import { useState, useEffect } from 'react';
import { 
  Building2, Plus, Users, LayoutGrid, 
  Trash2, Search, ArrowRight, Loader2,
  PieChart, Briefcase, MapPin, ExternalLink
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function DepartmentManagement() {
  const { t } = useLanguage();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', description: '', code: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/departments');
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/admin/departments', newDept);
      if (res.data.success) {
        toast.success('Department created');
        setIsModalOpen(false);
        setNewDept({ name: '', description: '', code: '' });
        fetchDepartments();
      }
    } catch (err) {
      toast.error('Failed to create department');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department? All linked users will be unassigned.')) return;
    try {
      const res = await axiosInstance.delete(`/admin/departments/${id}`);
      if (res.data.success) {
        toast.success('Department removed');
        fetchDepartments();
      }
    } catch (err) {
      toast.error('Failed to delete department');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Department Management</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">Configure organizational structure and teams</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-semibold text-sm shadow-lg shadow-[var(--color-primary)]/20"
          >
            <Plus size={18} />
            Create Department
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-3xl shadow-sm text-left">
              <Building2 size={24} className="text-[var(--color-primary)] mb-3" />
              <p className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">{departments.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1">Total Departments</p>
           </div>
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-3xl shadow-sm text-left">
              <Users size={24} className="text-[var(--color-accent)] mb-3" />
              <p className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">
                {departments.reduce((acc, curr) => acc + (curr.employee_count || 0), 0)}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1">Total Members</p>
           </div>
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-3xl shadow-sm text-left">
              <Briefcase size={24} className="text-emerald-500 mb-3" />
              <p className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">100%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1">Internal Consistency</p>
           </div>
        </div>

        {/* Departments Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Indexing Structure...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {departments.map((dept) => (
                <motion.div 
                  key={dept.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group relative"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] font-bold text-xl group-hover:scale-110 transition-transform">
                        {dept.name.charAt(0)}
                      </div>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-lg">
                           <Search size={16} />
                         </button>
                         <button 
                           onClick={() => handleDelete(dept.id)}
                           className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                         >
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] font-sora group-hover:text-[var(--color-primary)] transition-colors">{dept.name}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-2 line-clamp-2 h-8 leading-relaxed">
                      {dept.description || 'No description provided for this department unit.'}
                    </p>
                    
                    <div className="mt-6 pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Users size={14} className="text-[var(--color-text-muted)]" />
                          <span className="text-xs font-bold text-[var(--color-text-primary)]">{dept.employee_count || 0} Members</span>
                       </div>
                       <button className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                         View Details <ArrowRight size={12}/>
                       </button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-4">
                     <span className="px-2 py-1 bg-slate-500/10 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-md border border-slate-500/10">
                        {dept.code || 'DEPT'}
                     </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Create Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">New Department</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-xl">
                     <LayoutGrid size={20}/>
                  </button>
                </div>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Department Name</label>
                    <input 
                      required
                      type="text" 
                      value={newDept.name}
                      onChange={(e) => setNewDept({...newDept, name: e.target.value})}
                      placeholder="e.g. Engineering"
                      className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Internal Code</label>
                    <input 
                      required
                      type="text" 
                      value={newDept.code}
                      onChange={(e) => setNewDept({...newDept, code: e.target.value.toUpperCase()})}
                      placeholder="e.g. ENG-01"
                      className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Description</label>
                    <textarea 
                      value={newDept.description}
                      onChange={(e) => setNewDept({...newDept, description: e.target.value})}
                      placeholder="Mission and core responsibilities..."
                      className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-sm h-32 focus:border-[var(--color-primary)] outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-surface-2)] transition-all">Cancel</button>
                    <button type="submit" className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:opacity-90 shadow-lg shadow-[var(--color-primary)]/20 transition-all">Create Unit</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
