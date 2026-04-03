import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Download, Trash2, 
  ExternalLink, Search, Filter, Loader2,
  FileCode, FileVideo, FileArchive, MoreVertical,
  Link, AlertCircle, Share2
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

export const TeacherResourcesPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'Document', url: '' });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Teacher/resources');
      if (res.data.success) {
        setResources(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load shared assets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.loading('Sharing asset...', { id: 'share' });
      await api.post('/Teacher/resources', form);
      toast.success('Technical asset added to library!', { id: 'share' });
      setIsModalOpen(false);
      setForm({ title: '', type: 'Document', url: '' });
      fetchResources();
    } catch (err) {
      toast.error('Upload failed', { id: 'share' });
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'video': return <FileVideo className="w-5 h-5 text-red-400" />;
      case 'code': return <FileCode className="w-5 h-5 text-emerald-400" />;
      case 'archive': return <FileArchive className="w-5 h-5 text-amber-400" />;
      default: return <FileText className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold font-sora flex items-center gap-3 ${t.textMain}`}>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-emerald-500" />
            </div>
            Technical Assets Library
          </h2>
          <p className={`text-sm ${t.textMuted} mt-1`}>Distribute technical whitepapers, code templates, and video deep-dives to your interns.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Share Asset
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          <p className={`text-xs font-black uppercase tracking-widest ${t.textMuted}`}>Syncing technical vault...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {resources.length === 0 ? (
            <div className={`col-span-full py-20 text-center rounded-[40px] border border-dashed border-white/10 ${t.card}`}>
               <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-700" />
               <p className="font-bold opacity-30">The technical vault is empty.</p>
            </div>
          ) : resources.map(asset => (
            <div key={asset.id} className={`p-8 rounded-[40px] border relative group glare-hover transition-all ${t.card} ${t.borderSoft}`}>
               <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)]/5 flex items-center justify-center border border-white/5 transition-transform duration-500 group-hover:scale-110">
                     {getTypeIcon(asset.type)}
                  </div>
                  <div className="flex items-center gap-1">
                     <button className="p-2 rounded-xl text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all active:scale-95">
                        <Trash2 className="w-4 h-4" />
                     </button>
                     <button className="p-2 rounded-xl text-slate-500 hover:text-white transition-all">
                        <MoreVertical className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               <h3 className={`text-lg font-bold font-sora mb-1 ${t.textMain} truncate`}>{asset.title}</h3>
               <p className={`text-[10px] font-black uppercase tracking-widest mb-8 ${t.textMuted} opacity-60`}>
                 Added on {new Date(asset.created_at).toLocaleDateString()}
               </p>

               <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase bg-[var(--color-surface)]/5 border border-white/10 ${t.textMuted}`}>
                    {asset.type}
                  </span>
                  <a 
                    href={asset.url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[var(--color-surface)]/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-emerald-600 transition-all group"
                  >
                     Access <Link className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                  </a>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
           <div className={`${t.card} w-full max-w-lg rounded-[40px] border ${t.borderSoft} p-10 shadow-2xl relative overflow-hidden text-left`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px]" />
              
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h3 className={`text-2xl font-bold font-sora ${t.textMain}`}>Share Technical Asset</h3>
                    <p className={`text-xs ${t.textMuted} mt-1`}>Add high-value resources to the secure intern cloud.</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="bottom-space-5 space-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Asset Title</label>
                    <input 
                      type="text" required placeholder="e.g. Clean Architecture Boilerplate" 
                      value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                      className={`w-full px-5 py-3 rounded-2xl bg-[var(--color-surface)]/5 border ${t.borderSoft} text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Resource Category</label>
                    <select
                      value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                      className={`w-full px-5 py-3 rounded-2xl bg-[var(--color-surface)]/5 border ${t.borderSoft} text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
                    >
                      <option value="Document">Whitepaper / PDF</option>
                      <option value="Video">Video Training</option>
                      <option value="Code">Source Repository</option>
                      <option value="Archive">Exercise Files (ZIP)</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Resource URL</label>
                    <input 
                      type="url" required placeholder="S3, GDrive, or Github Link" 
                      value={form.url} onChange={e => setForm({...form, url: e.target.value})}
                      className={`w-full px-5 py-3 rounded-2xl bg-[var(--color-surface)]/5 border ${t.borderSoft} text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
                    />
                 </div>

                 <div className="pt-4">
                    <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-emerald-500 transition-all active:scale-[0.98]">
                       Broadcast Asset →
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeacherResourcesPage;

