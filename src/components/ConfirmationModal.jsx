import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';

export function ConfirmationModal({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure you want to proceed?', isPending = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4 text-xs text-slate-300">
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <p className="leading-relaxed">{message}</p>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 rounded-xl bg-rose-500 text-slate-950 font-bold hover:bg-rose-400 flex items-center gap-1.5 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
