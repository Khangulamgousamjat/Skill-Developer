import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, Plus, Trash2, Loader2, 
  Search, Briefcase, Info, AlertCircle,
  Users, Target, ArrowRight, X,
  Layers, ChevronRight, LayoutGrid
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../../components/shared/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

export default function DepartmentsPage() {
  const { t } = useLanguage();
  const isDarkMode = useSelector((s) => s.ui.theme === 'dark');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/departments');
      if (res.data.success) {
        setDepartments(res.data.data || []);
      }
    } catch {
      toast.error('Failed to synchronize organizational units');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    try {
      setLoading(true);
      const res = await api.post('/admin/departments', { 
        name: newName, 
        description: newDesc 
      });
      if (res.data.success) {
        setDepartments(prev => [...prev, res.data.data]);
        setNewName('');
        setNewDesc('');
        setIsAdding(false);
        toast.success('New Department successfully provisioned');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Protocol failure during creation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Initiate deletion protocol for ${name}? This action is irreversible.`)) return;
    
    try {
      setDeletingId(id);
      await api.delete(`/admin/departments/${id}`);
      setDepartments(prev => prev.filter(d => d.id !== id));
      toast.success('Department neutralized from registry');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access denied: Active dependencies detected');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner">
                <LayoutGrid size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">Organizational Units</h1>
                <p className="text-[var(--color-text-muted)] text-sm mt-0.5">Manage departmental clusters and core business sectors</p>
             </div>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isAdding ? 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)]' : 'bg-amber-500 text-white hover:shadow-lg hover:shadow-amber-500/20 active:scale-95'}`}
          >
            {isAdding ? <X size={16} /> : <Plus size={16} />}
            {isAdding ? 'Close Protocol' : 'Provision Dept'}
          </button>
        </div>

        {/* PROVISIONING INTERFACE */}
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
               <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-amber-500/5 to-amber-500/10 border border-amber-500/20 shadow-2xl shadow-amber-500/5">
                  <h3 className="text-lg font-bold font-sora text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                     <Target className="text-amber-500" size={20} />
                     Dept. Configuration
                  </h3>
                  <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Identity Name</label>
                        <input 
                          type="text" 
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="e.g. Artificial Intelligence Group"
                          className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-[var(--color-text-primary)]"
                          required
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Strategic Description</label>
                        <input 
                          type="text" 
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          placeholder="Mission objective for this cluster..."
                          className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-[var(--color-text-primary)]"
                        />
                     </div>
                     <div className="md:col-span-2 flex justify-end">
                        <button 
                          type="submit" 
                          disabled={loading || !newName.trim()}
                          className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Provisioning'}
                          <ArrowRight size={16} />
                        </button>
                     </div>
                  </form>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEARCH MATRIX */}
        <div className="relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)] group-focus-within:text-amber-500 transition-colors" />
           <input 
             type="text"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             placeholder="Synchronize with departmental keys..."
             className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-[var(--color-surface)] border border-[var(--color-border)] text-sm outline-none focus:shadow-2xl focus:shadow-amber-500/5 transition-all text-[var(--color-text-primary)]"
           />
        </div>

        {/* DEPARTMENT CLUSTERS */}
        {loading && departments.length === 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
                   <Skeleton className="w-14 h-14 rounded-2xl" />
                   <Skeleton className="h-6 w-3/4" />
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-1/2" />
                   <div className="pt-6 border-t border-[var(--color-border)] flex justify-between">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-4" />
                   </div>
                </div>
              ))}
           </div>
        ) : filtered.length === 0 ? (
           <div className="py-20 flex justify-center">
              <EmptyState 
                icon={Layers}
                title="Null Department Matrix"
                description="Zero datasets matched the current filter sequence. Try different strategic keys or provision a new unit."
                actionLabel="Clear Matrix Search"
                onAction={() => setSearchTerm('')}
              />
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(dept => (
                <motion.div 
                  key={dept.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative p-8 rounded-[2.5rem] bg-[var(--color-surface)] border border-[var(--color-border)] transition-all hover:bg-[var(--color-surface-2)]/50 hover:shadow-2xl hover:shadow-amber-500/5"
                >
                   <div className="absolute top-6 right-6">
                      <button 
                         onClick={() => handleDelete(dept.id, dept.name)}
                         className="p-2 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                         disabled={deletingId === dept.id}
                      >
                         {deletingId === dept.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                   </div>
                   
                   <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                      <Briefcase size={24} />
                   </div>
                   
                   <h4 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-2">{dept.name}</h4>
                   <p className="text-sm text-[var(--color-text-muted)] leading-relaxed h-12 line-clamp-2">
                      {dept.description || 'No descriptive metadata provided for this cluster.'}
                    </p>
                   
                   <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="p-1.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                            <Users size={12} />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Active Node</span>
                      </div>
                      <ChevronRight size={16} className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                   </div>
                   
                   <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500/0 group-hover:bg-amber-500/40 rounded-b-full transition-all" />
                </motion.div>
              ))}
           </div>
        )}
      </div>
    </DashboardLayout>
  );
}
