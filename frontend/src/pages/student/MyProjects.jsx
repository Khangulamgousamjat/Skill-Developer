import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, Briefcase, ExternalLink, Edit2, Trash2, X, CheckCircle2, Clock, Loader2, Target, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../api/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyProjects() {
  const { t } = useLanguage();
  const { user } = useSelector(state => state.auth);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [personalProjects, setPersonalProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: ''
  });

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Assigned Projects (from 'projects' table - global assignments)
      const { data: assigned } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch Personal Projects (from 'personal_projects' table - student specific)
      const { data: personal } = await supabase
        .from('personal_projects')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      setAssignedProjects(assigned || []);
      setPersonalProjects(personal || []);
    } catch (err) {
      toast.error('Sync failed with project vault');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description || '',
        link: project.link || ''
      });
    } else {
      setEditingProject(null);
      setFormData({ title: '', description: '', link: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const { error } = await supabase
          .from('personal_projects')
          .update({
            title: formData.title,
            description: formData.description,
            link: formData.link,
            updated_at: new Date()
          })
          .eq('id', editingProject.id);

        if (error) throw error;
        toast.success('Project identity updated');
      } else {
        const { error } = await supabase
          .from('personal_projects')
          .insert([{
            student_id: user.id,
            title: formData.title,
            description: formData.description,
            link: formData.link,
            status: 'in_progress'
          }]);

        if (error) throw error;
        toast.success('New project initialized');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Vault synchronization failed');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Erase this project from the vault?')) return;
    try {
      const { error } = await supabase
        .from('personal_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Project purged');
      fetchData();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-12 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] tracking-tight">Tactical Project Vault</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1.5 font-medium">Manage your professional evolution and assigned curriculum missions</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl hover:brightness-110 active:scale-95 transition-all font-bold text-sm shadow-xl shadow-[var(--color-primary)]/20"
          >
            <Plus size={20} />
            Initialize Personal Lab
          </button>
        </div>

        {/* Assigned Projects Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/10">
              <Target size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-sora leading-none">Assigned Missions</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1.5">Mandatory Curriculum Objectives</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-56 bg-[var(--color-surface-2)]/50 animate-pulse rounded-[32px] border border-[var(--color-border)]" />)}
            </div>
          ) : assignedProjects.length === 0 ? (
            <div className="p-20 text-center bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[40px] shadow-inner">
              <Sparkles size={48} className="mx-auto mb-6 text-[var(--color-border)] opacity-20" />
              <p className="text-[var(--color-text-muted)] italic font-medium">No assigned missions currently in your pipeline.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedProjects.map(project => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -8 }}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-[32px] shadow-sm hover:shadow-2xl hover:border-[var(--color-primary)]/30 transition-all group relative text-left"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 bg-indigo-500/5 text-indigo-500 border border-indigo-500/10 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      {project.category || 'MANDATORY'}
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                      <Clock size={14} className="text-amber-500" />
                      {new Date(project.deadline || project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] font-sora mb-3 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">{project.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-xs mb-8 line-clamp-2 leading-relaxed h-10 italic">{project.description}</p>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--color-border)]">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full animate-pulse border border-amber-500/10">
                      pending sync
                    </span>
                    <button className="p-3 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Personal Projects Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/10">
              <Briefcase size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-sora leading-none">Internal Evolution Lab</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1.5">Privately Managed Portfolio Assets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalProjects.map(project => (
              <motion.div
                key={project.id}
                whileHover={{ y: -8 }}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-[32px] shadow-sm group relative overflow-hidden text-left"
              >
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(project)} className="p-2.5 bg-white border border-[var(--color-border)] rounded-xl text-blue-500 hover:bg-blue-50 shadow-sm transition-all focus:scale-95">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2.5 bg-white border border-[var(--color-border)] rounded-xl text-rose-500 hover:bg-rose-50 shadow-sm transition-all focus:scale-95">
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] font-sora mb-3 pr-16 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">{project.title}</h3>
                <p className="text-[var(--color-text-muted)] text-xs mb-8 line-clamp-2 leading-relaxed h-10 italic">{project.description}</p>

                <div className="mt-4 flex flex-col gap-4 border-t border-[var(--color-border)] pt-6">
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:opacity-70 transition-all p-3 bg-[var(--color-primary)]/5 rounded-2xl border border-[var(--color-primary)]/10 w-fit">
                      <ExternalLink size={14} />
                      Live Laboratory Hub
                    </a>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">
                      <CheckCircle2 size={14} />
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            <button
              onClick={() => handleOpenModal()}
              className="bg-[var(--color-surface-2)]/30 border-2 border-dashed border-[var(--color-border)] p-8 rounded-[32px] flex flex-col items-center justify-center gap-4 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all group min-h-[220px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-all group-hover:scale-110 shadow-sm">
                <Plus size={28} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[3px] text-[var(--color-text-muted)]">Initialize Asset</p>
            </button>
          </div>
        </section>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-lg rounded-[40px] p-10 shadow-2xl relative text-left"
              >
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">
                    {editingProject ? 'Modify Laboratory Asset' : 'Initialize Personal Lab'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-2xl transition-all">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3 px-2">
                      Objective Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Distributed Neural Architecture"
                      className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl px-6 py-4 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3 px-2">
                      Technical Deep Dive (Description)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the tactical implementation details..."
                      className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl px-6 py-4 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-all resize-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3 px-2">
                      Repository / Hub URL (Link)
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={e => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://github.com/unit/asset..."
                      className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl px-6 py-4 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-all font-medium"
                    />
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full h-14 bg-[var(--color-primary)] text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[var(--color-primary)]/20"
                    >
                      {editingProject ? 'Authorize Asset Update' : 'Initialize Mission Sync'}
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

