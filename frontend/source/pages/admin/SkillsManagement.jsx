import { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, 
  Terminal, Code2, Database, Layout, 
  Layers, Package, Settings, Filter,
  TrendingUp, Award, Activity, Loader2
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function SkillsManagement() {
  const { t } = useLanguage();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Technical', difficulty: 'Intermediate', description: '' });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/skills');
      if (res.data.success) {
        setSkills(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        const res = await axiosInstance.put(`/admin/skills/${editingSkill.id}`, newSkill);
        if (res.data.success) {
          toast.success('Skill updated');
        }
      } else {
        const res = await axiosInstance.post('/admin/skills', newSkill);
        if (res.data.success) {
          toast.success('Skill added to directory');
        }
      }
      setIsModalOpen(false);
      setEditingSkill(null);
      setNewSkill({ name: '', category: 'Technical', difficulty: 'Intermediate', description: '' });
      fetchSkills();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill? This will affect gap analysis for all users.')) return;
    try {
      const res = await axiosInstance.delete(`/admin/skills/${id}`);
      if (res.data.success) {
        toast.success('Skill removed');
        fetchSkills();
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const categories = ['Technical', 'Soft Skills', 'Architecture', 'Product', 'Business'];

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Technical': return <Terminal size={18} className="text-blue-500" />;
      case 'Soft Skills': return <Users size={18} className="text-rose-500" />;
      case 'Architecture': return <Layers size={18} className="text-indigo-500" />;
      case 'Product': return <Package size={18} className="text-emerald-500" />;
      default: return <Code2 size={18} className="text-amber-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Global Skills Library</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">Define core competencies and skill taxonomies</p>
          </div>
          <button 
            onClick={() => { setIsModalOpen(true); setEditingSkill(null); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-semibold text-sm shadow-lg shadow-[var(--color-primary)]/20"
          >
            <Plus size={18} />
            Define New Skill
          </button>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-[24px] shadow-sm flex items-center justify-between text-left">
              <div>
                <p className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{skills.length}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Active Skills</p>
              </div>
              <Activity size={24} className="text-[var(--color-primary)] opacity-30" />
           </div>
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-[24px] shadow-sm flex items-center justify-between text-left">
              <div>
                <p className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">5</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Taxonomies</p>
              </div>
              <Layers size={24} className="text-rose-500 opacity-30" />
           </div>
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-[24px] shadow-sm flex items-center justify-between text-left">
              <div>
                <p className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">High</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Metric Precision</p>
              </div>
              <TrendingUp size={24} className="text-emerald-500 opacity-30" />
           </div>
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-[24px] shadow-sm flex items-center justify-between text-left">
              <div>
                <p className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">AI</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Mapped Insights</p>
              </div>
              <Award size={24} className="text-amber-500 opacity-30" />
           </div>
        </div>

        {/* Skills Library List */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input 
                  type="text" 
                  placeholder="Filter skills by name..."
                  className="w-full pl-9 pr-4 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-xs focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
                />
             </div>
             <div className="flex items-center gap-2">
               <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] text-xs flex items-center gap-2">
                 <Filter size={14} /> Taxonomy
               </button>
               <button className="px-3 py-1.5 bg-slate-500/10 text-slate-500 text-xs rounded-lg font-bold border border-slate-500/10 uppercase tracking-widest">
                  CSV Export
               </button>
             </div>
          </div>

          <div className="overflow-x-auto text-left">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Skill Detail</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Taxonomy Unit</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Base Difficulty</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-center">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr>
                     <td colSpan="4" className="p-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Populating skill database...</p>
                     </td>
                  </tr>
                ) : (
                  skills.map((skill) => (
                    <tr key={skill.id} className="hover:bg-[var(--color-surface-2)]/50 transition-all group">
                      <td className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                            {getCategoryIcon(skill.category)}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--color-text-primary)] text-sm">{skill.name}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-1 max-w-xs">{skill.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[10px] font-bold text-[var(--color-text-primary)] rounded-lg">
                          {skill.category}
                        </span>
                      </td>
                      <td className="p-6">
                         <span className={`px-3 py-1 text-[9px] font-black tracking-widest uppercase rounded-lg border ${
                           skill.difficulty === 'Expert' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                           skill.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                           'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                         }`}>
                           {skill.difficulty}
                         </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={() => { setEditingSkill(skill); setNewSkill(skill); setIsModalOpen(true); }}
                            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-2)] rounded-lg transition-all"
                           >
                              <Edit2 size={16}/>
                           </button>
                           <button 
                            onClick={() => handleDelete(skill.id)}
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                           >
                              <Trash2 size={16}/>
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
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
                  <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">
                    {editingSkill ? 'Edit Skill Definition' : 'Define New Skill'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-xl">
                     <Plus size={20} className="rotate-45" />
                  </button>
                </div>
                <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Skill Name</label>
                    <input 
                      required
                      type="text" 
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                      placeholder="e.g. System Design"
                      className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Category Unit</label>
                      <select 
                        required
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                        className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Base Level</label>
                      <select 
                        required
                        value={newSkill.difficulty}
                        onChange={(e) => setNewSkill({...newSkill, difficulty: e.target.value})}
                        className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Skill Description</label>
                    <textarea 
                      required
                      value={newSkill.description}
                      onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                      placeholder="Core competencies covered..."
                      className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-sm h-32 focus:border-[var(--color-primary)] outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-surface-2)] transition-all">Cancel</button>
                    <button type="submit" className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:opacity-90 shadow-lg transition-all">
                       {editingSkill ? 'Commit Changes' : 'Initialize Skill'}
                    </button>
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
