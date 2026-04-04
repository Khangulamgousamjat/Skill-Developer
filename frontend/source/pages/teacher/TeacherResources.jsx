import { useState, useEffect } from 'react';
import { 
  FileText, Plus, File, Trash2, 
  Download, Eye, Search, Filter, 
  Folder, Archive, ExternalLink, 
  Paperclip, Database, Loader2,
  HardDrive, Monitor, BookOpen, User
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherResources() {
  const { t } = useLanguage();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', category: 'Documentation', document: null });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/teacher/resources');
      if (res.data.success) {
        setResources(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.document) return toast.error('Please select a file');
    
    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('category', uploadData.category);
    formData.append('document', uploadData.document);

    try {
      const res = await axiosInstance.post('/teacher/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Resource synchronized');
        setIsModalOpen(false);
        setUploadData({ title: '', category: 'Documentation', document: null });
        fetchResources();
      }
    } catch (err) {
       toast.error('Synchronization failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Curriculum Resource Vault</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">Host and manage documents, templates, and training guides</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all font-semibold text-sm shadow-xl shadow-[var(--color-primary)]/20"
          >
            <Plus size={18} />
            Sync New Asset
          </button>
        </div>

        {/* Resource Stats Bag */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
           <ResourceStat icon={HardDrive} label="Total Assets" value={resources.length} color="blue" />
           <ResourceStat icon={Monitor} label="Video Modules" value="12" color="indigo" />
           <ResourceStat icon={BookOpen} label="Curriculum PDFs" value="45" color="emerald" />
           <ResourceStat icon={Archive} label="Cloud Sync" value="100%" color="amber" />
        </div>

        {/* Resources Grid/List */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/30 flex items-center justify-between">
             <div className="relative max-w-sm w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input 
                  type="text" 
                  placeholder="Filter vault..."
                  className="w-full pl-9 pr-4 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-xs focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                />
             </div>
             <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white border border-[var(--color-border)] rounded-lg text-[10px] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all flex items-center gap-2 shadow-sm">
                   <Filter size={14}/> Categories
                </button>
             </div>
          </div>

          <div className="overflow-x-auto text-left">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Internal Asset</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Classification</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">Upload Date</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-center">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-20 text-center">
                       <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Unlocking resource vault...</p>
                    </td>
                  </tr>
                ) : resources.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-20 text-center text-[var(--color-text-muted)] italic">
                      No curriculum assets found in this unit.
                    </td>
                  </tr>
                ) : (
                  resources.map((res) => (
                    <tr key={res.id} className="hover:bg-[var(--color-surface-2)]/50 transition-all group">
                      <td className="p-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/5 text-indigo-500 flex items-center justify-center border border-indigo-500/10 group-hover:scale-110 transition-transform">
                               <FileText size={22} />
                            </div>
                            <div>
                               <p className="font-bold text-[var(--color-text-primary)] text-sm group-hover:text-[var(--color-primary)] transition-colors">{res.title}</p>
                               <p className="text-[10px] text-[var(--color-text-muted)] font-medium flex items-center gap-1.5"><Paperclip size={10}/> {res.file_size || '1.2 MB'}</p>
                            </div>
                         </div>
                      </td>
                      <td className="p-6 text-left">
                         <span className="px-3 py-1 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                            {res.category}
                         </span>
                      </td>
                      <td className="p-6 text-xs text-[var(--color-text-muted)] text-left">
                        {new Date(res.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-6">
                         <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href={res.file_url} target="_blank" rel="noreferrer" className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-lg"><Download size={16}/></a>
                            <button className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 size={16}/></button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-10 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Sync Resource</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-xl">
                     <Plus size={24} className="rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Resource Title</label>
                    <input 
                      required
                      type="text" 
                      value={uploadData.title}
                      onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                      placeholder="e.g. React Architecture PDF"
                      className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Classification Target</label>
                    <select 
                      required
                      value={uploadData.category}
                      onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                      className="w-full px-5 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm outline-none cursor-pointer"
                    >
                       <option value="Documentation">Documentation</option>
                       <option value="Templates">Templates</option>
                       <option value="Guides">Training Guides</option>
                       <option value="Assignments">Assignments</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 px-1">Local Identity / File</label>
                    <div className="border border-[var(--color-border)] border-dashed rounded-2xl p-8 text-center bg-[var(--color-surface-2)]/30 group hover:border-[var(--color-primary)] transition-all cursor-pointer relative">
                       <input 
                         type="file" 
                         onChange={(e) => setUploadData({...uploadData, document: e.target.files[0]})}
                         className="absolute inset-0 opacity-0 cursor-pointer"
                       />
                       <Paperclip size={24} className="mx-auto mb-3 text-[var(--color-primary)] group-hover:scale-125 transition-transform" />
                       <p className="text-xs font-bold text-[var(--color-text-primary)]">{uploadData.document ? uploadData.document.name : 'Click to select asset'}</p>
                       <p className="text-[10px] text-[var(--color-text-muted)] mt-1">PDF, DOCX, XLSX (Max 10MB)</p>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-4 border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-primary)] rounded-2xl hover:bg-[var(--color-surface-2)] transition-all">Discard</button>
                    <button type="submit" className="flex-1 px-5 py-4 bg-[var(--color-primary)] text-white text-sm font-bold rounded-2xl hover:opacity-90 shadow-xl flex items-center justify-center gap-2">
                       <ExternalLink size={18}/> Initiate Sync
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

function ResourceStat({ icon: Icon, label, value, color }) {
   const colors = {
      blue: 'bg-blue-500/10 text-blue-500',
      indigo: 'bg-indigo-500/10 text-indigo-500',
      emerald: 'bg-emerald-500/10 text-emerald-500',
      amber: 'bg-amber-500/10 text-amber-500'
   };
   return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-[32px] shadow-sm text-left">
          <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-4`}>
             <Icon size={20} />
          </div>
          <p className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{value}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1">{label}</p>
      </div>
   );
}
