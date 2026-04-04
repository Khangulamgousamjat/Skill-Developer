import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, RotateCcw, Copy, Check } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

// Format markdown-like text in AI responses
function MessageContent({ text }) {
  // Split by code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="text-sm leading-relaxed space-y-2">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
          return (
            <pre key={i}
              className="bg-black/20 dark:bg-black/40
                rounded-lg p-3 overflow-x-auto text-xs
                font-mono whitespace-pre-wrap border
                border-white/10">
              {code}
            </pre>
          );
        }
        // Bold text
        const boldParts = part.split(/(\*\*.*?\*\*)/g);
        return (
          <span key={i}>
            {boldParts.map((bp, j) => {
              if (bp.startsWith('**') && bp.endsWith('**')) {
                return <strong key={j} className="font-semibold">
                  {bp.slice(2,-2)}
                </strong>;
              }
              return <span key={j}>{bp}</span>;
            })}
          </span>
        );
      })}
    </div>
  );
}

export default function ChatBot() {
  const { user } = useSelector(s => s.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatHistory = useRef([]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = {
        id: 'welcome',
        sender: 'ai',
        text: `Hi ${user?.full_name?.split(' ')[0] || 'there'}! 👋\n\nI'm your AI learning assistant. I can help you with:\n- **Programming doubts** — any language or framework\n- **Concept explanations** — with examples and code\n- **Learning guidance** — what to study next\n- **Career questions** — tech career advice\n- **Project help** — debugging and architecture\n\nAsk me anything! I'm here to help, 24/7. 🚀`,
        timestamp: new Date()
      };
      setMessages([welcome]);
    }
  }, [isOpen, messages.length, user]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text || loading) return;

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    // Update history for context
    chatHistory.current.push({
      role: 'user',
      content: text
    });

    try {
      const res = await axiosInstance.post('/ai/chat', {
        message: text,
        history: chatHistory.current.slice(-20)
      });

      const reply = res.data.data.reply;

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);

      // Add to history
      chatHistory.current.push({
        role: 'assistant',
        content: reply
      });

    } catch (err) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: err.response?.data?.message
          || 'Sorry, something went wrong. Please try again.',
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      chatHistory.current.pop(); // remove failed user message from history
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [inputText, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    chatHistory.current = [];
    setTimeout(() => {
      const welcome = {
        id: 'welcome-new',
        sender: 'ai',
        text: `Chat cleared! 🗑️ How can I help you today?`,
        timestamp: new Date()
      };
      setMessages([welcome]);
    }, 100);
  };

  const copyMessage = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const panelWidth = isExpanded ? 'w-[680px]' : 'w-[380px]';
  const panelHeight = isExpanded ? 'h-[85vh]' : 'h-[580px]';

  return (
    <>
      {/* FLOATING BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Tooltip on hover (hidden when open) */}
        {!isOpen && (
          <div className="bg-[#1E3A5F] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
            AI Learning Assistant
          </div>
        )}

        {/* Main button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-[#F4A100] text-white shadow-2xl hover:bg-[#FFB733] hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        >
          {/* Pulsing ring animation */}
          {!isOpen && (
            <span className="absolute inline-flex w-full h-full rounded-full bg-[#F4A100] opacity-40 animate-ping"/>
          )}
          {isOpen ? <X size={22} /> : <MessageCircle size={22} />}

          {/* "AI" badge */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
              AI
            </span>
          )}
        </button>
      </div>

      {/* CHAT PANEL */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-40 ${panelWidth} ${panelHeight} bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2E5490] px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* AI Avatar */}
                <div className="w-9 h-9 rounded-xl bg-[#F4A100]/20 border border-[#F4A100]/40 flex items-center justify-center">
                  <Sparkles size={18} className="text-[#F4A100]"/>
                </div>
                <div>
                  <p className="text-white font-sora font-semibold text-sm leading-tight">
                    AI Learning Assistant
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                    <p className="text-white/60 text-xs">Online — Unlimited chats</p>
                  </div>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex items-center gap-1">
                {/* Expand/collapse */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-mono"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? '⊡' : '⊞'}
                </button>

                {/* Clear chat */}
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  title="Clear chat"
                >
                  <RotateCcw size={14}/>
                </button>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={16}/>
                </button>
              </div>
            </div>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-surface)]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 group ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex-shrink-0 mt-1 flex items-center justify-center text-xs font-bold ${msg.sender === 'user' ? 'bg-[#F4A100] text-white' : 'bg-[#1E3A5F] text-white'}`}>
                  {msg.sender === 'user' ? user?.full_name?.charAt(0)?.toUpperCase() || 'U' : <Sparkles size={12}/>}
                </div>

                {/* Message bubble */}
                <div className={`relative max-w-[80%] px-3.5 py-2.5 rounded-2xl ${msg.sender === 'user' ? 'bg-[#F4A100] text-white rounded-tr-sm' : msg.isError ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-[var(--color-text-primary)] rounded-tl-sm' : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-tl-sm border border-[var(--color-border)]'}`}>
                  {msg.sender === 'ai' ? <MessageContent text={msg.text}/> : <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                  {/* Timestamp + copy button */}
                  <div className={`flex items-center gap-2 mt-1.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-between'}`}>
                    <span className={`text-[10px] ${msg.sender === 'user' ? 'text-white/60' : 'text-[var(--color-text-muted)]'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.sender === 'ai' && !msg.isError && (
                      <button
                        onClick={() => copyMessage(msg.id, msg.text)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                      >
                        {copiedId === msg.id ? <Check size={10}/> : <Copy size={10}/>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading animation */}
            {loading && (
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-[#1E3A5F] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={12} className="text-white"/>
                </div>
                <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-bounce [animation-delay:0ms]"/>
                    <span className="w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-bounce [animation-delay:150ms]"/>
                    <span className="w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-bounce [animation-delay:300ms]"/>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}/>
          </div>

          {/* SUGGESTED QUESTIONS (show when no messages) */}
          {messages.length <= 1 && !loading && (
            <div className="px-4 pb-3 flex-shrink-0">
              <p className="text-[var(--color-text-muted)] text-xs mb-2 font-medium">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {["Explain React hooks", "How to learn Python fast?", "What is DSA?", "Debug my code"].map((q) => (
                  <button key={q} onClick={() => setInputText(q)} className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[#F4A100] hover:text-[#F4A100] hover:bg-[#F4A100]/5 transition-all">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INPUT AREA */}
          <div className="border-t border-[var(--color-border)] px-3 py-3 flex-shrink-0 bg-[var(--color-surface)]">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything... (Enter to send)"
                disabled={loading}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4A100]/50 focus:border-[#F4A100] disabled:opacity-50 max-h-32 overflow-y-auto transition-all"
                style={{ fieldSizing: 'content', minHeight: '42px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || loading}
                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-[#F4A100] text-white hover:bg-[#FFB733] disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-sm"
              >
                <Send size={16}/>
              </button>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-2 text-center">
              Shift+Enter for new line • Enter to send • Unlimited messages
            </p>
          </div>
        </div>
      )}

      {/* Slide up animation */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
