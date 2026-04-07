import { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, 
  Download, Search, Filter, 
  Archive, ExternalLink, 
  Paperclip, Loader2,
  HardDrive, Monitor, BookOpen, X
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../api/supabase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherResources() {
  const { t } = useLanguage();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', category: 'Documentation', document: null });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      toast.error('Failed to load curriculum vault');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.document && uploadData.category !== 'Link') return toast.error('Please select an asset');
    
    setIsUploading(true);
    try {
      let fileUrl = '';
      if (uploadData.document) {
        const fileExt = uploadData.document.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `curriculum/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('teacher-assets')
          .upload(filePath, uploadData.document);

        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('teacher-assets')
          .getPublicUrl(filePath);
        
        fileUrl = urlData.publicUrl;
      }

      // If category is "Assignments", also insert into 'projects' table for students
      if (uploadData.category === 'Assignments') {
        const { error: projError } = await supabase
          .from('projects')
          .insert([{
            title: uploadData.title,
            description: `Global assignment sync from Curriculum Vault.`,
            category: 'MANDATORY',
            file_url: fileUrl
          }]);
        if (projError) throw projError;
      }

      const { error: dbError } = await supabase
        .from('resources')
        .insert([{
          title: uploadData.title,
          category: uploadData.category,
          file_url: fileUrl,
          file_size: uploadData.document ? `${(uploadData.document.size / (1024 * 1024)).toFixed(2)} MB` : '0 MB',
          teacher_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (dbError) throw dbError;

      toast.success('Resource synchronized successfully');
      setIsModalOpen(false);
      setUploadData({ title: '', category: 'Documentation', document: null });
      fetchResources();
    } catch (err) {
       toast.error('Synchronization failed');
       console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (resource) => {
    if (!window.confirm('Erase this asset from the curriculum vault?')) return;
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resource.id);
      
      if (error) throw error;
      toast.success('Asset purged');
      fetchResources();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] tracking-tight">Curriculum Resource Vault</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1.5 font-medium">Host and manage documents, templates, and tactical training guides</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl hover:brightness-110 active:scale-95 transition-all font-bold text-sm shadow-xl shadow-[var(--color-primary)]/20"
          >
            <Plus size={20} />
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
          <div className="p-8 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/30 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="relative max-w-sm w-full group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter tactical vault..."
                  className="w-full pl-12 pr-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none shadow-sm transition-all"
                />
             </div>
             <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition-all flex items-center gap-2 shadow-sm">
                   <Filter size={14}/> Categories
                </button>
             </div>
          </div>

          <div className="overflow-x-auto text-left">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/10">
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] text-left">Internal Asset</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] text-left">Classification</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] text-left">Sync Date</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] text-center">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-24 text-center">
                       <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)] mx-auto mb-6" />
                       <p className="text-[10px] font-black uppercase tracking-[4px] text-[var(--color-text-muted)] animate-pulse">Unlocking tactical resource vault...</p>
                    </td>
                  </tr>
                ) : resources.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-24 text-center text-[var(--color-text-muted)] italic font-medium">
                      No curriculum assets found in this sector.
                    </td>
                  </tr>
                ) : (
                  resources.map((res) => (
                    <tr key={res.id} className="hover:bg-[var(--color-surface-2)]/50 transition-all group">
                      <td className="p-8">
                         <div className="flex items-center gap-5">
                            <div className="w-[52px] h-[52px] rounded-2xl bg-indigo-500/5 text-indigo-500 flex items-center justify-center border border-indigo-500/10 group-hover:scale-110 transition-transform shadow-inner">
                               <FileText size={24} />
                            </div>
                            <div>
                               <p className="font-bold text-[var(--color-text-primary)] text-sm group-hover:text-[var(--color-primary)] transition-colors leading-tight mb-1">{res.title}</p>
                               <p className="text-[10px] text-[var(--color-text-muted)] font-black uppercase tracking-widest flex items-center gap-2 opacity-60"><Paperclip size={12} className="text-indigo-400"/> {res.file_size || '1.2 MB'}</p>
                            </div>
                         </div>
                      </td>
                      <td className="p-8 text-left">
                         <span className="px-3.5 py-1.5 bg-white border border-[var(--color-border)] rounded-xl text-[9px] font-black uppercase tracking-[0.15em] text-[var(--color-text-muted)] shadow-sm group-hover:border-[var(--color-primary)]/20 transition-all">
                            {res.category}
                         </span>
                      </td>
                      <td className="p-8 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-left">
                        {new Date(res.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-8">
                         <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <a href={res.file_url} target="_blank" rel="noreferrer" className="p-3 text-[var(--color-text-muted)] hover:bg-indigo-500 hover:text-white rounded-xl shadow-sm transition-all"><Download size={18}/></a>
                            <button onClick={() => handleDelete(res)} className="p-3 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl shadow-sm transition-all"><Trash2 size={18}/></button>
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
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-10 shadow-3xl text-left"
              >
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Sync Resource</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mt-1.5 px-0.5">Tactical Asset Initialization</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-2xl transition-all">
                     <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3 px-2">Asset Identity / Title</label>
                    <input 
                      required
                      type="text" 
                      value={uploadData.title}
                      onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                      placeholder="e.g. Protocol Architecture Deep Dive"
                      className="w-full px-6 py-4.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm font-medium focus:border-[var(--color-primary)] outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3 px-2">Classification Target</label>
                    <select 
                      required
                      value={uploadData.category}
                      onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                      className="w-full px-6 py-4.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm font-bold outline-none cursor-pointer shadow-inner appearance-none"
                    >
                       <option value="Documentation">Documentation</option>
                       <option value="Templates">Templates</option>
                       <option value="Guides">Training Guides</option>
                       <option value="Assignments">Assignments (Sync to Project Board)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3 px-2">Binary Source / Local File</label>
                    <div className="border border-[var(--color-border)] border-dashed rounded-[32px] p-12 text-center bg-[var(--color-surface-2)]/30 group hover:border-[var(--color-primary)] transition-all cursor-pointer relative shadow-inner">
                       <input 
                         type="file" 
                         onChange={(e) => setUploadData({...uploadData, document: e.target.files[0]})}
                         className="absolute inset-0 opacity-0 cursor-pointer"
                       />
                       <Paperclip size={32} className="mx-auto mb-4 text-[var(--color-primary)] group-hover:scale-125 transition-transform" />
                       <p className="text-xs font-bold text-[var(--color-text-primary)]">{uploadData.document ? uploadData.document.name : 'Click to select curiculum asset'}</p>
                       <p className="text-[10px] font-medium text-[var(--color-text-muted)] mt-2 uppercase tracking-widest opacity-60">PDF, DOCX, XLSX (Max 10MB)</p>
                    </div>
                  </div>
                  <div className="flex gap-5 pt-8">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-4.5 border border-[var(--color-border)] text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] rounded-2xl hover:bg-[var(--color-surface-2)] transition-all">Discard</button>
                    <button 
                      type="submit" 
                      disabled={isUploading}
                      className="flex-1 px-5 py-4.5 bg-[var(--color-primary)] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 active:scale-95 shadow-2xl shadow-[var(--color-primary)]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                       {isUploading ? <Loader2 size={18} className="animate-spin" /> : <ExternalLink size={18}/>}
                       {isUploading ? 'Syncing...' : 'Initiate Sync'}
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
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-[40px] shadow-sm text-left group hover:border-[var(--color-primary)]/30 transition-all cursor-default">
          <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-inner`}>
             <Icon size={24} />
          </div>
          <p className="text-3xl font-bold font-sora text-[var(--color-text-primary)] leading-none">{value}</p>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mt-2 opacity-60 leading-tight">{label}</p>
      </div>
   );
}
