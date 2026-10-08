import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/client';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';
import { SearchInput } from '../components/SearchInput';
import { Filter } from '../components/Filter';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Modal } from '../components/Modal';
import { Mail, CheckCircle, MailOpen, Reply, Archive, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

export function Messages() {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Fetch Messages from REST API
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['contact_messages'],
    queryFn: () => adminApi.getCollection('messages'),
  });

  // 2. Update Mutation (Status Changes)
  const updateMutation = useMutation({
    mutationFn: ({ id, item }) => adminApi.updateItem('messages', id, item),
    onSuccess: () => {
      queryClient.invalidateQueries(['contact_messages']);
      queryClient.invalidateQueries(['adminStats']);
      showToast('Message status updated!');
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteItem('messages', id),
    onSuccess: () => {
      queryClient.invalidateQueries(['contact_messages']);
      queryClient.invalidateQueries(['adminStats']);
      setDeleteTarget(null);
      if (selectedMessage?.id === deleteTarget?.id) setSelectedMessage(null);
      showToast('Message deleted successfully!');
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  const rawMessages = data?.data || [];

  const filteredMessages = useMemo(() => {
    return rawMessages.filter((msg) => {
      if (searchQuery) {
        const text = `${msg.name} ${msg.email} ${msg.subject} ${msg.message}`.toLowerCase();
        if (!text.includes(searchQuery.toLowerCase())) return false;
      }
      if (statusFilter && msg.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [rawMessages, searchQuery, statusFilter]);

  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMessages.slice(start, start + pageSize);
  }, [filteredMessages, currentPage, pageSize]);

  const handleMarkStatus = (msg, newStatus) => {
    updateMutation.mutate({
      id: msg.id,
      item: { ...msg, status: newStatus }
    });
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage({ ...selectedMessage, status: newStatus });
    }
  };

  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'name', label: 'Sender', render: (val, item) => (
      <div>
        <div className="font-semibold text-slate-100">{val}</div>
        <div className="text-[10px] text-slate-400">{item.email}</div>
      </div>
    )},
    { key: 'subject', label: 'Subject', render: (val) => (
      <div className="font-medium text-slate-200 max-w-xs truncate">{val}</div>
    )},
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'unread'} /> },
    { key: 'created_at', label: 'Received', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 shadow-xl ${
            toast.type === 'error'
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Client Contact Messages</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {filteredMessages.length} Messages
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage, filter, reply and archive client inquiries in real-time.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search by name, email, subject..." />
          <Filter
            value={statusFilter}
            onChange={setStatusFilter}
            options={['unread', 'read', 'replied', 'archived']}
            label="Status Filter"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingState message="Loading Contact Messages..." />}

      {/* Error State */}
      {isError && (
        <div className="p-6 glass-panel rounded-3xl border border-rose-500/30 text-center text-rose-400 text-xs">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-400" />
          <p>Failed to communicate with REST API: {error.message}</p>
        </div>
      )}

      {/* Main Table + Preview split view */}
      {!isLoading && !isError && (
        <>
          {filteredMessages.length === 0 ? (
            <EmptyState
              title="No Messages Found"
              message={searchQuery || statusFilter ? 'No messages match your active filters.' : 'Your inbox is clear. Client inquiries submitted via website forms will appear here.'}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Message Table list (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <DataTable
                  columns={columns}
                  data={paginatedMessages}
                  onEdit={(msg) => {
                    setSelectedMessage(msg);
                    if (msg.status === 'unread') {
                      handleMarkStatus(msg, 'read');
                    }
                  }}
                  onDelete={(msg) => setDeleteTarget(msg)}
                />
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredMessages.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              </div>

              {/* Message Detail Card (1 col) */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                {selectedMessage ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-100">{selectedMessage.subject || 'No Subject'}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Received {new Date(selectedMessage.created_at).toLocaleString()}</p>
                      </div>
                      <StatusBadge status={selectedMessage.status} />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <div className="text-xs">
                        <span className="text-slate-400 font-semibold">From:</span>{' '}
                        <strong className="text-slate-200">{selectedMessage.name}</strong>
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-400 font-semibold">Email:</span>{' '}
                        <a href={`mailto:${selectedMessage.email}`} className="text-sky-400 hover:underline">{selectedMessage.email}</a>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed min-h-[140px] whitespace-pre-wrap font-sans">
                      {selectedMessage.message}
                    </div>

                    {/* Status Action Buttons */}
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleMarkStatus(selectedMessage, 'unread')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Mark Unread</span>
                      </button>
                      <button
                        onClick={() => handleMarkStatus(selectedMessage, 'read')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MailOpen className="w-3.5 h-3.5" />
                        <span>Mark Read</span>
                      </button>
                      <button
                        onClick={() => handleMarkStatus(selectedMessage, 'replied')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>Mark Replied</span>
                      </button>
                      <button
                        onClick={() => handleMarkStatus(selectedMessage, 'archived')}
                        className="px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/25 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Archive</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(selectedMessage)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                    <Mail className="w-8 h-8 mb-2 opacity-50 text-sky-400" />
                    <p className="text-xs font-medium text-slate-400">Select a message to view full details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
        title="Delete Message"
        message={`Are you sure you want to delete message from ${deleteTarget?.name}?`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
