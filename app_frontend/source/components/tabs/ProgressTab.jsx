import React from 'react';
import { Award, CheckCircle, FileCheck, Mail } from 'lucide-react';
import { GlareHover } from '../ui/GlareHover';
import { useAppContext } from '../../context/AppContext';

export const ProgressTab = () => {
  const { 
    isDarkMode, t, appSettings, 
    setCertificateModal, 
    progressSummary, handleProgressSummary,
    handleDraftProgressEmail
  } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${t.textMain}`}>Progress Tracking & Evaluation</h2>
          <p className={t.textMuted}>Track attendance, project performance, and completed skills.</p>
        </div>
        <button 
          onClick={() => setCertificateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center"
        >
          <Award className="w-4 h-4 mr-2" />
          Generate Certificate
        </button>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-3 ${appSettings.compactView ? 'gap-3' : 'gap-6'}`}>
        <GlareHover glareColor={isDarkMode ? "#ffffff" : "#3f37b3"} glareOpacity={0.15} className={`${t.card} p-6`}>
          <div className="relative z-10 w-full">
            <div className={`text-sm mb-1 ${t.textMuted}`}>Lecture Attendance</div>
            <div className={`text-3xl font-bold ${t.textMain}`}>85%</div>
            <div className={`mt-2 w-full rounded-full h-1.5 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}><div className="bg-blue-500 h-1.5 rounded-full w-[85%]"></div></div>
          </div>
        </GlareHover>
        <GlareHover glareColor={isDarkMode ? "#ffffff" : "#3f37b3"} glareOpacity={0.15} className={`${t.card} p-6`}>
          <div className="relative z-10 w-full">
            <div className={`text-sm mb-1 ${t.textMuted}`}>Project Performance</div>
            <div className={`text-3xl font-bold ${t.textMain}`}>92%</div>
            <div className={`mt-2 w-full rounded-full h-1.5 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}><div className="bg-emerald-500 h-1.5 rounded-full w-[92%]"></div></div>
          </div>
        </GlareHover>
        <GlareHover glareColor={isDarkMode ? "#ffffff" : "#3f37b3"} glareOpacity={0.15} className={`${t.card} p-6`}>
          <div className="relative z-10 w-full">
            <div className={`text-sm mb-1 ${t.textMuted}`}>Skill Completion</div>
            <div className={`text-3xl font-bold ${t.textMain}`}>65%</div>
            <div className={`mt-2 w-full rounded-full h-1.5 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}><div className="bg-purple-500 h-1.5 rounded-full w-[65%]"></div></div>
          </div>
        </GlareHover>
      </div>

      {/* Manager Evaluation Report */}
      <GlareHover glareColor={isDarkMode ? "#ffffff" : "#3f37b3"} glareOpacity={0.15} className={`${t.card} p-6`}>
        <div className="relative z-10 w-full">
          <h3 className={`font-bold text-lg mb-4 flex items-center ${t.textMain}`}>
            <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
            Manager Performance Report
          </h3>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-[var(--color-surface-2)] border-[var(--color-border)]'}`}>
              <div className="flex justify-between items-center mb-2">
                <div className={`font-semibold text-sm ${t.textMain}`}>Build inventory system module</div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${isDarkMode ? 'text-emerald-300 bg-emerald-500/20' : 'text-emerald-700 bg-emerald-100'}`}>Grade: A</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-[var(--color-text-secondary)]'}`}>Alex showed great initiative here. Code quality is improving rapidly. Needs a bit more focus on edge-case testing, but overall excellent progress during this sprint.</p>
            </div>

            {/* AI Self-Evaluation Summary */}
            <div className={`pt-4 border-t ${t.borderSoft}`}>
              {!progressSummary.text && !progressSummary.loading ? (
                <button 
                  onClick={handleProgressSummary}
                  className={`flex items-center text-sm font-medium transition-colors relative z-20 ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
                >
                  ✨ Generate AI Performance Summary based on current stats
                </button>
              ) : (
                <div className={`p-5 rounded-lg shadow-sm border ${isDarkMode ? 'bg-indigo-900/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                  <div className={`flex items-center mb-3 font-bold text-sm ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                    <FileCheck className="w-5 h-5 mr-2" />
                    AI-Generated Performance Review
                  </div>
                  {progressSummary.loading ? (
                    <div className="flex space-x-2 py-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  ) : (
                    <div className={`text-sm whitespace-pre-wrap leading-relaxed italic ${isDarkMode ? 'text-indigo-100' : 'text-[var(--color-text-secondary)]'}`}>
                      "{progressSummary.text}"
                    </div>
                  )}
                </div>
              )}
              
              <button 
                onClick={handleDraftProgressEmail}
                className={`mt-4 w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm relative z-20 ${isDarkMode ? 'bg-[var(--color-surface)] text-slate-900 hover:bg-slate-200' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
              >
                <Mail className="w-4 h-4 mr-2" />
                ✨ Draft Progress Update Email to Manager
              </button>
            </div>
          </div>
        </div>
      </GlareHover>
    </div>
  );
};

