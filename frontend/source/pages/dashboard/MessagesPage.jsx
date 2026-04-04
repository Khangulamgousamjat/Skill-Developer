import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useSocket } from '../../context/SocketContext';
import { useSelector } from 'react-redux';
import { Send, User } from 'lucide-react';

export const MessagesPage = () => {
  const { t, isDarkMode } = useAppContext();
  const { socket } = useSocket();
  const { user } = useSelector(state => state.auth);

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  
  // Dummy contacts for demonstration. In a real app, fetch /api/users
  const contacts = [
    { id: '123-admin', name: 'HR Department', role: 'hr_admin' },
    { id: '456-manager', name: 'Tech Lead', role: 'manager' },
  ];

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    
    const handleReceive = (data) => {
      setMessages(prev => [...prev, data]);
    };

    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat || !socket) return;

    const newMsg = {
      senderId: user?.id,
      senderName: user?.first_name || 'Me',
      receiverId: activeChat.id,
      message: messageInput,
      timestamp: new Date().toISOString()
    };

    // Emit through websocket directly
    socket.emit('send_message', newMsg);
    
    // Optimistically push to own UI state
    setMessages(prev => [...prev, newMsg]);
    setMessageInput('');
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-fade-in">
       {/* Contacts Sidebar */}
       <div className={`w-80 flex flex-col rounded-2xl overflow-hidden ${t.card}`}>
          <div className="p-4 border-b dark:border-white/10 border-[var(--color-border)]">
             <h3 className={`font-bold text-lg font-sora ${t.textMain}`}>Directory</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y dark:divide-white/5 divide-gray-100">
             {contacts.map(c => (
               <div 
                 key={c.id}
                 onClick={() => setActiveChat(c)}
                 className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${activeChat?.id === c.id ? (isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-50') : t.hover}`}
               >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <User className="w-5 h-5"/>
                  </div>
                  <div>
                    <h4 className={`font-bold ${t.textMain}`}>{c.name}</h4>
                    <p className={`text-xs uppercase tracking-wider text-indigo-500 font-bold`}>{c.role}</p>
                  </div>
               </div>
             ))}
          </div>
       </div>

       {/* Chat Window */}
       <div className={`flex-1 flex flex-col rounded-2xl overflow-hidden ${t.card}`}>
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b dark:border-white/10 border-[var(--color-border)] flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <User className="w-5 h-5"/>
                 </div>
                 <div>
                   <h3 className={`font-bold text-lg ${t.textMain}`}>{activeChat.name}</h3>
                   <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                     Online
                   </span>
                 </div>
              </div>

              {/* Msg Thread */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                 {messages.filter(m => m.receiverId === activeChat.id || m.senderId === activeChat.id).map((m, i) => {
                    const isMe = m.senderId === user?.id;
                    return (
                      <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[70%] p-4 rounded-2xl ${
                            isMe ? 'bg-indigo-600 text-white rounded-br-none' 
                                 : isDarkMode ? 'bg-[var(--color-surface)]/10 text-white rounded-bl-none' : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-bl-none'
                         }`}>
                            <p>{m.message}</p>
                            <span className={`text-[10px] mt-2 block ${isMe ? 'text-indigo-200' : t.textMuted}`}>
                              {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                         </div>
                      </div>
                    )
                 })}
                 <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t dark:border-white/10 border-[var(--color-border)]">
                 <div className={`flex items-center gap-2 p-2 rounded-xl border focus-within:ring-2 focus-within:ring-indigo-500 ${isDarkMode ? 'bg-[var(--color-surface)]/5 border-white/10' : 'bg-[var(--color-surface)] border-[var(--color-border)]'}`}>
                    <input 
                      type="text"
                      className={`flex-1 bg-transparent border-none outline-none px-3 ${t.textMain}`}
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-transform active:scale-95"
                    >
                      <Send className="w-4 h-4"/>
                    </button>
                 </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex flex-col justify-center items-center text-center p-10">
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex flex-col justify-center items-center mb-4">
                   <Send className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className={`text-xl font-bold font-sora ${t.textMain}`}>Your Secure Inbox</h3>
                <p className={`mt-2 ${t.textMuted} max-w-sm`}>Select a contact from your directory to begin a live, encrypted websocket chat.</p>
             </div>
          )}
       </div>
    </div>
  );
};

export default MessagesPage;

