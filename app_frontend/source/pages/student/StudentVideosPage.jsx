import React, { useState, useEffect } from 'react';
import { 
  Play, Search, Filter, Loader2,
  Video, Clock, Calendar, 
  User, Bookmark, Share2,
  PlayCircle, Sparkles, TrendingUp
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentVideosPage() {
  const { t } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/videos');
      if (res.data.success) {
        setVideos(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load learning videos');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Technical', 'Soft Skills', 'Architecture', 'Product'];

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.teacher_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        {/* Hero Section */}
        <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md w-fit px-4 py-1.5 rounded-full border border-white/20">
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-widest">Premium Learning Modules</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-sora mb-4 leading-tight">Master New Skills with Video Training</h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Access the complete library of technical deep-dives and professional workshops curated by your teachers.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <Video size={18} />
                <span className="text-sm font-bold">{videos.length} High-Value Videos</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <TrendingUp size={18} />
                <span className="text-sm font-bold">New Content Weekly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-6 sticky top-0 z-20 bg-[var(--color-bg)]/80 backdrop-blur-xl py-4 border-b border-[var(--color-border)]">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by topic or teacher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none shadow-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat 
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20' 
                    : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
            <p className="text-[10px] font-black uppercase tracking-[3px] text-[var(--color-text-muted)]">Populating Learning Vault...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-24 text-center bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[40px]">
            <PlayCircle size={64} className="mx-auto mb-4 text-[var(--color-border)] opacity-30" />
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">No modules found</h3>
            <p className="text-[var(--color-text-muted)] mt-2 italic">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredVideos.map((video) => (
                <motion.div 
                  key={video.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedVideo(video)}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] overflow-hidden hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 cursor-pointer group"
                >
                  <div className="aspect-video bg-black relative overflow-hidden">
                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-900 to-purple-900">
                        <Video size={48} className="text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
                          <Play fill="white" className="text-white" size={24} />
                       </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        {video.category}
                      </span>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/10">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-[var(--color-text-primary)] font-sora text-lg mb-2 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">{video.title}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-6 h-8 leading-relaxed">{video.description}</p>
                    
                    <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
                             {video.teacher_photo ? (
                               <img src={video.teacher_photo} className="w-full h-full object-cover" />
                             ) : (
                               <User size={14} className="text-[var(--color-text-muted)]" />
                             )}
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Instructor</p>
                             <p className="text-xs font-bold text-[var(--color-text-primary)]">{video.teacher_name}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
                          <button className="p-2 hover:text-[var(--color-primary)] transition-colors"><Bookmark size={16} /></button>
                          <button className="p-2 hover:text-[var(--color-primary)] transition-colors"><Share2 size={16} /></button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Video Player Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-5xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] overflow-hidden shadow-2xl relative text-left"
              >
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-6 right-6 z-10 p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
                >
                  <X />
                </button>

                <div className="aspect-video bg-black flex items-center justify-center group relative cursor-pointer">
                  {/* Real video player would go here */}
                  <video 
                    controls 
                    className="w-full h-full"
                    poster={selectedVideo.thumbnail_url}
                  >
                    <source src={selectedVideo.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="p-8 md:p-12">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                         <h2 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] mb-2">{selectedVideo.title}</h2>
                         <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(selectedVideo.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5 font-bold text-[var(--color-primary)]">{selectedVideo.category}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 py-4 px-6 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl">
                         <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--color-primary)]/20 shadow-lg">
                            {selectedVideo.teacher_photo ? (
                              <img src={selectedVideo.teacher_photo} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white"><User size={20} /></div>
                            )}
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Content Curator</p>
                            <p className="text-sm font-bold text-[var(--color-text-primary)]">{selectedVideo.teacher_name}</p>
                         </div>
                      </div>
                   </div>
                   <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
                      <p className="text-[var(--color-text-muted)] leading-relaxed text-sm md:text-base">
                        {selectedVideo.description}
                      </p>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

function X() {
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
}
