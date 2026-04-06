import { useState, useRef, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axiosInstance from '../../api/axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  Sparkles, Send, RotateCcw, Copy, Check,
  Bot, User, Lightbulb, Code, BookOpen, Briefcase
} from 'lucide-react';

// Format AI response text (code blocks, bold)
function FormattedText({ text }) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.split('\n');
          const lang = lines[0].replace('```', '').trim();
          const code = lines.slice(1, -1).join('\n');
          return (
            <div key={i} className="rounded-xl overflow-hidden
              border border-[var(--color-border)] mt-2 mb-2">
              {lang && (
                <div className="bg-[var(--color-surface-2)]
                  px-3 py-1.5 text-xs font-mono
                  text-[var(--color-text-muted)]
                  border-b border-[var(--color-border)]">
                  {lang}
                </div>
              )}
              <pre className="bg-[#0A1628] text-green-300
                px-4 py-3 overflow-x-auto text-xs
                font-mono leading-relaxed whitespace-pre-wrap">
                {code}
              </pre>
            </div>
          );
        }
        // Handle **bold**
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-[var(--color-text-primary)]">
            {boldParts.map((bp, j) =>
              bp.startsWith('**') && bp.endsWith('**')
                ? <strong key={j} className="font-semibold
                    text-[var(--color-text-primary)]">
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

// Suggested prompts
const SUGGESTIONS = [
  { icon: Code,      text: 'Explain React hooks with examples' },
  { icon: BookOpen,  text: 'How to learn Python from scratch?' },
  { icon: Lightbulb, text: 'What is DSA and why is it important?' },
  { icon: Briefcase, text: 'Tips for tech interviews?' },
  { icon: Code,      text: 'Difference between SQL and NoSQL' },
  { icon: BookOpen,  text: 'How to build a REST API with Node.js?' },
];

export default function ChatPage() {
  const { user } = useSelector(s => s.auth);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const historyRef = useRef([]);

  // Welcome message
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'ai',
      content: `Hi ${user?.full_name?.split(' ')[0] || 'there'}! 👋 I'm your **AI Learning Assistant**.

I can help you with:
- **Programming doubts** — any language or framework
- **Concept explanations** — with code examples
- **Learning roadmaps** — what to study and in what order
- **Career guidance** — tech career advice
- **Project ideas** — build things to learn faster

Ask me anything! I'm here 24/7. 🚀`,
      timestamp: new Date(),
    }]);
  }, []);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || loading) return;

    setInput('');
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    historyRef.current.push({
      role: 'user', content: messageText
    });

    try {
      const res = await axiosInstance.post('/ai/chat', {
        message: messageText,
        history: historyRef.current.slice(-20),
      });

      const reply = res.data.data.reply;
      const aiMsg = {
        id: (Date.now()+1).toString(),
        role: 'ai',
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      historyRef.current.push({ role: 'assistant', content: reply });

    } catch (err) {
      const errMsg = err.response?.data?.message
        || 'Failed to get response. Please try again.';
      setMessages(prev => [...prev, {
        id: (Date.now()+1).toString(),
        role: 'ai',
        content: `❌ ${errMsg}`,
        isError: true,
        timestamp: new Date(),
      }]);
      historyRef.current.pop();
      toast.error(errMsg);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    historyRef.current = [];
    setMessages([{
      id: 'cleared',
      role: 'ai',
      content: 'Chat cleared! Ask me anything. 🚀',
      timestamp: new Date(),
    }]);
  };

  const copyText = async (id, text) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const isEmpty = messages.length <= 1;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-88px)]
        max-h-[calc(100vh-88px)]">

        {/* HEADER */}
        <div className="flex items-center justify-between
          mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl
              bg-gradient-to-br from-[#F4A100] to-[#FFB733]
              flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white"/>
            </div>
            <div>
              <h1 className="font-sora font-bold text-xl
                text-[var(--color-text-primary)]">
                AI Learning Assistant
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full
                  bg-green-500 animate-pulse"/>
                <p className="text-xs
                  text-[var(--color-text-muted)]">
                  Online · Unlimited messages · Powered by AI
                </p>
              </div>
            </div>
          </div>
          <button onClick={clearChat}
            title="Clear chat"
            className="flex items-center gap-1.5 px-3 py-1.5
              rounded-lg text-xs font-medium
              text-[var(--color-text-muted)]
              hover:bg-[var(--color-surface-2)]
              border border-[var(--color-border)]
              transition-all">
            <RotateCcw size={13}/> Clear chat
          </button>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto
          bg-[var(--color-surface)]
          border border-[var(--color-border)]
          rounded-2xl p-4 md:p-6 space-y-5 mb-4">

          {/* Empty state suggestions */}
          {isEmpty && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase
                tracking-widest text-[var(--color-text-muted)]
                mb-4 text-center">
                Quick Start — Try asking:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2
                gap-3 max-w-2xl mx-auto">
                {SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button key={s.text}
                      onClick={() => sendMessage(s.text)}
                      className="flex items-center gap-3 p-3.5
                        text-left rounded-xl border
                        border-[var(--color-border)]
                        bg-[var(--color-surface-2)]
                        hover:border-[#F4A100]/40
                        hover:bg-[#F4A100]/5
                        transition-all duration-200 group">
                      <div className="w-8 h-8 rounded-lg
                        bg-[#F4A100]/10 flex items-center
                        justify-center flex-shrink-0
                        group-hover:bg-[#F4A100]/20
                        transition-colors">
                        <Icon size={15}
                          className="text-[#F4A100]"/>
                      </div>
                      <span className="text-sm
                        text-[var(--color-text-secondary)]
                        group-hover:text-[var(--color-text-primary)]
                        leading-snug">
                        {s.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div key={msg.id}
              className={`flex gap-3
                ${msg.role === 'user'
                  ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex-shrink-0
                flex items-center justify-center text-xs
                font-bold mt-0.5
                ${msg.role === 'user'
                  ? 'bg-[#1E3A5F] text-white'
                  : 'bg-gradient-to-br from-[#F4A100] to-[#FFB733] text-white'
                }`}>
                {msg.role === 'user'
                  ? (user?.full_name?.charAt(0)?.toUpperCase() || 'U')
                  : <Sparkles size={14}/>
                }
              </div>

              {/* Bubble */}
              <div className={`
                relative max-w-[75%] group
                ${msg.role === 'user' ? 'items-end' : 'items-start'}
                flex flex-col
              `}>
                <div className={`
                  px-4 py-3 rounded-2xl
                  ${msg.role === 'user'
                    ? 'bg-[#1E3A5F] text-white rounded-tr-sm'
                    : msg.isError
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-tl-sm'
                      : 'bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-tl-sm'
                  }
                `}>
                  {msg.role === 'user'
                    ? <p className="text-sm text-white leading-relaxed">
                        {msg.content}
                      </p>
                    : <FormattedText text={msg.content}/>
                  }
                </div>

                {/* Time + copy */}
                <div className={`flex items-center gap-2 mt-1
                  ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  <span className="text-[10px]
                    text-[var(--color-text-muted)]">
                    {msg.timestamp.toLocaleTimeString([],{
                      hour:'2-digit', minute:'2-digit'
                    })}
                  </span>
                  {msg.role === 'ai' && !msg.isError && (
                    <button
                      onClick={() => copyText(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100
                        transition-opacity p-0.5 rounded
                        text-[var(--color-text-muted)]
                        hover:text-[var(--color-text-primary)]">
                      {copied === msg.id
                        ? <Check size={11} className="text-green-500"/>
                        : <Copy size={11}/>
                      }
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl flex-shrink-0
                bg-gradient-to-br from-[#F4A100] to-[#FFB733]
                flex items-center justify-center">
                <Sparkles size={14} className="text-white"/>
              </div>
              <div className="bg-[var(--color-surface-2)]
                border border-[var(--color-border)]
                rounded-2xl rounded-tl-sm px-4 py-3.5">
                <div className="flex gap-1 items-center">
                  {[0,1,2].map(i => (
                    <span key={i}
                      className="w-2 h-2 rounded-full
                        bg-[var(--color-text-muted)]
                        animate-bounce"
                      style={{
                        animationDelay: `${i*150}ms`
                      }}/>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef}/>
        </div>

        {/* INPUT AREA */}
        <div className="flex-shrink-0
          bg-[var(--color-surface)]
          border border-[var(--color-border)]
          rounded-2xl p-3 shadow-sm">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
              disabled={loading}
              rows={1}
              autoFocus
              className="flex-1 resize-none rounded-xl
                bg-[var(--color-surface-2)]
                border border-[var(--color-border)]
                text-[var(--color-text-primary)]
                placeholder:text-[var(--color-text-muted)]
                px-4 py-3 text-sm
                focus:outline-none focus:ring-2
                focus:ring-[#F4A100]/50
                focus:border-[#F4A100]
                disabled:opacity-50 transition-all
                max-h-36 overflow-y-auto"
              style={{ minHeight: '48px' }}
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 144) + 'px';
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-xl flex-shrink-0
                flex items-center justify-center
                bg-[#F4A100] text-white
                hover:bg-[#FFB733] hover:scale-105
                disabled:opacity-40
                disabled:cursor-not-allowed
                disabled:hover:scale-100
                transition-all shadow-sm">
              <Send size={18}/>
            </button>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)]
            mt-2 text-center">
            Enter to send · Shift+Enter for new line ·
            Unlimited messages
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
