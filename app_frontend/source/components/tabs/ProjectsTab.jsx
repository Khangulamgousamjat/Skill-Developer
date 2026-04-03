import React from 'react';
import { Bot, MessageSquareQuote } from 'lucide-react';
import { GlareHover } from '../ui/GlareHover';
import { useAppContext } from '../../context/AppContext';
import { activeProjects } from '../../data/mockData';

export const ProjectsTab = () => {
  const { 
    isDarkMode, t, appSettings, 
    projectPlans, handleProjectBreakdown,
    approachInputs, setApproachInputs,
    approachReviews, handleApproachReview 
  } = useAppContext();

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${t.textMain}`}>Real-World Projects</h2>
      <p className={t.textMuted}>Apply your skills to actual company-like scenarios.</p>

      <div className={`grid grid-cols-1 ${appSettings.compactView ? 'gap-3' : 'gap-4'}`}>
        {activeProjects.map(project => (
          <GlareHover
            key={project.id}
            glareColor={isDarkMode ? "#ffffff" : "#3f37b3"}
            glareOpacity={0.15}
            className={`${t.card} p-6`}
          >
            <div className="relative z-10 w-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`font-bold text-lg ${t.textMain}`}>{project.title}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                    project.status === 'In Progress' 
                      ? (isDarkMode ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100 text-blue-800')
                      : (isDarkMode ? 'bg-[var(--color-surface)]/10 text-slate-300 border border-white/20' : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)]')
                  }`}>
                    {project.status}
                  </span>
                </div>
                <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative z-20 ${isDarkMode ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
                  View Details
                </button>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className={t.textMuted}>Project Progress</span>
                  <span className={`font-medium ${t.textMain}`}>{project.progress}%</span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              {/* AI Project Breakdown Section */}
              <div className={`mt-5 pt-4 border-t ${t.borderSoft}`}>
                {!projectPlans[project.id] ? (
                  <button 
                    onClick={() => handleProjectBreakdown(project)}
                    className={`flex items-center text-sm font-medium transition-colors mb-3 relative z-20 ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
                  >
                    ✨ Ask AI Mentor to break down this project
                  </button>
                ) : (
                  <div className={`mt-3 mb-4 p-4 rounded-lg shadow-sm border ${isDarkMode ? 'bg-indigo-900/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                    <div className={`flex items-center mb-2 font-semibold text-sm ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                      <Bot className="w-4 h-4 mr-2" />
                      AI Project Breakdown
                    </div>
                    {projectPlans[project.id].loading ? (
                      <div className={`text-sm animate-pulse flex items-center ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>
                        Consulting your AI Mentor...
                      </div>
                    ) : (
                      <div className={`text-sm whitespace-pre-wrap leading-relaxed ${isDarkMode ? 'text-indigo-50' : 'text-[var(--color-text-secondary)]'}`}>
                        {projectPlans[project.id].text}
                      </div>
                    )}
                  </div>
                )}

                {/* AI Approach Reviewer */}
                <div className={`p-4 rounded-lg border w-full ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`flex items-center mb-2 font-semibold text-sm ${t.textMain}`}>
                    <MessageSquareQuote className={`w-4 h-4 mr-2 ${t.textMuted}`} />
                    Get AI Feedback on Your Approach
                  </div>
                  <textarea
                    value={approachInputs[project.id] || ''}
                    onChange={(e) => setApproachInputs(prev => ({ ...prev, [project.id]: e.target.value }))}
                    placeholder="Briefly describe how you plan to solve this... (e.g. 'I will use Context API for state...')"
                    className={`w-full p-3 text-sm rounded-lg border focus:ring-2 focus:ring-slate-400 focus:outline-none mb-2 relative z-20 ${t.input}`}
                    rows="2"
                  />
                  <button
                    onClick={() => handleApproachReview(project)}
                    disabled={!approachInputs[project.id] || approachReviews[project.id]?.loading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center relative z-20 ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
                  >
                    {approachReviews[project.id]?.loading ? 'Reviewing...' : '✨ Submit Approach for AI Review'}
                  </button>

                  {approachReviews[project.id] && !approachReviews[project.id].loading && (
                    <div className={`mt-3 pt-3 border-t text-sm whitespace-pre-wrap leading-relaxed ${isDarkMode ? 'border-white/10 text-slate-300' : 'border-slate-200 text-[var(--color-text-secondary)]'}`}>
                      {approachReviews[project.id].text}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlareHover>
        ))}
      </div>
    </div>
  );
};

