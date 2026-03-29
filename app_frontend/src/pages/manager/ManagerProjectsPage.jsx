import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Briefcase, Plus, Search, Filter, 
  UserPlus, CheckCircle2, Circle, Clock,
  MoreVertical, Loader2, ArrowRight,
  Target, Award, BookOpen, AlertCircle,
  ExternalLink, MessageSquare, History
} from 'lucide-react';

export const ManagerProjectsPage = () => {
  const { t, isDarkMode } = useAppContext();
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
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (projectId, internId) => {
    try {
      await api.post('/manager/projects/assign', {
        project_id: projectId,
        intern_id: internId
      });
      toast.success('Project assigned successfully');
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
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold font-sora flex items-center gap-3 ${t.textMain}`}>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-500" />
            </div>
            Project Matrix
          </h2>
          <p className={`text-sm ${t.textMuted} mt-1`}>Manage the global curriculum and track intern project lifecycles.</p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/5">
          <button 
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'library' ? 'bg-amber-500 text-slate-900 shadow-lg' : `${t.textMuted} hover:text-white`}`}
          >
            Library
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'reviews' ? 'bg-amber-500 text-slate-900 shadow-lg' : `${t.textMuted} hover:text-white`}`}
          >
            Reviews
            {reviews.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />}
          </button>
        </div>
      </div>

      {activeTab === 'library' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Project Catalog (Library) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${t.textMuted}`}>
                <BookOpen className="w-4 h-4" /> Global Curriculum List
              </h3>
              <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input className={`pl-9 pr-4 py-1.5 rounded-xl text-xs bg-white/5 border ${t.borderSoft} focus:ring-1 focus:ring-amber-500/50 outline-none w-48`} placeholder="Find project..." />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-full py-20 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                  <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted}`}>Syncing catalog...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="col-span-full py-20 text-center opacity-30">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-bold">No projects found</p>
                </div>
              ) : projects.map(proj => (
                <div key={proj.id} className={`p-6 rounded-[32px] border group relative ${t.card} ${t.hover} transition-all`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-white/5 border ${t.borderSoft} ${t.textMuted}`}>
                      {proj.difficulty_level}
                    </span>
                    <button 
                      onClick={() => setAssigning(assigning === proj.id ? null : proj.id)}
                      className={`p-2 rounded-xl transition-all ${assigning === proj.id ? 'bg-amber-500 text-slate-900' : 'bg-white/5 text-slate-400 hover:text-amber-500'}`}
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className={`text-sm font-bold mb-2 truncate ${t.textMain}`}>{proj.title}</h4>
                  <p className={`text-[10px] leading-relaxed mb-6 line-clamp-2 ${t.textMuted}`}>{proj.description}</p>
                  
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-tighter">
                    <div className="flex items-center gap-3 text-slate-500">
                       <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {proj.deadline ? 'Set' : 'No'} Date</span>
                       <span className="flex items-center gap-1 text-emerald-500"><Award className="w-3 h-3" /> {proj.max_marks} XP</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                      {proj.department_name || 'General'}
                    </span>
                  </div>

                  {assigning === proj.id && (
                    <div className="absolute inset-0 z-10 bg-slate-900/95 backdrop-blur-md rounded-[32px] p-6 animate-fade-in flex flex-col">
                       <div className="flex justify-between items-center mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Assign to Intern</h5>
                          <button onClick={() => setAssigning(null)} className="text-slate-400 hover:text-white">✕</button>
                       </div>
                       <div className="flex-1 overflow-auto space-y-1.5 custom-scrollbar pr-1">
                          {team.map(intern => (
                             <button 
                                key={intern.id}
                                onClick={() => handleAssign(proj.id, intern.id)}
                                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left"
                             >
                                <div className="flex items-center gap-2.5">
                                   <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center text-[10px] font-bold text-slate-900">
                                      {intern.full_name.charAt(0)}
                                   </div>
                                   <span className="text-[11px] font-bold text-slate-200">{intern.full_name}</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                             </button>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats / Recent Activity */}
          <div className="lg:col-span-4 space-y-6">
             <div className={`p-8 rounded-[40px] border ${t.borderSoft} ${t.card}`}>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-6 ${t.textMuted}`}>Live Tracking Feed</h3>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                         <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                         <p className={`text-[11px] font-bold ${t.textMain}`}>Internal System Ready</p>
                         <p className={`text-[10px] ${t.textMuted} mt-0.5`}>Project assignment logic verified and live.</p>
                      </div>
                   </div>
                   <div className="flex gap-4 opacity-50">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                         <History className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                         <p className={`text-[11px] font-bold ${t.textMain}`}>Activity Logs Coming</p>
                         <p className={`text-[10px] ${t.textMuted} mt-0.5`}>Individual intern events will appear here.</p>
                      </div>
                   </div>
                </div>
                <button className="w-full mt-10 py-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                  View Assignment Logs
                </button>
             </div>

             <div className="p-8 rounded-[40px] shadow-sm bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                <h4 className="text-sm font-bold text-amber-500 mb-1">Matrix Helper</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-4">Quickly fill skill gaps by assigning relevant projects from the curriculum library.</p>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                   <p className="text-[9px] font-bold text-slate-300 italic">"Managers who assign projects tailored to skill gaps increase team velocity by 40%."</p>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
           <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${t.textMuted}`}>
              <AlertCircle className="w-4 h-4" /> Pending Submissions ({reviews.length})
           </h3>
           
           <div className="grid grid-cols-1 gap-4">
              {reviews.length === 0 ? (
                <div className={`p-20 text-center rounded-[40px] border border-dashed border-white/10 ${t.card}`}>
                   <p className={t.textMuted}>Excellent! No pending reviews at the moment.</p>
                </div>
              ) : reviews.map(rev => (
                <div key={rev.assignment_id} className={`p-1 shadow-2xl rounded-[32px] bg-gradient-to-br from-amber-500/20 to-transparent`}>
                  <div className={`p-8 rounded-[31px] ${t.card}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                             <span className="text-2xl font-black text-amber-500">{rev.intern_name.charAt(0)}</span>
                          </div>
                          <div>
                             <h4 className={`text-lg font-bold font-sora ${t.textMain}`}>{rev.project_title}</h4>
                             <p className={`text-[11px] font-bold uppercase tracking-widest text-slate-500 mt-1`}>Submitted by <span className="text-amber-500">{rev.intern_name}</span></p>
                          </div>
                       </div>

                       <div className="flex items-center gap-3">
                          <a 
                            href={rev.submission_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                          >
                             <ExternalLink className="w-3.5 h-3.5" /> View Solution
                          </a>
                          <button className={`p-2 rounded-xl bg-white/5 border border-white/10 ${t.textMuted}`}>
                            <MessageSquare className="w-4 h-4" />
                          </button>
                       </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                             <BookOpen className="w-3 h-3" /> Intern's Notes
                          </h5>
                          <div className={`p-5 rounded-2xl border ${t.borderSoft} bg-black/20`}>
                             <p className="text-xs leading-relaxed italic text-slate-300">"{rev.submission_notes || 'No notes provided.'}"</p>
                          </div>
                       </div>
                       
                       <div className="space-y-3">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Evaluation Decision</h5>
                          <div className="flex gap-2">
                             <button 
                                onClick={() => handleReview(rev.assignment_id, 'completed', 'Great job.')}
                                className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
                             >
                                Approve & Grant XP
                             </button>
                             <button 
                                onClick={() => handleReview(rev.assignment_id, 'todo', 'Please revise.')}
                                className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:text-red-400 hover:border-red-500/30 transition-all"
                             >
                                Request Changes
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default ManagerProjectsPage;
