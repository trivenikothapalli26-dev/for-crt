import React from 'react';
import { Fingerprint, Trash2, ShieldCheck, AlertCircle, Info, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuditLogTab: React.FC = () => {
  const { auditLogs, clearAuditLogs, currentUser } = useAuth();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'security':
        return <Fingerprint className="w-4 h-4 text-indigo-600 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'security':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-indigo-600" />
            <span>Security Activity &amp; Audit Trail</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time audit log of authenticated actions, token state changes, and verification checks.
          </p>
        </div>

        {auditLogs.length > 0 && (
          <button
            onClick={clearAuditLogs}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {auditLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <span>No activity logs captured yet in this browser session.</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(log.type)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm">{log.action}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider ${getBadgeClass(log.type)}`}>
                        {log.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{log.details}</p>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 whitespace-nowrap shrink-0">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
