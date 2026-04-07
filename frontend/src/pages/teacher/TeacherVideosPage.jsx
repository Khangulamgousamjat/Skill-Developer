import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Plus, Play, Trash2, Edit2, 
  Search, Filter, Loader2,
  Video as VideoIcon, Calendar, Clock, 
  BarChart3, Globe, Lock,
  MoreVertical, X, UploadCloud, Camera, Check
} from 'lucide-react';
import { supabase } from '../../api/supabase';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherVideosPage() {
  const { t } = useLanguage();
  const { user } = useSelector(state => state.auth);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
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
    if (user) fetchVideos();
  }, [user]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (err) {
      toast.error('Failed to load videos from Supabase');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, bucket) => {
    if (!file) return null;
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          }
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      toast.error(`Upload failed to ${bucket}`);
      console.error(err);
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
    if (!form.video_url) {
        toast.error('Please upload a video first');
        return;
    }
    
    const tid = toast.loading(editingVideo ? 'Updating video metadata...' : 'Publishing content...');
    try {
      const payload = {
        ...form,
        teacher_id: user.id,
        teacher_name: user.full_name,
        updated_at: new Date().toISOString()
      };

      if (editingVideo) {
        const { error } = await supabase
          .from('videos')
          .update(payload)
          .eq('id', editingVideo.id);
        if (error) throw error;
        toast.success('Resource updated successfully!', { id: tid });
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([payload]);
        if (error) throw error;
        toast.success('Video published to platform!', { id: tid });
      }
      setIsModalOpen(false);
      fetchVideos();
    } catch (err) {
      toast.error('Sync failed with library', { id: tid });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this from encrypted repository?')) return;
    const tid = toast.loading('Purging content...');
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Asset deleted!', { id: tid });
      fetchVideos();
    } catch (err) {
      toast.error('Purge failed', { id: tid });
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
              <VideoIcon className="text-[var(--color-primary)]" size={32} />
              Educational Vault
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1 text-sm font-medium">
              Manage your technical video library and student resources via Supabase.
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl hover:brightness-110 hover:scale-[1.02] transition-all font-bold shadow-lg shadow-[var(--color-primary)]/30 active:scale-95"
          >
            <Plus size={20} />
            Publish Resource
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-indigo-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <VideoIcon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[2px] text-[var(--color-text-muted)] mb-1">Live Content</p>
              <p className="text-3xl font-bold font-sora text-[var(--color-text-primary)]">{videos.length}</p>
            </div>
          </div>
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by title, category, or tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none shadow-sm transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
            <p className="text-[10px] font-black uppercase tracking-[4px] text-[var(--color-text-muted)] animate-pulse">Synchronizing Cryptographic Store</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-24 text-center bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[40px] flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center mb-6">
                <UploadCloud size={40} className="text-[var(--color-text-muted)] opacity-30" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Library empty</h3>
            <p className="text-[var(--color-text-muted)] mt-2 italic max-w-xs mx-auto">Publish your first learning module to start student engagement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
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
                        <VideoIcon size={40} className="text-white/5" />
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
                          <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-1 italic">{video.description}</p>
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
                       <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                          <Clock size={12} className="text-[var(--color-primary)]" /> {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-[var(--color-surface-2)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{editingVideo ? 'Update Resource' : 'Publish New Content'}</h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-8">Synchronize assets with the secure educational library.</p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Video Source</label>
                    <div className="relative h-40 group cursor-pointer">
                        <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-[var(--color-border)] group-hover:border-[var(--color-primary)]/50 transition-all flex flex-col items-center justify-center gap-2 bg-[var(--color-surface-2)]">
                            {uploading && form.video_url === '' ? (
                                <div className="text-center">
                                    <Loader2 className="animate-spin text-[var(--color-primary)] mx-auto mb-2" />
                                    <p className="text-[10px] font-bold">{uploadProgress}%</p>
                                </div>
                            ) : form.video_url ? (
                                <div className="text-center p-4">
                                    <Check className="text-emerald-500 mx-auto mb-2" />
                                    <p className="text-[10px] font-bold truncate max-w-[150px]">VIDEO_READY.MP4</p>
                                    <button onClick={() => setForm({...form, video_url: ''})} className="mt-2 text-[10px] text-rose-500 font-bold hover:underline">Change</button>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-all" size={32} />
                                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-all px-4 text-center uppercase tracking-tighter">Click to Upload MP4</p>
                                </>
                            )}
                        </div>
                        {!form.video_url && !uploading && (
                            <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                                const url = await handleFileUpload(e.target.files[0], 'videos');
                                if (url) setForm({...form, video_url: url});
                            }} />
                        )}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Cover Image</label>
                    <div className="relative h-40 group cursor-pointer overflow-hidden rounded-3xl">
                        <div className="absolute inset-0 border-2 border-dashed border-[var(--color-border)] group-hover:border-[var(--color-primary)]/50 transition-all flex flex-col items-center justify-center gap-2 bg-[var(--color-surface-2)]">
                            {uploading && form.thumbnail_url === '' ? (
                                 <Loader2 className="animate-spin text-[var(--color-primary)]" />
                            ) : form.thumbnail_url ? (
                                <img src={form.thumbnail_url} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <>
                                    <Camera className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-all" size={32} />
                                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-all uppercase px-4 text-center">Upload Thumbnail</p>
                                </>
                            )}
                        </div>
                        {!uploading && (
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                                 const url = await handleFileUpload(e.target.files[0], 'thumbnails');
                                 if (url) setForm({...form, thumbnail_url: url});
                            }} />
                        )}
                        {form.thumbnail_url && (
                             <button onClick={(e) => { e.stopPropagation(); setForm({...form, thumbnail_url: ''}) }} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <X size={12}/>
                             </button>
                        )}
                    </div>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Asset Title</label>
                      <input 
                        type="text" required placeholder="Session Topic" 
                        value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                        className="w-full px-5 py-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Classification</label>
                      <select
                        value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                        className="w-full px-5 py-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none cursor-pointer"
                      >
                        <option value="Technical">Technical Deep-Dive</option>
                        <option value="Soft Skills">Professional Development</option>
                        <option value="Architecture">System Architecture</option>
                        <option value="Design">Visual Engineering</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Detailed Description</label>
                  <textarea 
                    placeholder="Provide context for the student..." rows={3}
                    value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full px-5 py-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none transition-all resize-none"
                  />
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
                   
                   <button 
                    type="submit" 
                    disabled={uploading}
                    className="px-10 py-3.5 bg-[var(--color-primary)] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                   >
                      {editingVideo ? 'Commit Changes' : 'Broadcast Content'}
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
