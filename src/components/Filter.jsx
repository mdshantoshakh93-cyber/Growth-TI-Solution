import React from 'react';
import { Filter as FilterIcon } from 'lucide-react';

export function Filter({ value, onChange, options = [], label = 'Filter Status' }) {
  return (
    <div className="flex items-center gap-1.5 glass-input px-3 py-1.5 rounded-xl text-xs text-slate-300 border border-slate-800 bg-slate-900/60">
      <FilterIcon className="w-3.5 h-3.5 text-slate-400" />
      <span className="text-[11px] text-slate-400 hidden sm:inline">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
      >
        <option value="" className="bg-slate-900 text-slate-200">All Items</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt} className="bg-slate-900 text-slate-200">
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );
}
