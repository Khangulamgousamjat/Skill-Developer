import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Filter, 
  CheckCircle2, XCircle, Loader2, AlertCircle, 
  MoreVertical, Laptop2, ShieldCheck, Target, 
  Building2, ArrowRight
} from 'lucide-react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

export const SkillsManagement = () => {
  const { t, isDarkMode } = useAppContext();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    is_active: true
  });

  const categories = ['All', 'Technical', 'Soft Skills', 'Management', 'Design', 'Communication', 'Tools'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/skills');
      if (res.data.success) {
        setSkills(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        description: skill.description || '',
        is_active: skill.is_active
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: '',
        category: '',
        description: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await axios.patch(`/skills/${editingSkill.id}`, formData);
        toast.success('Skill updated successfully');
      } else {
        await axios.post('/skills', formData);
        toast.success('New skill added to library');
      }
      setIsModalOpen(false);
      fetchSkills();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill? This may affect department requirements.')) return;
    try {
      await axios.delete(`/skills/${id}`);
      toast.success('Skill removed');
      fetchSkills();
    } catch (err) {
      toast.error('Could not delete skill');
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          skill.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || skill.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold font-sora flex items-center gap-3 ${t.textMain}`}>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <Laptop2 className="w-5 h-5 text-amber-500" />
            </div>
            Skills Master Library
          </h2>
          <p className={`text-sm ${t.textMuted} mt-1`}>Manage all competencies and professional standards for Gous org.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-primary hover:bg-brand-light text-white px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-4 h-4" /> Add New Skill
        </button>
      </div>

      {/* Controls */}
      <div className={`p-4 rounded-[24px] ${t.card} border ${t.borderSoft} flex flex-col md:flex-row gap-4`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border ${t.borderSoft} text-sm focus:ring-2 focus:ring-amber-500/50 outline-none transition-all`}
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`bg-white/5 border ${t.borderSoft} rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500/50`}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-[32px] overflow-hidden border ${t.borderSoft} ${t.card}`}>
        <table className="w-full text-left">
          <thead className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} bg-white/3`}>
            <tr>
              <th className="px-6 py-5">Skill Name</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Created At</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    <p className={`text-xs font-bold uppercase tracking-widest ${t.textMuted}`}>Syncing skill data...</p>
                  </div>
                </td>
              </tr>
            ) : filteredSkills.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <AlertCircle className="w-12 h-12" />
                    <p className="font-bold">No skills found matching your filters</p>
                  </div>
                </td>
              </tr>
            ) : filteredSkills.map((skill) => (
              <tr key={skill.id} className={`${t.hover} transition-colors group cursor-default`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                      <Target className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${t.textMain}`}>{skill.name}</p>
                      <p className={`text-[10px] ${t.textMuted} truncate max-w-[200px]`}>{skill.description || 'No description provided'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-white/5 border ${t.borderSoft} ${t.textMuted}`}>
                    {skill.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {skill.is_active ? (
                    <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase">
                      <XCircle className="w-3 h-3" /> Inactive
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className={`text-xs font-medium ${t.textMuted}`}>{new Date(skill.created_at).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleOpenModal(skill)}
                      className="p-2 rounded-xl hover:bg-amber-500/10 text-slate-400 hover:text-amber-500 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(skill.id)}
                      className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`${t.card} w-full max-w-lg rounded-[40px] border ${t.borderSoft} shadow-2xl relative overflow-hidden`}>
            {/* Modal Header Decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />
            
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className={`text-2xl font-bold font-sora ${t.textMain}`}>
                    {editingSkill ? 'Edit Skill Profile' : 'Add New Competency'}
                  </h3>
                  <p className={`text-sm ${t.textMuted} mt-1`}>Define parameters for this professional skill.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-5 h-5 text-slate-500 rotate-180" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${t.textMuted}`}>Skill Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. React.js, Advanced Python, Leadership"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${t.borderSoft} focus:ring-2 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-600`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${t.textMuted}`}>Category Group</label>
                  <select 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${t.borderSoft} focus:ring-2 focus:ring-amber-500/50 outline-none transition-all`}
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${t.textMuted}`}>Scope Description</label>
                  <textarea 
                    rows="3"
                    placeholder="Describe what this skill involves..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${t.borderSoft} focus:ring-2 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-600 resize-none`}
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 px-1">
                  <input 
                    type="checkbox" 
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 rounded bg-amber-500 text-amber-500 focus:ring-amber-500/30"
                  />
                  <label htmlFor="is_active" className={`text-sm font-bold ${t.textMain}`}>Active & Available in Track</label>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98]"
                  >
                    {editingSkill ? 'Update Skill Library' : 'Add to Skill DNA'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
