import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, Briefcase, ExternalLink, Edit2, Trash2, X, CheckCircle2, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

export default function MyProjects() {
  const { t } = useLanguage();
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
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignedRes, personalRes] = await Promise.all([
        axiosInstance.get('/student/projects'),
        axiosInstance.get('/student/personal-projects')
      ]);
      setAssignedProjects(assignedRes.data.data || []);
      setPersonalProjects(personalRes.data.data || []);
    } catch (err) {
      toast.error(t('somethingWentWrong'));
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
        await axiosInstance.put(`/student/personal-projects/${editingProject.id}`, formData);
        toast.success(t('preferencesUpdated'));
      } else {
        await axiosInstance.post('/student/personal-projects', formData);
        toast.success(t('addProject'));
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(t('somethingWentWrong'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      await axiosInstance.delete(`/student/personal-projects/${id}`);
      toast.success(t('logoutSuccess')); // Using logoutSuccess as placeholder for deleted success if needed
      fetchData();
    } catch (err) {
      toast.error(t('somethingWentWrong'));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{t('projects')}</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">{t('assignedProjects')} & {t('personalProjects')}</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-medium text-sm"
          >
            <Plus size={18} />
            {t('addProject')}
          </button>
        </div>

        {/* Assigned Projects Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={20} className="text-[var(--color-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] font-sora">{t('assignedProjects')}</h2>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {[1, 2].map(i => <div key={i} className="h-40 bg-[var(--color-surface-2)] animate-pulse rounded-xl" />)}
             </div>
          ) : assignedProjects.length === 0 ? (
            <div className="p-8 text-center bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-xl">
              <p className="text-[var(--color-text-muted)]">{t('noUpcomingLectures')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedProjects.map(project => (
                <div key={project.assignment_id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-xl hover:border-[var(--color-primary)] transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider">
                      {project.difficulty_level}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                      <Clock size={12} />
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-xs mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                      project.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Personal Projects Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Plus size={20} className="text-[var(--color-accent)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] font-sora">{t('personalProjects')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalProjects.map(project => (
              <div key={project.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => handleOpenModal(project)} className="p-1.5 bg-[var(--color-surface)]/10 backdrop-blur-md rounded-lg text-blue-400 hover:text-blue-300">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-1.5 bg-[var(--color-surface)]/10 backdrop-blur-md rounded-lg text-red-400 hover:text-red-300">
                    <Trash2 size={14} />
                  </button>
                </div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 pr-12">{project.title}</h3>
                <p className="text-[var(--color-text-muted)] text-xs mb-4 line-clamp-2">{project.description}</p>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-primary)] hover:underline">
                    <ExternalLink size={12} />
                    {t('projectLink')}
                  </a>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase">
                    <CheckCircle2 size={10} />
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">
                  {editingProject ? t('editProject') : t('addProject')}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-text-muted)] hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">
                    {t('projectTitle')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">
                    {t('description')}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">
                    {t('projectLink')}
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-all"
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

