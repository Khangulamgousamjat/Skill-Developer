import { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../api/axios';

export default function AIChatbot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your SSLLM Assistant. How can I help you with your learning journey today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const res = await axiosInstance.post('/ai/ask', { prompt: currentInput });
      if (res.data.success) {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          content: res.data.data.text 
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "I'm sorry, I encountered an error. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-[var(--color-surface)]/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-surface)]/20 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold font-sora text-sm">SSLLM AI Assistant</h3>
                  <p className="text-[10px] opacity-80">Always here to help</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[var(--color-surface)]/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-accent)]'
                    }`}>
                      {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-[var(--color-primary)] text-white rounded-tr-none' 
                        : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-tl-none border border-[var(--color-border)]'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-[var(--color-surface-2)] p-3 rounded-2xl rounded-tl-none border border-[var(--color-border)]">
                      <Loader2 size={16} className="animate-spin text-[var(--color-primary)] opacity-50" />
                   </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-2)]/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl pl-4 pr-12 py-3 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-all"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1.5 p-2 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors ${
          isOpen ? 'bg-red-500 text-white' : 'bg-[var(--color-primary)] text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
           <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce" />
        )}
      </motion.button>
    </div>
  );
}

