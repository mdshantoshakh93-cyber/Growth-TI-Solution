import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Edit3, Trash2, CheckCircle, XCircle, Archive, FileText } from 'lucide-react';

export function DataTable({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onStatusChange,
  keyField = 'id',
  selectable = false,
  selectedIds = [],
  onSelectToggle,
  onSelectAll
}) {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  const handleSort = (fieldKey) => {
    if (sortField === fieldKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(fieldKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const allSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              {selectable && (
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`p-4 ${col.sortable !== false ? 'cursor-pointer hover:text-slate-200 select-none' : ''} ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                  }`}
                >
                  <div className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    <span>{col.label}</span>
                    {col.sortable !== false && sortField === col.key && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-sky-400" /> : <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onStatusChange) && (
                <th className="p-4 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {sortedData.map((row) => {
              const rowId = row[keyField];
              const isSelected = selectedIds.includes(rowId);

              return (
                <tr
                  key={rowId}
                  className={`hover:bg-slate-900/50 transition-colors ${
                    isSelected ? 'bg-sky-500/5' : ''
                  }`}
                >
                  {selectable && (
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectToggle && onSelectToggle(rowId)}
                        className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0 cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`p-4 text-slate-200 ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                      }`}
                    >
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                  {(onEdit || onDelete || onStatusChange) && (
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Status Action Buttons */}
                      {onStatusChange && (
                        <>
                          {row.status !== 'published' && (
                            <button
                              onClick={() => onStatusChange(row, 'published')}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                              title="Publish"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {row.status === 'published' && (
                            <button
                              onClick={() => onStatusChange(row, 'draft')}
                              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors"
                              title="Unpublish (Draft)"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {row.status !== 'archived' && (
                            <button
                              onClick={() => onStatusChange(row, 'archived')}
                              className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-colors"
                              title="Archive"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}

                      {/* Edit Button */}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                          title="Edit Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete Button */}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
