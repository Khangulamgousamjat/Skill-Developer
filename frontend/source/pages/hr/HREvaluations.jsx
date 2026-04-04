import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Users, Award, ShieldCheck, ClipboardList, 
  Search, ExternalLink, Loader2, Plus, 
  CheckCircle, Star, FileText, Download 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function HREvaluations() {
  const { t } = useLanguage();
  const [interns, setInterns] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Issue Certificate Modal State
  const [certModal, setCertModal] = useState({
    isOpen: false,
    internId: null,
    internName: '',
    certificateType: 'Project Mastery',
    skillId: '',
    projectId: '',
    submitting: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [internsRes, skillsRes, projectsRes] = await Promise.all([
        axiosInstance.get('/hr/interns'),
        axiosInstance.get('/admin/skills'),
        axiosInstance.get('/manager/projects') // Using manager projects list for now
      ]);

      if (internsRes.data.success) setInterns(internsRes.data.data);
      if (skillsRes.data.success) setSkills(skillsRes.data.data);
      if (projectsRes.data.success) setProjects(projectsRes.data.data);

    } catch (err) {
      toast.error('Failed to load evaluation data');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCert = async () => {
    if (!certModal.internId) return;
    
    setCertModal(prev => ({ ...prev, submitting: true }));
    try {
      const payload = {
        internId: certModal.internId,
        certificateType: certModal.certificateType,
        skillId: certModal.skillId || null,
        projectId: certModal.projectId || null,
        skillsCovered: [] // Can be extended later
      };

      const res = await axiosInstance.post('/certificates/issue', payload);
      if (res.data.success) {
        toast.success(`Certificate issued successfully to ${certModal.internName}!`);
        setCertModal({ isOpen: false, internId: null, internName: '', certificateType: 'Project Mastery', skillId: '', projectId: '', submitting: false });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue certificate');
    } finally {
      setCertModal(prev => ({ ...prev, submitting: false }));
    }
  };

  const filteredInterns = interns.filter(i => 
    i.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">HR Evaluation Console</h1>
            <p className="text-[var(--color-text-muted)] mt-1">Review student achievements and issue professional certificates</p>
          </div>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
             <input 
               type="text" 
               placeholder="Search by name or email..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm w-full md:w-64 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
             />
          </div>
        </div>

        {/* Interns Table */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p>Loading intern data...</p>
            </div>
          ) : filteredInterns.length === 0 ? (
            <div className="py-20 text-center text-[var(--color-text-muted)]">
               <ClipboardList size={40} className="mx-auto mb-3 opacity-20" />
               <p>No interns found matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-surface-2)]/50 border-b border-[var(--color-border)]">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Intern</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Current Progress</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {filteredInterns.map((intern) => (
                    <tr key={intern.id} className="hover:bg-[var(--color-surface-2)]/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] shrink-0">
                            {intern.full_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--color-text-primary)] text-sm">{intern.full_name}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{intern.department_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-4 text-xs font-bold text-[var(--color-text-primary)]">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--color-surface-2)]">
                               <Star size={14} className="text-amber-500" />
                               Lvl {intern.current_level || 1}
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--color-surface-2)]">
                               <CheckCircle size={14} className="text-green-500" />
                               {intern.total_xp || 0} XP
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                        <button 
                          onClick={() => setCertModal({ ...certModal, isOpen: true, internId: intern.id, internName: intern.full_name })}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-[var(--color-primary)]/10"
                        >
                          <Award size={14} />
                          Issue Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Certificate Issuance Modal */}
        {certModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Award size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">Issue Official Certificate</h2>
                    <p className="text-xs text-[var(--color-text-muted)]">Recognizing achievement for <span className="text-[var(--color-primary)] font-bold">{certModal.internName}</span></p>
                  </div>
                </div>
                <button onClick={() => setCertModal({ ...certModal, isOpen: false })} className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Certificate Type */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">Certificate Category</label>
                  <select 
                    value={certModal.certificateType}
                    onChange={(e) => setCertModal(prev => ({ ...prev, certificateType: e.target.value }))}
                    className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] opacity-90"
                  >
                    <option value="Project Mastery">Project Mastery</option>
                    <option value="Skill Proficiency">Skill Proficiency</option>
                    <option value="Advanced Specialization">Advanced Specialization</option>
                    <option value="Excellence Recognition">Excellence Recognition</option>
                  </select>
                </div>

                {/* Choose Skill OR Project */}
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">Link to Skill</label>
                     <select 
                        value={certModal.skillId}
                        onChange={(e) => setCertModal(prev => ({ ...prev, skillId: e.target.value, projectId: '' }))}
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] opacity-90"
                      >
                        <option value="">-- None --</option>
                        {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                   </div>
                   <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">Link to Project</label>
                     <select 
                        value={certModal.projectId}
                        onChange={(e) => setCertModal(prev => ({ ...prev, projectId: e.target.value, skillId: '' }))}
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] opacity-90"
                      >
                        <option value="">-- None --</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                      </select>
                   </div>
                </div>

                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                  <div className="flex gap-3">
                    <ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed font-medium">
                      Generation of this certificate will be permanent and verifiable via the public module URL. Please ensure all student data is correct before proceeding.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setCertModal({ ...certModal, isOpen: false })}
                    className="flex-1 py-4 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-2xl font-bold text-sm hover:translate-y-[-2px] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={certModal.submitting}
                    onClick={handleIssueCert}
                    className="flex-1 py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {certModal.submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    {certModal.submitting ? 'Generating...' : 'Confirm & Issue'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
