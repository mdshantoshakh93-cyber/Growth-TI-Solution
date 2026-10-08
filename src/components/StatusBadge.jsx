import React from 'react';

export function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = String(status).toLowerCase();

  let styles = 'bg-slate-800 text-slate-300 border-slate-700';

  if (['published', 'active', 'replied', 'success', 'approved'].includes(normalized)) {
    styles = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  } else if (['draft', 'pending', 'unread', 'warning'].includes(normalized)) {
    styles = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  } else if (['archived', 'closed', 'read', 'inactive'].includes(normalized)) {
    styles = 'bg-purple-500/15 text-purple-400 border-purple-500/30';
  } else if (['error', 'failed', 'rejected', 'deleted'].includes(normalized)) {
    styles = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize tracking-wide ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{status}</span>
    </span>
  );
}
