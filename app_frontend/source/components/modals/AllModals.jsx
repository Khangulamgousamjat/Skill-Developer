import React from 'react';
import { Settings, X, Moon, Sun, Bell, LayoutTemplate, ShieldCheck, Bot, FileText, Coffee, Users, Mail, Award } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { internData } from '../../data/mockData';

export const AllModals = () => {
  const { 
    isDarkMode, setIsDarkMode, t, activeTab,
    isSettingsOpen, setIsSettingsOpen, appSettings, setAppSettings,
    careerCoach, setCareerCoach,
    profileBio, setProfileBio, handleCopyBio,
    standupPrep, setStandupPrep, handleCopyStandup,
    oneOnOnePrep, setOneOnOnePrep, handleCopyOneOnOne,
    progressEmail, setProgressEmail, handleCopyEmail,
    certificateModal, setCertificateModal
  } = useAppContext();

  return (
    <>
      {/* Settings Modal (Glassmorphic) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className={`w-full max-w-md rounded-2xl overflow-hidden ${t.modalBg}`}>
            <div className={`p-5 flex justify-between items-center border-b ${t.border}`}>
              <h3 className={`font-bold text-lg flex items-center gap-2 ${t.textMain}`}>
                <Settings className="w-5 h-5"/> Preferences
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className={`hover:opacity-70 transition-opacity ${t.textMuted}`}>
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <div className="p-6 space-y-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400 shadow-[inset_0_0_12px_rgba(99,102,241,0.2)]' : 'bg-amber-100 text-amber-600'}`}>
                    {isDarkMode ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${t.textMain}`}>Appearance</p>
                    <p className={`text-xs mt-0.5 ${t.textMuted}`}>Toggle Glassmorphic Dark Mode</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)} 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-indigo-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-surface)] transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}/>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                    <Bell className="w-5 h-5"/>
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${t.textMain}`}>Notifications</p>
                    <p className={`text-xs mt-0.5 ${t.textMuted}`}>Daily learning reminders</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAppSettings({...appSettings, notifications: !appSettings.notifications})} 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${appSettings.notifications ? 'bg-emerald-500' : (isDarkMode ? 'bg-slate-700' : 'bg-gray-300')}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-surface)] transition-transform ${appSettings.notifications ? 'translate-x-6' : 'translate-x-1'}`}/>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
                    <LayoutTemplate className="w-5 h-5"/>
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${t.textMain}`}>Compact Layout</p>
                    <p className={`text-xs mt-0.5 ${t.textMuted}`}>Reduce dashboard spacing</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAppSettings({...appSettings, compactView: !appSettings.compactView})} 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${appSettings.compactView ? 'bg-cyan-500' : (isDarkMode ? 'bg-slate-700' : 'bg-gray-300')}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-surface)] transition-transform ${appSettings.compactView ? 'translate-x-6' : 'translate-x-1'}`}/>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
                    <ShieldCheck className="w-5 h-5"/>
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${t.textMain}`}>Data Saver</p>
                    <p className={`text-xs mt-0.5 ${t.textMuted}`}>Pause background video preloads</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAppSettings({...appSettings, dataSaver: !appSettings.dataSaver})} 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${appSettings.dataSaver ? 'bg-rose-500' : (isDarkMode ? 'bg-slate-700' : 'bg-gray-300')}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-surface)] transition-transform ${appSettings.dataSaver ? 'translate-x-6' : 'translate-x-1'}`}/>
                </button>
              </div>
            </div>
            
            <div className={`p-4 border-t flex justify-end ${t.border} ${isDarkMode ? 'bg-[var(--color-surface)]/5' : 'bg-[var(--color-surface-2)]'}`}>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${isDarkMode ? 'bg-[var(--color-surface)] text-slate-900 hover:bg-gray-200' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Career Coach Modal */}
      {careerCoach.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl overflow-hidden transition-all ${t.modalBg}`}>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
              <button onClick={() => setCareerCoach({ ...careerCoach, isOpen: false })} className="absolute top-4 right-4 text-white/80 hover:text-white bg-[var(--color-surface)]/10 hover:bg-[var(--color-surface)]/20 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[var(--color-surface)]/20 p-2 rounded-xl"><Bot className="w-6 h-6" /></div>
                <h3 className="font-bold text-xl">AI Career Coach</h3>
              </div>
              <p className="text-indigo-100 text-sm">Personalized advice for {internData.name}</p>
            </div>
            
            <div className="p-6 min-h-[160px] flex flex-col justify-center">
              {careerCoach.loading ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <p className={`text-sm font-medium animate-pulse ${t.textMuted}`}>Analyzing your profile & skills...</p>
                </div>
              ) : (
                <div className={`text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl border ${isDarkMode ? 'bg-black/20 text-slate-200 border-white/10' : 'text-[var(--color-text-secondary)] bg-[var(--color-surface-2)] border-[var(--color-border)]'}`}>
                  {careerCoach.text}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Resume Bio Modal */}
      {profileBio.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl overflow-hidden transition-all ${t.modalBg}`}>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white relative">
              <button onClick={() => setProfileBio({ ...profileBio, isOpen: false })} className="absolute top-4 right-4 text-white/80 hover:text-white bg-[var(--color-surface)]/10 hover:bg-[var(--color-surface)]/20 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[var(--color-surface)]/20 p-2 rounded-xl"><FileText className="w-6 h-6" /></div>
                <h3 className="font-bold text-xl">AI Bio Generator</h3>
              </div>
              <p className="text-blue-100 text-sm">Professional LinkedIn summary for {internData.name}</p>
            </div>
            
            <div className="p-6 min-h-[160px] flex flex-col justify-center">
              {profileBio.loading ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <p className={`text-sm font-medium animate-pulse ${t.textMuted}`}>Crafting your professional bio...</p>
                </div>
              ) : (
                <div className={`text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl border ${isDarkMode ? 'bg-black/20 text-slate-200 border-white/10' : 'text-[var(--color-text-secondary)] bg-[var(--color-surface-2)] border-[var(--color-border)]'}`}>
                  {profileBio.text}
                </div>
              )}
            </div>
            
            {!profileBio.loading && (
              <div className={`p-4 flex justify-between items-center border-t ${t.border} ${isDarkMode ? 'bg-[var(--color-surface)]/5' : 'bg-[var(--color-surface-2)]'}`}>
                <button onClick={handleCopyBio} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
                  {profileBio.copied ? "Copied! ✓" : "Copy to Clipboard"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Standup Prep Modal */}
      {standupPrep.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl overflow-hidden transition-all ${t.modalBg}`}>
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative">
              <button onClick={() => setStandupPrep({ ...standupPrep, isOpen: false })} className="absolute top-4 right-4 text-white/80 hover:text-white bg-[var(--color-surface)]/10 hover:bg-[var(--color-surface)]/20 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[var(--color-surface)]/20 p-2 rounded-xl"><Coffee className="w-6 h-6" /></div>
                <h3 className="font-bold text-xl">AI Standup Assistant</h3>
              </div>
              <p className="text-emerald-100 text-sm">Drafting your daily update...</p>
            </div>
            
            <div className="p-6 min-h-[160px] flex flex-col justify-center">
              {standupPrep.loading ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <p className={`text-sm font-medium animate-pulse ${t.textMuted}`}>Reviewing your projects & skills...</p>
                </div>
              ) : (
                <div className={`text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl border ${isDarkMode ? 'bg-black/20 text-slate-200 border-white/10' : 'text-[var(--color-text-secondary)] bg-[var(--color-surface-2)] border-[var(--color-border)]'}`}>
                  {standupPrep.text}
                </div>
              )}
            </div>
            
            {!standupPrep.loading && (
              <div className={`p-4 flex justify-between items-center border-t ${t.border} ${isDarkMode ? 'bg-[var(--color-surface)]/5' : 'bg-[var(--color-surface-2)]'}`}>
                <button onClick={handleCopyStandup} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}>
                  {standupPrep.copied ? "Copied! ✓" : "Copy for Slack/Teams"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI 1-on-1 Prep Modal */}
      {oneOnOnePrep.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl overflow-hidden transition-all ${t.modalBg}`}>
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-white relative">
              <button onClick={() => setOneOnOnePrep({ ...oneOnOnePrep, isOpen: false })} className="absolute top-4 right-4 text-white/80 hover:text-white bg-[var(--color-surface)]/10 hover:bg-[var(--color-surface)]/20 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[var(--color-surface)]/20 p-2 rounded-xl"><Users className="w-6 h-6" /></div>
                <h3 className="font-bold text-xl">1-on-1 Prep Assistant</h3>
              </div>
              <p className="text-rose-100 text-sm">Generating discussion points for your manager meeting...</p>
            </div>
            
            <div className="p-6 min-h-[160px] flex flex-col justify-center">
              {oneOnOnePrep.loading ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <p className={`text-sm font-medium animate-pulse ${t.textMuted}`}>Drafting strategic questions...</p>
                </div>
              ) : (
                <div className={`text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl border ${isDarkMode ? 'bg-black/20 text-slate-200 border-white/10' : 'text-[var(--color-text-secondary)] bg-[var(--color-surface-2)] border-[var(--color-border)]'}`}>
                  {oneOnOnePrep.text}
                </div>
              )}
            </div>
            
            {!oneOnOnePrep.loading && (
              <div className={`p-4 flex justify-between items-center border-t ${t.border} ${isDarkMode ? 'bg-[var(--color-surface)]/5' : 'bg-[var(--color-surface-2)]'}`}>
                <button onClick={handleCopyOneOnOne} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' : 'text-rose-600 bg-rose-50 hover:bg-rose-100'}`}>
                  {oneOnOnePrep.copied ? "Copied! ✓" : "Copy to Notes"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Progress Email Modal */}
      {progressEmail.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl overflow-hidden transition-all ${t.modalBg}`}>
            <div className={`p-6 text-white relative ${isDarkMode ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-b border-white/10' : 'bg-gradient-to-r from-slate-700 to-slate-900'}`}>
              <button onClick={() => setProgressEmail({ ...progressEmail, isOpen: false })} className="absolute top-4 right-4 text-white/80 hover:text-white bg-[var(--color-surface)]/10 hover:bg-[var(--color-surface)]/20 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[var(--color-surface)]/20 p-2 rounded-xl"><Mail className="w-6 h-6" /></div>
                <h3 className="font-bold text-xl">Manager Update Draft</h3>
              </div>
              <p className="text-slate-300 text-sm">Professional weekly update generated from your stats.</p>
            </div>
            
            <div className="p-6 min-h-[200px] flex flex-col justify-center">
              {progressEmail.loading ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <p className={`text-sm font-medium animate-pulse ${t.textMuted}`}>Drafting professional email...</p>
                </div>
              ) : (
                <div className={`text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl border shadow-inner font-sans ${isDarkMode ? 'bg-black/40 border-white/10 text-slate-300' : 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-secondary)]'}`}>
                  {progressEmail.text}
                </div>
              )}
            </div>
            
            {!progressEmail.loading && (
              <div className={`p-4 flex justify-between items-center border-t ${t.border} ${isDarkMode ? 'bg-[var(--color-surface)]/5' : 'bg-[var(--color-surface-2)]'}`}>
                <button onClick={handleCopyEmail} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-[var(--color-surface)]/10 text-white hover:bg-[var(--color-surface)]/20' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                  {progressEmail.copied ? "Copied! ✓" : "Copy to Email Client"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ERP Certificate Modal */}
      {certificateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface)] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-10 border-8 border-double border-[var(--color-border)] text-center relative bg-[var(--color-surface-2)] text-[var(--color-text-primary)]">
              <button onClick={() => setCertificateModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-[var(--color-text-secondary)] transition-colors">
                <X className="w-6 h-6" />
              </button>
              
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-serif font-bold tracking-wide uppercase">Certificate of Achievement</h2>
              <p className="text-[var(--color-text-muted)] mt-2 uppercase tracking-widest text-sm">Smart Skill & Live Learning Module — Gous org</p>
              
              <div className="my-8">
                <p className="text-[var(--color-text-secondary)] italic mb-2">This certifies that</p>
                <p className="text-4xl font-bold text-blue-800 border-b-2 border-gray-300 inline-block pb-2 px-8">{internData.name}</p>
                <p className="text-[var(--color-text-secondary)] italic mt-4">has successfully completed the required training and project evaluations for the role of</p>
                <p className="text-xl font-semibold mt-2">{internData.role}</p>
              </div>
              
              <div className="flex justify-between items-end mt-12 px-8">
                <div className="text-center">
                  <div className="border-b border-gray-800 w-32 mb-2"></div>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase font-bold">Manager Signature</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-red-50 rounded-full border-2 border-red-200 flex items-center justify-center text-red-400 transform -rotate-12 mx-auto mb-2 opacity-50">
                    <span className="font-bold border-2 border-red-400 p-1 rounded">VERIFIED</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-b border-gray-800 w-32 mb-2"></div>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase font-bold">Date Issued</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--color-surface-2)] p-4 flex justify-end gap-3 border-t border-[var(--color-border)]">
              <button onClick={() => setCertificateModal(false)} className="px-4 py-2 bg-[var(--color-surface)] border border-gray-300 text-[var(--color-text-secondary)] rounded-lg text-sm font-semibold hover:bg-[var(--color-surface-2)] transition-colors">
                Close
              </button>
              <button onClick={() => alert("Downloading PDF...")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

