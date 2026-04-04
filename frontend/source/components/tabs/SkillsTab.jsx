import React from 'react';
import { CheckCircle, AlertCircle, HelpCircle, Send } from 'lucide-react';
import { GlareHover } from '../ui/GlareHover';
import { useAppContext } from '../../context/AppContext';
import { skillGaps } from '../../data/mockData';

export const SkillsTab = () => {
  const { isDarkMode, t, appSettings, skillChats, skillChatInputs, setSkillChatInputs, handleSkillChatSubmit } = useAppContext();

  return (
    <div className="space-y-6">
      <div className={`grid ${appSettings.compactView ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6'}`}>
        {skillGaps.map(skill => (
          <GlareHover
            key={skill.id}
            glareColor={isDarkMode ? "#ffffff" : "#3f37b3"}
            glareOpacity={0.15}
            className={`${t.card} p-6 flex flex-col transition-all`}
          >
            <div className="relative z-10 w-full flex flex-col h-full">
              <div className="flex justify-between items-start mb-4 gap-2">
                <h3 className={`font-semibold text-lg leading-tight ${t.textMain}`}>{skill.name}</h3>
                {skill.current >= skill.required ? (
                  <span className={`inline-flex items-center whitespace-nowrap shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-emerald-700 bg-emerald-100'}`}>
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Target Met
                  </span>
                ) : (
                  <span className={`inline-flex items-center whitespace-nowrap shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${isDarkMode ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-rose-700 bg-rose-100'}`}>
                    <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> Gap Identified
                  </span>
                )}
              </div>
              
              <div className={`space-y-3 ${appSettings.compactView ? 'mb-4' : 'mb-6'}`}>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={t.textMuted}>Current Level</span>
                    <span className={`font-medium ${t.textMain}`}>{skill.current}%</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${skill.current}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={t.textMuted}>Required Level</span>
                    <span className={`font-medium ${t.textMain}`}>{skill.required}%</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                    <div className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-400' : 'bg-gray-800'}`} style={{ width: `${skill.required}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Inline Mini Skill Chat */}
              <div className={`mt-auto pt-4 border-t ${t.borderSoft} w-full`}>
                <div className={`flex items-center mb-3 text-sm font-semibold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                  <HelpCircle className={`w-4 h-4 mr-1.5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                  Quick Doubt?
                </div>
                
                {skillChats[skill.id]?.messages?.length > 0 && (
                  <div className="flex flex-col gap-2 mb-3 max-h-40 overflow-y-auto pr-1">
                    {skillChats[skill.id].messages.map((msg, idx) => (
                      <div key={idx} className={`p-2.5 rounded-lg text-xs leading-relaxed ${msg.role === 'user' ? (isDarkMode ? 'bg-indigo-500/20 text-indigo-100 self-end ml-4 rounded-tr-none' : 'bg-indigo-50 text-indigo-900 self-end ml-4 rounded-tr-none') : (isDarkMode ? 'bg-[var(--color-surface)]/5 text-slate-300 self-start mr-4 rounded-tl-none border border-white/10' : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] self-start mr-4 rounded-tl-none border border-[var(--color-border)]')}`}>
                        {msg.text}
                      </div>
                    ))}
                    {skillChats[skill.id].loading && (
                      <div className={`text-xs animate-pulse p-2 self-start ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>
                        Thinking...
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={(e) => handleSkillChatSubmit(e, skill)} className="flex gap-2 relative w-full overflow-hidden">
                  <input
                    type="text"
                    value={skillChatInputs[skill.id] || ''}
                    onChange={(e) => setSkillChatInputs(prev => ({ ...prev, [skill.id]: e.target.value }))}
                    placeholder={`Ask about ${skill.name}...`}
                    className={`flex-1 min-w-0 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 transition-all relative z-20 ${t.input}`}
                    disabled={skillChats[skill.id]?.loading}
                  />
                  <button 
                    type="submit" 
                    disabled={skillChats[skill.id]?.loading || !skillChatInputs[skill.id]?.trim()} 
                    className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center shrink-0 relative z-20"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </GlareHover>
        ))}
      </div>
    </div>
  );
};

