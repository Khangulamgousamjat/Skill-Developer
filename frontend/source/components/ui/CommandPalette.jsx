import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search, Command, X, User, Briefcase, Bot, ArrowRight, Loader2 } from 'lucide-react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export const CommandPalette = () => {
  const { t, isDarkMode, isCommandPaletteOpen, setIsCommandPaletteOpen } = useAppContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], projects: [], ai: null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults({ users: [], projects: [], ai: null });
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 2) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/ai/search', { query });
      if (response.data.success) {
        setResults(response.data.data);
      }
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  const close = () => setIsCommandPaletteOpen(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={close}></div>
      
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-slide-up ${t.modalBg}`}>
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3 border-b border-white/10">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-slate-500"
            placeholder="Search users, projects, or ask Gemini anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && close()}
          />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--color-surface)]/5 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400">ESC</span>
          </div>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
              <p className="text-sm font-medium">Scanning the enterprise...</p>
            </div>
          ) : query.trim().length === 0 ? (
            <div className="py-8 px-4 text-center">
              <Command className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className={`font-semibold ${t.textMain}`}>Welcome to Command Palette</p>
              <p className={`text-xs mt-1 ${t.textMuted}`}>Use <kbd className="font-mono bg-[var(--color-surface)]/5 px-1 rounded">Ctrl+K</kbd> anytime to open this menu.</p>
              
              <div className="grid grid-cols-2 gap-2 mt-6 max-w-sm mx-auto">
                {['Go to Projects', 'View Stats', 'AI Career Coach', 'Switch Theme'].map(act => (
                  <button key={act} className={`text-left p-2 rounded-lg text-xs font-semibold ${t.hover} ${t.textMuted}`}>
                    {act}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-2">
              {/* AI Guidance */}
              {results.ai && (
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2 text-blue-400">
                    <Bot className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">AI Navigation Engine</span>
                  </div>
                  <p className="text-sm text-slate-200">{results.ai.tip}</p>
                  {results.ai.navigationRecommendation && (
                    <button 
                      onClick={() => {
                        navigate(`/dashboard/${results.ai.navigationRecommendation.toLowerCase().split(' ')[0]}`);
                        close();
                      }}
                      className="mt-3 flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Jump to {results.ai.navigationRecommendation} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* User Results */}
              {results.users.length > 0 && (
                <div>
                  <h4 className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">People</h4>
                  <div className="space-y-1">
                    {results.users.map(u => (
                      <button key={u.id} className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${t.hover}`}>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-200">{u.full_name}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-black">{u.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Results */}
              {results.projects.length > 0 && (
                <div>
                  <h4 className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Projects</h4>
                  <div className="space-y-1">
                    {results.projects.map(p => (
                      <button key={p.id} className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${t.hover}`}>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-200">{p.title}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{p.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.users.length === 0 && results.projects.length === 0 && !loading && (
                <div className="py-8 text-center text-slate-500">
                  <p className="text-sm">No exact data matches. Try rephrasing or asking Gemini.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-black/20 flex justify-between items-center">
          <p className="text-[10px] text-slate-500">
            Intelligent Search <span className="text-blue-500/60 font-black">GOUS-v2.5</span>
          </p>
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5">
                <kbd className="font-mono bg-[var(--color-surface)]/5 border border-white/10 px-1 rounded text-[10px] text-slate-400">⏎</kbd>
                <span className="text-[10px] text-slate-500">Select</span>
             </div>
             <div className="flex items-center gap-1.5">
                <kbd className="font-mono bg-[var(--color-surface)]/5 border border-white/10 px-1 rounded text-[10px] text-slate-400">↑↓</kbd>
                <span className="text-[10px] text-slate-500">Navigate</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

