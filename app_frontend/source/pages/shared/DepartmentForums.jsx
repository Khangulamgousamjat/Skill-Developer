import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { MessageSquare, Plus, User, Clock, ChevronRight, Loader2, Send, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function DepartmentForums() {
  const { t } = useLanguage();
  const { user } = useSelector((s) => s.auth);
  
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cmmtLoading, setCmmtLoading] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.department_id) {
      fetchPosts();
    }
  }, [user]);

  useEffect(() => {
    if (selectedPost) {
      fetchComments(selectedPost.id);
    }
  }, [selectedPost]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/forums/${user.department_id}`);
      setPosts(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load forum posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    setCmmtLoading(true);
    try {
      const res = await axiosInstance.get(`/forums/post/${postId}/comments`);
      setComments(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCmmtLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/forums', {
        ...newPost,
        department_id: user.department_id
      });
      toast.success('Post created!');
      setShowModal(false);
      setNewPost({ title: '', content: '' });
      fetchPosts();
    } catch (err) {
      toast.error('Failed to create post');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axiosInstance.post(`/forums/post/${selectedPost.id}/comment`, {
        content: newComment
      });
      setComments([...comments, { ...res.data.data, full_name: user.full_name, profile_photo_url: user.profile_photo_url }]);
      setNewComment('');
      fetchPosts(); // For comment count update
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-3xl shadow-sm">
           <div>
             <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{t('forum')}</h1>
             <p className="text-[var(--color-text-muted)] mt-1 flex items-center gap-2">
               <MessageSquare size={16} className="text-[var(--color-primary)]" />
               {user?.department_name} Discussions
             </p>
           </div>
           <button 
             onClick={() => setShowModal(true)}
             className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
           >
             <Plus size={20} /> {t('postDiscussion')}
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Discussion List */}
           <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20 bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-3xl text-[var(--color-text-muted)] italic">
                   No discussions found in this department.
                </div>
              ) : (
                posts.map(post => (
                  <motion.div 
                    layoutId={post.id}
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={`bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-3xl hover:border-[var(--color-primary)] transition-all cursor-pointer group ${selectedPost?.id === post.id ? 'border-[var(--color-primary)] shadow-lg shadow-blue-500/5' : 'shadow-sm'}`}
                  >
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                           {post.profile_photo_url ? <img src={post.profile_photo_url} className="w-full h-full object-cover rounded-xl" /> : <User className="text-[var(--color-text-muted)]" />}
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between">
                              <h3 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{post.title}</h3>
                              <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold flex items-center gap-1"><Clock size={12}/> {format(new Date(post.created_at), 'MMM d')}</span>
                           </div>
                           <p className="text-sm text-[var(--color-text-secondary)] mt-2 line-clamp-2 leading-relaxed">{post.content}</p>
                           <div className="flex items-center gap-4 mt-4">
                              <span className="text-[10px] bg-[var(--color-surface-2)] text-[var(--color-text-muted)] px-2 py-1 rounded-lg font-bold uppercase tracking-wider">{post.full_name}</span>
                              <div className="flex items-center gap-1.5 text-[var(--color-accent)] font-bold text-[10px]">
                                 <MessageCircle size={14} /> {post.comment_count} {t('addComment')}
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                ))
              )}
           </div>

           {/* Thread Detail / Sidebar */}
           <div className="relative">
              <AnimatePresence mode='wait'>
                {selectedPost ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-xl sticky top-6"
                  >
                     <div className="p-6 border-b border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-4">
                           <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-[var(--color-surface-2)] rounded-xl text-[var(--color-text-muted)] transition-all">
                              <ArrowLeft size={18} />
                           </button>
                        </div>
                        <h2 className="text-lg font-bold font-sora text-[var(--color-text-primary)] leading-tight">{selectedPost.title}</h2>
                     </div>

                     <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-6 space-y-6 bg-[var(--color-surface-2)]/30">
                        {cmmtLoading ? (
                          <div className="flex justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>
                        ) : comments.map(c => (
                          <div key={c.id} className="flex gap-3">
                             <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                                {c.profile_photo_url ? <img src={c.profile_photo_url} className="w-full h-full object-cover rounded-lg" /> : <User size={14} className="text-[var(--color-text-muted)]" />}
                             </div>
                             <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                   <span className="text-[10px] font-bold text-[var(--color-text-primary)]">{c.full_name}</span>
                                   <span className="text-[8px] text-[var(--color-text-muted)] uppercase">{format(new Date(c.created_at), 'HH:mm')}</span>
                                </div>
                                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed bg-[var(--color-surface)] p-3 rounded-2xl rounded-tl-none border border-[var(--color-border)]">
                                   {c.content}
                                </p>
                             </div>
                          </div>
                        ))}
                     </div>

                     <form onSubmit={handleAddComment} className="p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
                        <div className="relative">
                           <input 
                             type="text" 
                             value={newComment}
                             onChange={(e) => setNewComment(e.target.value)}
                             placeholder="Write a reply..."
                             className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] pl-4 pr-12 py-3 rounded-2xl text-xs focus:border-[var(--color-primary)] outline-none transition-all"
                           />
                           <button 
                             disabled={!newComment.trim()}
                             className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--color-primary)] disabled:opacity-30"
                           >
                             <Send size={16} />
                           </button>
                        </div>
                     </form>
                  </motion.div>
                ) : (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] border-dashed rounded-3xl p-12 text-center text-[var(--color-text-muted)] flex flex-col items-center gap-4">
                     <MessageSquare size={48} className="opacity-20" />
                     <p className="text-sm italic">Select a discussion to see details and replies.</p>
                  </div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowModal(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="relative bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-lg rounded-3xl p-8 shadow-2xl"
             >
                <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-6">{t('postDiscussion')}</h2>
                <form onSubmit={handleCreatePost} className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Title</label>
                      <input 
                        required
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-4 rounded-xl text-sm focus:border-[var(--color-primary)] outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Content</label>
                      <textarea 
                        required
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] p-4 rounded-xl text-sm h-40 resize-none focus:border-[var(--color-primary)] outline-none"
                      />
                   </div>
                   <div className="flex gap-4">
                      <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-[var(--color-border)] rounded-xl font-bold text-[var(--color-text-muted)]">Cancel</button>
                      <button type="submit" className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold">Publish Post</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

const ArrowLeft = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

