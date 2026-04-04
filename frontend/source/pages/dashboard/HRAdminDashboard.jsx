import React from 'react';
import { Users, FileUser, CalendarCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const HRAdminDashboard = () => {
  const { t } = useAppContext();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>HR Administration</h2>
          <p className={t.textMuted}>Department analytics, intern tracking, and company-wide attendance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl ${t.card}`}>
           <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Users className="text-purple-500 w-6 h-6" />
            </div>
            <div><h3 className={`font-semibold ${t.textMain}`}>Active Interns</h3></div>
          </div>
        </div>
        <div className={`p-6 rounded-2xl ${t.card}`}>
           <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <CalendarCheck className="text-emerald-500 w-6 h-6" />
            </div>
            <div><h3 className={`font-semibold ${t.textMain}`}>Global Attendance</h3></div>
          </div>
        </div>
        <div className={`p-6 rounded-2xl ${t.card}`}>
           <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <FileUser className="text-amber-500 w-6 h-6" />
            </div>
            <div><h3 className={`font-semibold ${t.textMain}`}>Onboarding Status</h3></div>
          </div>
        </div>
      </div>
      
      <div className={`p-10 rounded-2xl text-center border-dashed ${t.card}`}>
        <p className={t.textMuted}>HR Directory and department filtering modules will manifest here.</p>
      </div>
    </div>
  );
};

