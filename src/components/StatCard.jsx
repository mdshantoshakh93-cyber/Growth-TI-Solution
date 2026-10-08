import React from 'react';

export function StatCard({ title, value, icon: Icon, color = 'sky', badge }) {
  const colorMap = {
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
  };

  const styleClass = colorMap[color] || colorMap.sky;

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${styleClass}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-slate-100 tracking-tight">{value}</span>
        {badge && (
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
