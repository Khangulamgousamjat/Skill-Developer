import React from 'react';
import { Bot, X, MessageSquare, Send, Zap } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Chatbot = () => {
  const { 
    isDarkMode, t, isChatOpen, setIsChatOpen, 
    chatMessages, chatInput, setChatInput, 
    isChatLoading, handleSendMessage, chatEndRef,
    studentOverview
  } = useAppContext();

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end pointer-events-none">
      {isChatOpen && (
        <div className={`
          pointer-events-auto w-[360px] sm:w-[420px] h-[600px] max-h-[80vh]
          rounded-[32px] mb-6 flex flex-col overflow-hidden 
          animate-in slide-in-from-bottom-10 duration-500
          shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 ${t.modalBg}
        `}>
          {/* Header */}
          <div className={`p-6 flex justify-between items-center relative overflow-hidden ${isDarkMode ? 'bg-slate-900/50' : 'bg-blue-600 text-white'}`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none">Career Coach AI</h3>
                <div className="flex items-center gap-1.5 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] uppercase font-black tracking-widest opacity-70">Active Mentor Mode</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="p-2 rounded-xl bg-[var(--color-surface)]/5 hover:bg-[var(--color-surface)]/10 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-6 space-y-6 flex flex-col custom-scrollbar ${isDarkMode ? 'bg-black/20' : 'bg-slate-50'}`}>
            <div className="text-center py-2 mb-4">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-slate-500/10 px-3 py-1 rounded-full">Conversation Started</span>
            </div>

            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`
                  max-w-[85%] rounded-[24px] px-5 py-3 text-sm shadow-sm leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none font-medium' 
                    : `${isDarkMode ? 'bg-[var(--color-surface)]/5 border border-white/10 text-slate-200' : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)]'} rounded-bl-none`}
                `}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.role !== 'user' && (
                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1 opacity-50 text-[10px] font-bold uppercase tracking-widest">
                       <Zap className="w-3 h-3 text-amber-500" />
                       Context Aware Response
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isChatLoading && (
              <div className="flex justify-start">
                <div className={`rounded-[24px] rounded-bl-none px-5 py-4 flex items-center gap-1 ${isDarkMode ? 'bg-[var(--color-surface)]/5 border border-white/10' : 'bg-[var(--color-surface)] border text-gray-400'}`}>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className={`p-4 pb-8 flex flex-col gap-3 border-t ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-[var(--color-surface)] border-[var(--color-border)]'}`}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message your career coach..."
                className={`
                  flex-1 px-5 py-3 text-sm rounded-2xl focus:outline-none transition-all
                  ${t.input} border border-white/5 focus:border-blue-500/50
                `}
                disabled={isChatLoading}
              />
              <button 
                type="submit" 
                disabled={!chatInput.trim() || isChatLoading}
                className="w-11 h-11 shrink-0 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-90 flex items-center justify-center disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center">
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Powered by SSLLM-GPT v1.4</p>
            </div>
          </form>
        </div>
      )}
      
      {/* Toggle Button */}
      <div className="relative pointer-events-auto">
        {!isChatOpen && (
          <div className="absolute -top-12 right-0 bg-amber-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-lg shadow-xl animate-bounce whitespace-nowrap">
            Level {studentOverview.level} Reached! Ask me anything.
          </div>
        )}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`
            w-16 h-16 rounded-[22px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] 
            transition-all transform hover:scale-110 active:scale-95
            flex items-center justify-center relative group overflow-hidden
            ${isChatOpen ? 'bg-red-500 text-white rotate-90' : (isDarkMode ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-900 text-white')}
          `}
        >
          {isChatOpen ? <X className="w-7 h-7" /> : (
            <>
              <MessageSquare className="w-7 h-7 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -inset-1 bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

