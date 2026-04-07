import { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../api/supabase';
import { getCareerAdvice } from '../../api/CareerBotController';
import toast from 'react-hot-toast';
import {
  Sparkles, Send, RotateCcw, Copy, Check,
  Bot, User, Lightbulb, Code, BookOpen, Briefcase,
  X, Zap, ShieldCheck, Target, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Format AI response text (code blocks, bold) - Premium styling
function FormattedText({ text }) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.split('\n');
          const lang = lines[0].replace('```', '').trim();
          const code = lines.slice(1, -1).join('\n');
          return (
            <div key={i} className="rounded-3xl overflow-hidden border border-[var(--color-border)] mt-4 mb-4 shadow-xl">
              {lang && (
                <div className="bg-[var(--color-surface-2)] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] border-b border-[var(--color-border)] flex items-center gap-2">
                   <Code size={12} className="text-[var(--color-primary)]" /> {lang}
                </div>
              )}
              <pre className="bg-[#0D1117] text-blue-300 px-6 py-4 overflow-x-auto text-[13px] font-mono leading-relaxed whitespace-pre-wrap selection:bg-blue-500/30">
                {code}
              </pre>
            </div>
          );
        }
        // Handle **bold**
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-[var(--color-text-primary)] font-medium">
            {boldParts.map((bp, j) =>
              bp.startsWith('**') && bp.endsWith('**')
                ? <strong key={j} className="font-black text-indigo-500 uppercase tracking-tight">
                    {bp.slice(2,-2)}
                  </strong>
                : <span key={j}>{bp}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

// Tactical suggested prompts
const SUGGESTIONS = [
  { icon: Target,      text: 'Analyze my Skill Gap for React' },
  { icon: Briefcase,   text: 'Optimize my Resume for Fullstack roles' },
  { icon: Lightbulb,  text: 'How to handle behaviorial interviews?' },
  { icon: Code,       text: 'Simulate a coding challenge' },
  { icon: GraduationCap, text: 'Plan a 3-month AI roadmap' },
  { icon: ShieldCheck, text: 'Tips for Cybersecurity internships' },
];

export default function ChatPage() {
  const { user } = useSelector(s => s.auth);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user) fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setMessages(data.map(m => ({
          ...m,
          timestamp: new Date(m.created_at)
        })));
      } else {
        // Initial welcome
        setMessages([{
          id: 'welcome',
          role: 'ai',
          content: `Initialized Career Coach Protocol. Hi **${user?.full_name?.split(' ')[0] || 'Intern'}**! AI synthesis complete. Ready to optimize your professional trajectory. ✨`,
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || loading) return;

    setInput('');
    const userMsg = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      user_id: user.id,
      content: messageText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // 1. Save user msg to Supabase
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        role: 'user',
        content: messageText
      });

      // 2. Get Strategic AI Reply
      const replyText = getCareerAdvice(messageText);

      // 3. Save AI reply to Supabase
      const { data: aiData, error: aiError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          role: 'ai',
          content: replyText
        })
        .select()
        .single();

      if (aiError) throw aiError;

      setMessages(prev => [...prev, {
        ...aiData,
        timestamp: new Date(aiData.created_at)
      }]);

    } catch (err) {
      toast.error('Tactical comms disrupted');
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading, user]);

  const clearChat = async () => {
    if (!window.confirm('Erase mission logs?')) return;
    try {
      await supabase.from('chat_messages').delete().eq('user_id', user.id);
      setMessages([{
        id: 'cleared',
        role: 'ai',
        content: 'Database purged. Initializing fresh career session. Ready for input. 🚀',
        timestamp: new Date(),
      }]);
    } catch (err) {
      toast.error('Purge failure');
    }
  };

  const copyText = async (id, text) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const isEmpty = messages.length <= 1;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] animate-in fade-in duration-700">

        {/* PREMIUM HEADER */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-2xl relative group overflow-hidden">
               <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
               <Bot size={28} className="text-white relative z-10"/>
            </div>
            <div className="text-left">
              <h1 className="font-sora font-black text-2xl text-[var(--color-text-primary)] tracking-tight">AI Career Coach</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border-2 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.5)]"/>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] opacity-60">Identity Verified · Real-Time Tactical Support</p>
              </div>
            </div>
          </div>
          <button onClick={clearChat} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all shadow-sm">
            <RotateCcw size={14}/> Reset Session
          </button>
        </div>

        {/* MESSAGES AREA - Premium Background */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[48px] p-8 md:p-12 space-y-8 mb-6 shadow-inner relative custom-scrollbar scroll-smooth">
          
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.03),transparent)] pointer-events-none" />

          {/* Empty state suggestions */}
          {isEmpty && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 max-w-4xl mx-auto">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-10 text-center opacity-40">
                Strategic Quick-Starts
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {SUGGESTIONS.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <button key={idx} onClick={() => sendMessage(s.text)} className="flex items-center gap-5 p-6 text-left rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface-2)]/50 hover:border-[var(--color-primary)]/40 hover:bg-white hover:shadow-2xl transition-all duration-300 group">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon size={20} className="text-[var(--color-primary)]"/>
                      </div>
                      <span className="text-sm font-bold text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] leading-tight">
                        {s.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <motion.div key={msg.id || idx} initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>

              {/* Avatar Unit */}
              <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-xs font-black shadow-xl mt-1 ring-4 ring-offset-2 ring-transparent transition-all ${msg.role === 'user' ? 'bg-[#1E3A5F] text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}`}>
                {msg.role === 'user' ? (user?.full_name?.charAt(0)?.toUpperCase() || 'U') : <Sparkles size={18} fill="currentColor"/>}
              </div>

              {/* Bubble Architecture */}
              <div className={`relative max-w-[80%] md:max-w-[70%] group flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-8 py-5 rounded-[2.5rem] shadow-sm transition-all hover:shadow-2xl ${msg.role === 'user' ? 'bg-[#1E3A5F] text-white rounded-tr-[4px]' : 'bg-[var(--color-surface-2)]/80 backdrop-blur-md border border-[var(--color-border)] rounded-tl-[4px]'}`}>
                  {msg.role === 'user' ? <p className="text-sm font-medium leading-relaxed">{msg.content}</p> : <FormattedText text={msg.content}/>}
                </div>

                {/* Metadata Layer */}
                <div className={`flex items-center gap-4 mt-3 ${msg.role === 'user' ? 'justify-end pr-2' : 'pl-2'}`}>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)] opacity-40">
                    {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'ai' && (
                    <button onClick={() => copyText(msg.id, msg.content)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]">
                      {copied === msg.id ? <Check size={14} className="text-emerald-500"/> : <Copy size={14}/>}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Processing Module (Loading) */}
          {loading && (
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center animate-pulse">
                <Sparkles size={18} className="text-indigo-500"/>
              </div>
              <div className="bg-[var(--color-surface-2)]/50 border border-[var(--color-border)] rounded-[2.5rem] rounded-tl-[4px] px-8 py-6">
                <div className="flex gap-2 items-center">
                  {[0,1,2].map(i => (
                    <motion.span key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} className="w-2.5 h-2.5 rounded-full bg-indigo-500/40" />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>

        {/* TACTICAL INPUT ARRAY */}
        <div className="flex-shrink-0 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] p-4 shadow-3xl hover:border-[var(--color-primary)]/30 transition-all group">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-[var(--color-surface-2)] rounded-3xl text-indigo-500 group-hover:rotate-12 transition-transform shadow-inner">
               <Zap size={22} fill="currentColor" />
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Query the Career Advisor..."
              disabled={loading}
              rows={1}
              className="flex-1 resize-none bg-transparent border-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/50 px-2 py-4 text-sm font-bold focus:outline-none disabled:opacity-50 transition-all max-h-36 overflow-y-auto"
              onInput={e => (e.target.style.height = 'auto', e.target.style.height = Math.min(e.target.scrollHeight, 144) + 'px')}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-14 h-14 rounded-[2rem] flex-shrink-0 flex items-center justify-center bg-[var(--color-primary)] text-white hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xl shadow-[var(--color-primary)]/20"
            >
              <Send size={22} />
            </button>
          </div>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--color-text-muted)] mt-5 text-center opacity-30">
          Career Pulse Synthesis System v2.0
        </p>
      </div>
    </DashboardLayout>
  );
}
