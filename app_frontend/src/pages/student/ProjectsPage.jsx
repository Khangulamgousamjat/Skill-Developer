import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
  Briefcase, ChevronRight, Loader2,
  Code2, ClipboardCheck, Lightbulb, CheckCircle2, Clock,
  ExternalLink, Send, MessageSquare, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const STATUS_CONFIG = {
  'todo':           { label: 'To Do',          color: 'bg-slate-500',  light: 'bg-slate-50  text-slate-700  border-slate-200',  dark: 'bg-slate-500/10 text-slate-300 border-slate-500/20',  icon: ClipboardCheck },
  'in_progress':    { label: 'In Progress',    color: 'bg-amber-500',  light: 'bg-amber-50  text-amber-700  border-amber-200',  dark: 'bg-amber-500/10 text-amber-300 border-amber-500/20',  icon: Code2 },
  'under_review':   { label: 'Under Review',   color: 'bg-blue-500',   light: 'bg-blue-50   text-blue-700   border-blue-200',   dark: 'bg-blue-500/10  text-blue-300  border-blue-500/20',   icon: Lightbulb },
  'completed':      { label: 'Completed',      color: 'bg-emerald-500',light: 'bg-emerald-50 text-emerald-700 border-emerald-200', dark: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', icon: CheckCircle2 },
};

const COLUMNS = ['todo', 'in_progress', 'under_review', 'completed'];

// ─── Single Project Card ──────────────────────────────────────────
const ProjectCard = ({ project, t, isDarkMode, onRefresh }) => {
  const { projectPlans, handleProjectBreakdown, approachInputs, setApproachInputs, approachReviews, handleApproachReview, projectBoilerplate, handleGenerateBoilerplate } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitData, setSubmitData] = useState({ url: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const plan = projectPlans[project.project_id];
  const review = approachReviews[project.project_id];
  const boilerplate = projectBoilerplate[project.project_id];
  const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG['todo'];
  const StatusIcon = cfg.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitData.url) return toast.error('Submission URL is required');
    try {
      setSubmitting(true);
      await api.patch(`/student/projects/${project.assignment_id}/submit`, submitData);
      toast.success('Project submitted for review! +100 XP');
      setShowSubmitModal(false);
      onRefresh();
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`rounded-2xl glare-hover transition-all group border ${t.borderSoft} ${t.card}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border ${isDarkMode ? cfg.dark : cfg.light}`}>
            <StatusIcon className="w-3 h-3" />
            {cfg.label}
          </span>
          <div className={`w-2 h-2 rounded-full ${cfg.color} shadow-lg`} />
        </div>

        <h3 className={`font-bold text-sm leading-snug mb-2 font-sora ${t.textMain}`}>{project.title}</h3>

        <div className="flex items-center justify-between mt-4">
           {project.deadline && (
               <div className={`flex items-center gap-1.5 text-[10px] font-bold ${t.textMuted}`}>
                   <Clock className="w-3.5 h-3.5 text-amber-500" />
                   {new Date(project.deadline).toLocaleDateString()}
               </div>
           )}
           <div className={`text-[10px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Lvl {project.difficulty_level || 'Mid'}
           </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-5">
           <button
             onClick={() => setExpanded(v => !v)}
             className={`flex-1 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-xl border transition-all ${isDarkMode ? 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10' : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
           >
             AI Tools
             <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
           </button>
           
           {project.status !== 'completed' && project.status !== 'under_review' && (
              <button 
                onClick={() => setShowSubmitModal(true)}
                className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-xl bg-amber-500 text-slate-900 border border-amber-500/30 hover:bg-amber-400 transition-all font-bold"
              >
                Submit <Send className="w-3 h-3" />
              </button>
           )}
        </div>
      </div>

      {/* Expanded AI Tools */}
      {expanded && (
        <div className={`px-4 pb-4 border-t space-y-3 p-4 bg-black/10 shadow-inner ${t.border}`}>
          {/* Plan Breakdown */}
          <button
            onClick={() => handleProjectBreakdown({ id: project.project_id, title: project.title })}
            disabled={plan?.loading}
            className="mt-3 w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest py-2.5 px-3 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
          >
            {plan?.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lightbulb className="w-3 h-3 text-indigo-400" />}
            {plan ? 'Refresh Brainstorm' : 'AI Step-by-Step Plan'}
          </button>
          
          {plan && !plan.loading && (
            <div className={`text-[11px] rounded-xl p-4 leading-relaxed whitespace-pre-line border shadow-sm ${isDarkMode ? 'bg-indigo-900/10 text-indigo-100 border-indigo-500/10' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
              <div className="flex items-center gap-2 mb-2 font-black uppercase tracking-widest opacity-60">
                 <Loader2 className="w-3 h-3" /> Logic Plan
              </div>
              {plan.text}
            </div>
          )}

          {/* Boilerplate */}
          <button
            onClick={() => handleGenerateBoilerplate({ id: project.project_id, title: project.title })}
            disabled={boilerplate?.loading}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest py-2.5 px-3 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
          >
            {boilerplate?.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Code2 className="w-3 h-3 text-emerald-400" />}
            Generate Boilerplate
          </button>
          {boilerplate && !boilerplate.loading && (
            <div className="relative group/code">
               <pre className={`text-[10px] font-mono p-4 rounded-xl overflow-x-auto border ${isDarkMode ? 'bg-black/40 text-emerald-300 border-emerald-500/10' : 'bg-green-50 text-green-800 border-green-100'}`}>
                {boilerplate.text}
               </pre>
               <button className="absolute top-2 right-2 p-1.5 rounded-lg bg-emerald-500 text-white opacity-0 group-hover/code:opacity-100 transition-opacity" onClick={() => { navigator.clipboard.writeText(boilerplate.text); toast.success('Code copied!'); }}>
                  <ClipboardCheck className="w-3 h-3" />
               </button>
            </div>
          )}
        </div>
      )}

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className={`${t.card} w-full max-w-md rounded-[40px] border ${t.borderSoft} p-10 shadow-2xl`}>
              <div className="flex justify-between items-center mb-6">
                 <h3 className={`text-xl font-bold font-sora ${t.textMain}`}>Submit Solution</h3>
                 <button onClick={() => setShowSubmitModal(false)} className="text-slate-500">✕</button>
              </div>
              <p className={`text-xs ${t.textMuted} mb-6`}>Submit your repository or deployment link for manager review.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Submission URL</label>
                    <input 
                      type="url" required placeholder="https://github.com/..." 
                      value={submitData.url} onChange={e => setSubmitData({ ...submitData, url: e.target.value })}
                      className={`w-full px-5 py-3 rounded-2xl bg-white/5 border ${t.borderSoft} text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all`}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Notes for Reviewer</label>
                    <textarea 
                      rows="3" placeholder="Tell your manager about your approach..." 
                      value={submitData.notes} onChange={e => setSubmitData({ ...submitData, notes: e.target.value })}
                      className={`w-full px-5 py-3 rounded-2xl bg-white/5 border ${t.borderSoft} text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none`}
                    />
                 </div>
                 <button disabled={submitting} type="submit" className="w-full py-4 rounded-2xl bg-amber-500 text-slate-900 font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy to Review →"}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const ProjectsPage = () => {
  const { t, isDarkMode, studentProjects, isDataLoading, fetchStudentDashboardData } = useAppContext();

  const getProjectsByStatus = (status) =>
    studentProjects.filter(p => p.status === status);

  if (isDataLoading && studentProjects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className={`mt-4 ${t.textMuted}`}>Synchronizing your project matrix...</p>
        </div>
      );
    }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold font-sora flex items-center gap-3 ${t.textMain}`}>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-amber-500" />
            </div>
            Mission Matrix
          </h2>
          <p className={t.textMuted}>Assigned real-world projects with AI-powered task assistance.</p>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {COLUMNS.map(status => {
          const projects = getProjectsByStatus(status);
          const cfg = STATUS_CONFIG[status];
          const ColIcon = cfg.icon;
          return (
            <div key={status} className={`rounded-[32px] p-6 min-h-[500px] flex flex-col ${isDarkMode ? 'bg-white/[0.02] border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${cfg.color} shadow-[0_0_8px_rgba(245,158,11,0.5)]`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted}`}>{cfg.label}</span>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${isDarkMode ? 'bg-white/10 text-slate-400' : 'bg-gray-200 text-gray-500'}`}>
                  {projects.length}
                </span>
              </div>
              <div className="space-y-4 flex-1">
                {projects.length > 0
                  ? projects.map(p => <ProjectCard key={p.assignment_id} project={p} t={t} isDarkMode={isDarkMode} onRefresh={fetchStudentDashboardData} />)
                  : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-20 grayscale">
                        <StatusIcon className="w-12 h-12 mb-3" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Zone Empty</p>
                    </div>
                  )
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsPage;
