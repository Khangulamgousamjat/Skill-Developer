import React, { useState, useEffect } from 'react';
import { 
  Plus, Play, Trash2, Edit2, 
  Search, Filter, Loader2,
  Video, Calendar, Clock, 
  BarChart3, Globe, Lock,
  MoreVertical, X, UploadCloud
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherVideosPage() {
  const { t } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    duration: 0,
    category: 'Technical',
    is_public: true,
    tags: []
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/videos');
      if (res.data.success) {
        setVideos(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (video = null) => {
    if (video) {
      setEditingVideo(video);
      setForm({
        title: video.title,
        description: video.description || '',
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url || '',
        duration: video.duration || 0,
        category: video.category || 'Technical',
        is_public: video.is_public ?? true,
        tags: video.tags || []
      });
    } else {
      setEditingVideo(null);
      setForm({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        duration: 0,
        category: 'Technical',
        is_public: true,
        tags: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tid = toast.loading(editingVideo ? 'Updating video...' : 'Publishing video...');
    try {
      if (editingVideo) {
        await api.put(`/teacher/videos/${editingVideo.id}`, form);
        toast.success('Video updated!', { id: tid });
      } else {
        await api.post('/teacher/videos', form);
        toast.success('Video published!', { id: tid });
      }
      setIsModalOpen(false);
      fetchVideos();
    } catch (err) {
      toast.error('Operation failed', { id: tid });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video from library?')) return;
    try {
      toast.loading('Deleting...', { id: 'del' });
      await api.delete(`/teacher/videos/${id}`);
      toast.success('Video deleted', { id: 'del' });
      fetchVideos();
    } catch (err) {
      toast.error('Delete failed', { id: 'del' });
    }
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] flex items-center gap-3">
              <Video className="text-[var(--color-primary)]" size={32} />
              Educational Vault
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              Manage your technical video library and student resources.
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl hover:brightness-110 transition-all font-bold shadow-lg shadow-[var(--color-primary)]/20 active:scale-95"
          >
            <Plus size={20} />
            Publish Video
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-inner">
              <Video size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Live Content</p>
              <p className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{videos.length}</p>
            </div>
          </div>
          <div className="md:col-span-2 relative group-focus-within:scale-[1.01] transition-transform">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by title, category, or tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
            <p className="text-[10px] font-black uppercase tracking-[4px] text-[var(--color-text-muted)] animate-pulse">Synchronizing Cryptographic Store</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-24 text-center bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[40px]">
            <UploadCloud size={64} className="mx-auto mb-4 text-[var(--color-border)] opacity-20" />
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Library empty</h3>
            <p className="text-[var(--color-text-muted)] mt-2">Publish your first learning module to start student engagement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredVideos.map((video) => (
                <motion.div 
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] overflow-hidden hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 group"
                >
                  <div className="aspect-video bg-black relative overflow-hidden">
                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-900 to-slate-800">
                        <Video size={40} className="text-white/5" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
                          <Play fill="white" className="text-white" />
                       </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        {video.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                       <div className="min-w-0">
                          <h3 className="font-bold text-[var(--color-text-primary)] font-sora truncate transition-colors group-hover:text-[var(--color-primary)]">{video.title}</h3>
                          <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-1">{video.description}</p>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => handleOpenModal(video)} className="p-2 rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all">
                             <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(video.id)} className="p-2 rounded-xl bg-red-500/5 text-[var(--color-text-muted)] hover:text-red-500 transition-all">
                             <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                       <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} /> {new Date(video.created_at).toLocaleDateString()}
                          </span>
                          <span className={`flex items-center gap-1.5 ${video.is_public ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {video.is_public ? <Globe size={12} /> : <Lock size={12} />}
                            {video.is_public ? 'Public' : 'Private'}
                          </span>
                       </div>
                       <div className="flex items-center gap-1">
                          <Clock size={12} /> {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-left">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-8 shadow-2xl relative overflow-hidden text-left"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--color-surface-2)] transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{editingVideo ? 'Update Resource' : 'Publish New Content'}</h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-8">Metadata for the secure educational library.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Asset Title</label>
                      <input 
                        type="text" required placeholder="Session Topic" 
                        value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                        className="w-full px-5 py-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Classification</label>
                      <select
                        value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                        className="w-full px-5 py-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                      >
                        <option value="Technical">Technical Deep-Dive</option>
                        <option value="Soft Skills">Professional Development</option>
                        <option value="Architecture">System Architecture</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Detailed Description</label>
                  <textarea 
                    placeholder="Provide context for the student..." rows={3}
                    value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full px-5 py-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Media Source URL</label>
                      <input 
                        type="url" required placeholder="Cloudinary/S3 Link" 
                        value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})}
                        className="w-full px-5 py-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Thumbnail Preview</label>
                      <input 
                        type="url" placeholder="Image Link" 
                        value={form.thumbnail_url} onChange={e => setForm({...form, thumbnail_url: e.target.value})}
                        className="w-full px-5 py-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                      />
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${form.is_public ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                         <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${form.is_public ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                      <input 
                        type="checkbox" className="hidden"
                        checked={form.is_public} onChange={e => setForm({...form, is_public: e.target.checked})}
                      />
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">Public Visibility</span>
                   </label>
                   
                   <button type="submit" className="px-10 py-4 bg-[var(--color-primary)] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all">
                      {editingVideo ? 'Commit Changes' : 'Broadcast Video'}
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
