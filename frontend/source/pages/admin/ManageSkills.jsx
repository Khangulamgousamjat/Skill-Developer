import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Database, Plus, Search, Filter, 
  Trash2, Edit, Save, X, Loader2,
  TrendingUp, Award, Layers
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageSkills() {
  const { t } = useLanguage();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: 'Technical' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/skills');
      if (res.data.success) {
        setSkills(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load skill library');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingSkill) {
        await axiosInstance.put(`/admin/skills/${editingSkill.id}`, formData);
        toast.success('Skill updated successfully');
      } else {
        await axiosInstance.post('/admin/skills', formData);
        toast.success('New skill added to library');
      }
      setIsModalOpen(false);
      setEditingSkill(null);
      setFormData({ name: '', description: '', category: 'Technical' });
      fetchSkills();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deleting this skill will remove it from all departments. Continue?')) return;
    try {
      await axiosInstance.delete(`/admin/skills/${id}`);
      toast.success('Skill deleted');
      fetchSkills();
    } catch (err) {
      toast.error('Failed to delete skill');
    }
  };

  const filteredSkills = skills.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">Skill Library</h1>
            <p className="text-[var(--color-text-muted)] mt-1">Define global competencies for all departments</p>
          </div>
          <button 
            onClick={() => { setEditingSkill(null); setFormData({ name: '', description: '', category: 'Technical' }); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-sm shadow-xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={18} />
            Define New Skill
          </button>
        </div>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={20} />
              <input 
                 type="text" 
                 placeholder="Search by skill name or category..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-bg)] transition-all"
              />
           </div>
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-4 flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Library Size</p>
                 <p className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{skills.length}</p>
              </div>
              <Layers size={32} className="text-[var(--color-primary)] opacity-20" />
           </div>
        </div>

        {/* Skill Library Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                 <Loader2 className="animate-spin mb-4" size={40} />
                 <p>Building Library...</p>
              </div>
           ) : filteredSkills.length === 0 ? (
              <div className="col-span-full py-20 text-center text-[var(--color-text-muted)]">
                 <Database size={60} className="mx-auto mb-4 opacity-10" />
                 <p className="text-lg font-bold">No skills defined yet.</p>
                 <p className="text-sm mt-1">Start by adding your first institutional competency.</p>
              </div>
           ) : (
              <AnimatePresence>
                 {filteredSkills.map(skill => (
                    <motion.div 
                       key={skill.id}
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2rem] p-8 shadow-sm flex flex-col justify-between group hover:border-[var(--color-primary)] transition-all hover:shadow-xl hover:shadow-black/5"
                    >
                       <div>
                          <div className="flex items-start justify-between mb-6">
                             <div className="p-3 bg-[var(--color-surface-2)] rounded-2xl text-[var(--color-text-primary)] shadow-inner">
                                <Award size={24} />
                             </div>
                             <span className="px-3 py-1 bg-[var(--color-surface-2)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] rounded-full">{skill.category}</span>
                          </div>
                          <h3 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-2">{skill.name}</h3>
                          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
                             {skill.description || 'No detailed description provided for this competency.'}
                          </p>
                       </div>
                       
                       <div className="mt-8 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingSkill(skill); setFormData({ name: skill.name, description: skill.description || '', category: skill.category || 'Technical' }); setIsModalOpen(true); }}
                            className="p-3 bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-xl transition-colors"
                          >
                             <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(skill.id)}
                            className="p-3 bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-red-500 rounded-xl transition-colors"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
           )}
        </div>

        {/* Modal */}
        {isModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
              <motion.div 
                 initial={{ scale: 0.95, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl"
              >
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{editingSkill ? 'Edit Competency' : 'Define New Competency'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[var(--color-surface-2)] rounded-full transition-colors text-[var(--color-text-muted)]">
                       <X size={24} />
                    </button>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">Skill Name</label>
                       <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Fullstack Web Development"
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                       />
                    </div>

                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">Category</label>
                       <select 
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] appearance-none cursor-pointer"
                       >
                          <option value="Technical">Technical</option>
                          <option value="Soft Skills">Soft Skills</option>
                          <option value="Management">Management</option>
                          <option value="Creative">Creative</option>
                       </select>
                    </div>

                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">Official Description</label>
                       <textarea 
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Provide a detailed scope of this competency..."
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none transition-all"
                       />
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button 
                         type="button" 
                         onClick={() => setIsModalOpen(false)}
                         className="flex-1 py-4 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-2xl font-bold text-sm hover:translate-y-[-2px] transition-all"
                       >
                          Cancel
                       </button>
                       <button 
                         disabled={submitting}
                         type="submit" 
                         className="flex-1 py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50"
                       >
                          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                          {editingSkill ? 'Update Competency' : 'Create Library Entry'}
                       </button>
                    </div>
                 </form>
              </motion.div>
           </div>
        )}
      </div>
    </DashboardLayout>
  );
}
