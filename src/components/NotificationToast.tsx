import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, removeNotification, t } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 ltr:right-4 rtl:left-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {notifications.slice(0, 3).map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto bg-neutral-900 text-white rounded-2xl p-4 shadow-2xl border border-neutral-700/80 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5"
        >
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            {notif.type === 'ALERT' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
          </div>

          <div className="flex-1 text-right rtl:text-right ltr:text-left">
            <h5 className="text-xs font-bold text-white mb-0.5">{notif.title}</h5>
            <p className="text-[11px] text-neutral-300 leading-relaxed">{notif.message}</p>
            <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
              {notif.timestamp}
            </span>
          </div>

          <button
            onClick={() => removeNotification(notif.id)}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
