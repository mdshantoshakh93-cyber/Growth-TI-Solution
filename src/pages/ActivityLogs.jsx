import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/client';
import { History, Clock, Loader2, AlertCircle } from 'lucide-react';

export function ActivityLogs() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: adminApi.getActivityLogs,
    refetchInterval: 5000,
  });

  const logs = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-sky-400" />
          <span>System Activity Audit Logs</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time audit trail of user actions, database mutations, and security events.</p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400 mb-2" />
          <p className="text-xs">Fetching Audit Logs...</p>
        </div>
      )}

      {isError && (
        <div className="p-6 glass-panel rounded-2xl border border-rose-500/30 text-center text-rose-400 text-xs">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-400" />
          <p>Failed to load activity logs: {error.message}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden p-6">
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No activity logs recorded yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200">{log.action}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {log.performed_by}
                      </span>
                    </div>
                    <p className="text-slate-400">{log.details}</p>
                  </div>
                  <div className="text-right shrink-0 text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
