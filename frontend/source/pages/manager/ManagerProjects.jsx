import { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Search, Filter, 
  MoreVertical, Clock, CheckCircle2, 
  AlertCircle, Users, LayoutGrid, 
  Target, BarChart3, TrendingUp, Loader2,
  Calendar, ArrowRight, Video, FileText
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManagerProjects() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', deadline: '', priority: 'Medium' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/manager/projects');
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load project database');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/manager/projects', newProject);
      if (res.data.success) {
        toast.success('Project pipeline initialized');
        setIsModalOpen(false);
        setNewProject({ title: '', description: '', deadline: '', priority: 'Medium' });
        fetchProjects();
      }
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">Department Project Hub</h1>
            <p className="text-[var(--color-text-muted)] mt-1.5 text-sm">Assign and monitor high-value projects across your teams</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-bold text-xs shadow-lg shadow-[var(--color-primary)]/20"
          >
            <Plus size={16} />
            Initialize Project
          </button>
        </div>

        {/* Project Metrics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
           <ProjectStat icon={Briefcase} label="Active Pipelines" value={projects.length} color="blue" />
           <ProjectStat icon={Target} label="Completion Rate" value="64%" color="indigo" />
           <ProjectStat icon={TrendingUp} label="Dept Velocity" value="+12%" color="emerald" />
           <ProjectStat icon={BarChart3} label="Pending Review" value="8" color="rose" />
        </div>

        {/* Project Pipeline List */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/30 flex items-center justify-between">
             <div className="relative max-w-sm w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input 
                  type="text" 
                  placeholder="Filter projects..."
                  className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[var(--color-primary)] shadow-sm"
                />
             </div>
             <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-white border border-[var(--color-border)] rounded-lg text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all flex items-center gap-2 shadow-sm">
                   <Filter size={14}/> Active Only
                </button>
             </div>
          </div>

          <div className="overflow-x-auto text-left">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Project Title & Description</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Team Coverage</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Timeline</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-center">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-24 text-center">
                       <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)] mx-auto mb-4 opacity-50" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">analyzing project pipelines...</p>
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-24 text-center text-[var(--color-text-muted)] italic">
                      No projects found in this organizational unit.
                    </td>
                  </tr>
                ) : (
                  projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-[var(--color-surface-2)]/50 transition-all group">
                      <td className="p-6 max-w-sm">
                         <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/5 text-indigo-500 flex items-center justify-center border border-indigo-500/10 group-hover:scale-110 transition-transform">
                               <Briefcase size={20} />
                            </div>
                            <div>
                               <p className="font-bold text-[var(--color-text-primary)] text-sm group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{proj.title}</p>
                               <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2 leading-relaxed italic">{proj.description}</p>
                            </div>
                         </div>
                      </td>
                      <td className="p-6">
                         <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[var(--color-surface-2)] flex items-center justify-center text-[8px] font-black text-indigo-500 shadow-sm overflow-hidden">
                                 {i === 3 ? '+8' : <User size={12}/>}
                               </div>
                            ))}
                         </div>
                         <p className="text-[9px] font-bold text-[var(--color-text-muted)] mt-2 uppercase tracking-tighter">11 Members Assigned</p>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1.5 text-left">
                           <span className="text-[10px] font-bold text-[var(--color-text-primary)] flex items-center gap-2"><Clock size={12} className="text-rose-500"/> Due {new Date(proj.deadline).toLocaleDateString()}</span>
                           <div className="w-24 h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden border border-[var(--color-border)]">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }} />
                           </div>
                        </div>
                      </td>
                      <td className="p-6">
                         <div className="flex items-center justify-around gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-lg"><LayoutGrid size={16}/></button>
                            <button className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><MoreVertical size={16}/></button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Initialization Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-10 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                        <Target size={28} />
                      </div>
                      <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Initialize Project</h2>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-xl transition-all">
                      <Plus size={24} className="rotate-45" />
                   </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Project Headline</label>
                    <input 
                      required
                      type="text" 
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      placeholder="e.g. Cloud Infrastructure Migration"
                      className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm focus:border-[var(--color-primary)] font-medium outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Internal Deadline</label>
                      <input 
                        required
                        type="date" 
                        value={newProject.deadline}
                        onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                        className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm outline-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Priority Target</label>
                      <select 
                        required
                        value={newProject.priority}
                        onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                        className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm outline-none cursor-pointer font-bold"
                      >
                         <option value="High">🔴 High Critical</option>
                         <option value="Medium">🟡 Medium Priority</option>
                         <option value="Low">🟢 Low Background</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Scope & Objectives</label>
                    <textarea 
                      required
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Enter core milestones and success criteria..."
                      className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm h-32 focus:border-[var(--color-primary)] outline-none transition-all resize-none shadow-sm"
                    />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-4 border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-primary)] rounded-2xl hover:bg-[var(--color-surface-2)]">Discard</button>
                    <button type="submit" className="flex-1 px-5 py-4 bg-[var(--color-primary)] text-white text-sm font-bold rounded-2xl hover:opacity-90 shadow-xl flex items-center justify-center gap-2">
                       Establish Scope <ArrowRight size={18}/>
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

function ProjectStat({ icon: Icon, label, value, color }) {
   const colors = {
      blue: 'bg-blue-500/10 text-blue-500',
      indigo: 'bg-indigo-500/10 text-indigo-500',
      emerald: 'bg-emerald-500/10 text-emerald-500',
      rose: 'bg-rose-500/10 text-rose-500'
   };
   return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-[32px] shadow-sm text-left group hover:scale-[1.02] transition-transform duration-300">
          <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-4`}>
             <Icon size={20} />
          </div>
          <p className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{value}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1">{label}</p>
      </div>
   );
}
