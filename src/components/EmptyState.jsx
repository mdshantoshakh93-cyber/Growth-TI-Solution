import React from 'react';
import { Database, Plus } from 'lucide-react';

export function EmptyState({ title = 'No records found', message = 'No data available in this collection.', onAction, actionLabel = 'Create New' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-panel rounded-3xl border border-slate-800/80">
      <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 shadow-inner">
        <Database className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-100 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">{message}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
