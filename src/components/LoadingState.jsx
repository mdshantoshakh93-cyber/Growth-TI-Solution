import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading Data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400 glass-panel rounded-3xl border border-slate-800">
      <Loader2 className="w-8 h-8 animate-spin text-sky-400 mb-3" />
      <p className="text-xs font-semibold text-slate-300 tracking-wide">{message}</p>
      <span className="text-[10px] text-slate-500 mt-1">Connecting to REST API Engine...</span>
    </div>
  );
}
