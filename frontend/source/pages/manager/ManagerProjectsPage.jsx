import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Search, Filter, 
  UserPlus, CheckCircle2, Clock, 
  MoreVertical, Loader2, ArrowRight,
  BookOpen, Award, ExternalLink, 
  MessageSquare, History, CheckCircle
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManagerProjectsPage() {
  const { t } = useLanguage();
  const isDarkMode = useSelector((s) => s.ui.theme === 'dark');
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null); 
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'reviews'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, teamRes, reviewRes] = await Promise.all([
        api.get('/projects'),
        api.get('/manager/team'),
        api.get('/manager/reviews')
      ]);
      setProjects(projRes.data.data || []);
      setTeam(teamRes.data.data || []);
      setReviews(reviewRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load project synchronization data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (projectId, internId) => {
    try {
      await api.post('/manager/projects/assign', {
        internId,
        projectId
      });
      toast.success('Project assigned to intern');
      setAssigning(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to assign project');
    }
  };

  const handleReview = async (assignmentId, status, feedback) => {
    try {
      await api.patch(`/manager/reviews/${assignmentId}`, { status, feedback });
      toast.success(`Project ${status === 'completed' ? 'Approved' : 'Rejected'}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to process review');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-500" />
              </div>
              Project Matrix
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">Manage departmental curriculum and track performance lifecycles</p>
          </div>
          
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
            <button 
              onClick={() => setActiveTab('library')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'library' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
            >
              Matrix Library
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'reviews' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
            >
              Review Queue
              {reviews.length > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-[var(--color-surface)] animate-pulse" />}
            </button>
          </div>
        </div>

        {activeTab === 'library' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Catalog */}
            <div className="lg:col-span-8 space-y-6">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
                     <BookOpen size={16} /> Global Project Catalog
                  </h3>
                  <div className="relative w-full sm:w-auto">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                     <input 
                        className="pl-11 pr-4 py-2.5 rounded-xl text-xs bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none w-full sm:w-64 transition-all" 
                        placeholder="Search matrix catalog..." 
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loading ? (
                    <div className="col-span-full py-24 flex flex-col items-center gap-4">
                       <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] tracking-[0.2em]">Synchronizing matrix catalog...</p>
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="col-span-full py-24 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] opacity-40">
                       <Briefcase className="w-12 h-12 mx-auto mb-4" />
                       <p className="font-bold">No active projects available</p>
                    </div>
                  ) : projects.map(proj => (
                    <div key={proj.id} className="group p-8 rounded-[3rem] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50 transition-all duration-500 relative flex flex-col">
                       <div className="flex justify-between items-start mb-6">
                          <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                             {proj.difficulty_level}
                          </span>
                          <button 
                             onClick={() => setAssigning(assigning === proj.id ? null : proj.id)}
                             className={`p-3 rounded-2xl transition-all ${assigning === proj.id ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'}`}
                          >
                             <UserPlus size={18} />
                          </button>
                       </div>
                       
                       <h4 className="text-lg font-bold font-sora text-[var(--color-text-primary)] mb-3">{proj.title}</h4>
                       <p className="text-xs leading-relaxed text-[var(--color-text-muted)] mb-8 flex-1 line-clamp-3">{proj.description}</p>
                       
                       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mt-auto">
                          <div className="flex items-center gap-4 text-[var(--color-text-muted)]">
                             <span className="flex items-center gap-1.5"><Clock size={12} /> {proj.deadline ? 'Set' : 'No'} TTL</span>
                             <span className="flex items-center gap-1.5 text-emerald-500"><Award size={12} /> {proj.max_marks} XP</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
                             {proj.department_name || 'Organization'}
                          </span>
                       </div>

                       <AnimatePresence>
                          {assigning === proj.id && (
                             <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute inset-0 z-20 bg-[var(--color-surface)]/98 backdrop-blur-md rounded-[3rem] p-8 flex flex-col"
                             >
                                <div className="flex justify-between items-center mb-6">
                                   <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">Select Recipient</h5>
                                   <button onClick={() => setAssigning(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">âœ•</button>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                   {team.map(intern => (
                                      <button 
                                         key={intern.id}
                                         onClick={() => handleAssign(proj.id, intern.id)}
                                         className="w-full flex items-center justify-between p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]/50 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all text-left group/intern shadow-sm"
                                      >
                                         <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)] group-hover/intern:bg-white/20 group-hover/intern:text-white">
                                               {intern.full_name?.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold">{intern.full_name}</span>
                                         </div>
                                         <ArrowRight size={14} className="text-[var(--color-primary)] group-hover/intern:text-white group-hover/intern:translate-x-1 transition-all" />
                                      </button>
                                   ))}
                                </div>
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                  ))}
               </div>
            </div>

            {/* Activities Sidebar */}
            <div className="lg:col-span-4 space-y-8">
               <div className="p-8 rounded-[3rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-[0.2rem] mb-8 text-[var(--color-text-muted)]">Matrix Feed</h3>
                  <div className="space-y-8">
                     <div className="flex gap-5 relative">
                        <div className="absolute left-[15px] top-10 bottom-[-30px] w-[2px] bg-[var(--color-border)]/50 border-dashed border-l" />
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                           <CheckCircle2 size={16} className="text-emerald-500" />
                        </div>
                        <div>
                           <p className="text-[11px] font-black uppercase tracking-widest text-[var(--color-text-primary)]">System Matrix Ready</p>
                           <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">Global curriculum assignments and reviews are actively monitored.</p>
                        </div>
                     </div>
                     <div className="flex gap-5 opacity-40">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center shrink-0 border border-[var(--color-border)]">
                           <History size={16} className="text-[var(--color-text-muted)]" />
                        </div>
                        <div>
                           <p className="text-[11px] font-black uppercase tracking-widest text-[var(--color-text-primary)]">Audit Logs In Queue</p>
                           <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">Individual activity trails will stream here in the next update.</p>
                        </div>
                     </div>
                  </div>
                  <button className="w-full mt-12 py-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 transition-all">
                     View Complete Matrix Audit
                  </button>
               </div>

               <div className="p-10 rounded-[3rem] bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 shadow-xl relative overflow-hidden group">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-50 group-hover:bg-blue-500/20 transition-all" />
                  <h4 className="text-lg font-bold text-blue-500 font-sora mb-2">Matrix Insights</h4>
                  <p className="text-[10px] font-bold text-[var(--color-text-muted)] leading-relaxed mb-6 uppercase tracking-widest opacity-80">Strategic Allocation Tip</p>
                  <p className="text-xs text-[var(--color-text-secondary)] italic leading-relaxed">
                     "Allocating projects targeting core skill gaps accelerates team proficiency by up to 40% per quarter."
                  </p>
               </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-8">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-[var(--color-text-muted)]">
                <CheckCircle size={18} className="text-[var(--color-primary)]" /> Global Queue — {reviews.length} Submissions
             </h3>
             
             {reviews.length === 0 ? (
               <div className="py-24 text-center rounded-[3rem] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)]">
                  <CheckCircle size={60} strokeWidth={1} className="mx-auto mb-6 text-emerald-500 opacity-20" />
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Review Queue Clear</h3>
                  <p className="text-[var(--color-text-muted)] mt-2">All submitted projects have been processed.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 gap-8">
                  {reviews.map(rev => (
                    <div key={rev.assignment_id} className="group p-1 rounded-[3rem] bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent hover:from-[var(--color-primary)]/40 hover:scale-[1.01] transition-all duration-500 shadow-xl">
                      <div className="p-10 rounded-[2.8rem] bg-[var(--color-surface)] flex flex-col gap-10 shadow-inner">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                           <div className="flex items-center gap-6">
                              <div className="w-20 h-20 rounded-[2rem] bg-[var(--color-surface-2)] flex items-center justify-center border border-[var(--color-border)] shadow-xl relative group-hover:scale-105 transition-transform">
                                 <span className="text-3xl font-black text-[var(--color-primary)]">{rev.intern_name?.charAt(0)}</span>
                              </div>
                              <div>
                                 <h4 className="text-2xl font-bold font-sora text-[var(--color-text-primary)] mb-2">{rev.project_title}</h4>
                                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                                    Submitted by <span className="text-[var(--color-text-primary)]">{rev.intern_name}</span>
                                 </p>
                              </div>
                           </div>

                           <div className="flex items-center gap-4">
                              <a 
                                href={rev.submission_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/30 active:scale-95"
                              >
                                 <ExternalLink size={16} /> View External Artifact
                              </a>
                              <button className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 transition-all">
                                <MessageSquare size={20} />
                              </button>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                           <div className="lg:col-span-3 space-y-4">
                              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] flex items-center gap-2">
                                 <BookOpen size={14} /> Submission Footnotes
                              </h5>
                              <div className="p-8 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 backdrop-blur-xl">
                                 <p className="text-sm leading-relaxed italic text-[var(--color-text-secondary)]">"{rev.submission_notes || 'No footnotes provided with this submission.'}"</p>
                              </div>
                           </div>
                           
                           <div className="lg:col-span-2 space-y-4">
                              <h5 className="text-[10px] font-black uppercase tracking-[0.2rem] text-[var(--color-text-muted)]">Audit Decision</h5>
                              <div className="flex flex-col gap-3">
                                 <button 
                                    onClick={() => handleReview(rev.assignment_id, 'completed', 'Standard approval for matrix project.')}
                                    className="w-full py-5 rounded-2xl bg-emerald-500 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                                 >
                                    Approve & Grant XP
                                 </button>
                                 <button 
                                    onClick={() => handleReview(rev.assignment_id, 'todo', 'Revision requested by department lead.')}
                                    className="w-full py-5 rounded-2xl bg-[var(--color-surface-2)] border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                 >
                                    Request Matrix Revision
                                 </button>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
             )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
