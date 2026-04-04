import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Bell, X, Check, Info, AlertTriangle, Zap } from 'lucide-react';

export const NotificationCenter = ({ isOpen, onClose }) => {
  const { t, notifications, setNotifications, isDarkMode } = useAppContext();

  if (!isOpen) return null;

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const icons = {
    PROJECT_ASSIGNED: Zap,
    LECTURE_REMINDER: Bell,
    ROLE_APPROVED: Check,
    SYSTEM_ALERT: AlertTriangle,
  };

  return (
    <div className="fixed top-20 right-4 z-[110] w-80 max-h-[500px] flex flex-col pointer-events-auto animate-slide-up">
       <div className={`flex flex-col h-full rounded-2xl shadow-2xl border ${t.modalBg}`}>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
             <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                <h3 className={`font-bold text-sm ${t.textMain}`}>Notifications</h3>
             </div>
             <div className="flex items-center gap-2">
                <button onClick={clearAll} className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest">Clear All</button>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--color-surface)]/5 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
             {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                   <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                   <p className="text-xs">No notifications yet</p>
                </div>
             ) : (
                <div className="space-y-1">
                   {notifications.map(n => {
                      const Icon = icons[n.type] || Info;
                      return (
                         <div 
                           key={n.id} 
                           onClick={() => markRead(n.id)}
                           className={`p-3 rounded-xl transition-all cursor-pointer relative group ${n.read ? 'opacity-60' : `${t.hover} bg-[var(--color-surface)]/5`}`}
                         >
                            <div className="flex items-start gap-3">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.read ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-500'}`}>
                                  <Icon className="w-4 h-4" />
                               </div>
                               <div className="flex-1">
                                  <p className={`text-xs leading-relaxed ${t.textMain} ${!n.read ? 'font-bold' : 'font-medium'}`}>{n.message}</p>
                                  <span className="text-[10px] text-slate-500 mt-1 block">Just now</span>
                               </div>
                            </div>
                            {!n.read && <div className="absolute top-1/2 right-3 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
                         </div>
                      );
                   })}
                </div>
             )}
          </div>
          <div className="p-3 bg-black/20 text-center rounded-b-2xl border-t border-white/10">
             <p className="text-[10px] text-slate-500">Stay updated on Gous org activities.</p>
          </div>
       </div>
    </div>
  );
};

