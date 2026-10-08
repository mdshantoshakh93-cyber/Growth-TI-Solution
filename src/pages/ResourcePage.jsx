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
import { RichTextEditor } from '../components/RichTextEditor';
import { Modal } from '../components/Modal';
import { Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ResourcePage({
  title,
  collectionName,
  columns = [],
  fields = [],
  defaultItem = {},
  statusOptions = ['published', 'draft', 'archived'],
  categoryOptions = []
}) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultItem);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Search, Filter, Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Fetch Real Data from Backend REST API
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [collectionName],
    queryFn: () => adminApi.getCollection(collectionName),
  });

  // 2. Create Mutation
  const createMutation = useMutation({
    mutationFn: (newItem) => adminApi.createItem(collectionName, newItem),
    onSuccess: () => {
      queryClient.invalidateQueries([collectionName]);
      queryClient.invalidateQueries(['adminStats']);
      setIsModalOpen(false);
      showToast(`${title} item created successfully!`);
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  // 3. Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, item }) => adminApi.updateItem(collectionName, id, item),
    onSuccess: () => {
      queryClient.invalidateQueries([collectionName]);
      queryClient.invalidateQueries(['adminStats']);
      setIsModalOpen(false);
      setEditingId(null);
      showToast(`${title} item updated successfully!`);
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  // 4. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteItem(collectionName, id),
    onSuccess: () => {
      queryClient.invalidateQueries([collectionName]);
      queryClient.invalidateQueries(['adminStats']);
      setDeleteTarget(null);
      showToast(`${title} item deleted successfully!`);
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  // Handlers
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(defaultItem);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    // Format array fields as comma-separated strings for input fields
    const formatted = { ...item };
    fields.forEach((f) => {
      if (f.type === 'array' && Array.isArray(formatted[f.key])) {
        formatted[f.key] = formatted[f.key].join(', ');
      }
    });
    setFormData(formatted);
    setIsModalOpen(true);
  };

  const handleStatusChange = (item, newStatus) => {
    updateMutation.mutate({
      id: item.id,
      item: { ...item, status: newStatus },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };

    // Convert comma-separated string back to array for array fields
    fields.forEach((f) => {
      if (f.type === 'array' && typeof payload[f.key] === 'string') {
        payload[f.key] = payload[f.key]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (f.type === 'number') {
        payload[f.key] = Number(payload[f.key]) || 0;
      }
      if (f.type === 'boolean') {
        payload[f.key] = Boolean(payload[f.key]);
      }
    });

    if (editingId) {
      updateMutation.mutate({ id: editingId, item: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Filtered and Paginated Items
  const rawItems = data?.data || [];
  const filteredItems = useMemo(() => {
    return rawItems.filter((item) => {
      // Search check
      if (searchQuery) {
        const text = JSON.stringify(item).toLowerCase();
        if (!text.includes(searchQuery.toLowerCase())) return false;
      }
      // Status check
      if (statusFilter && item.status !== statusFilter) {
        return false;
      }
      // Category check
      if (categoryFilter && item.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [rawItems, searchQuery, statusFilter, categoryFilter]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Default Column Spec if none provided
  const tableColumns = useMemo(() => {
    if (columns.length > 0) return columns;

    return [
      { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
      { key: 'title', label: 'Title / Name', render: (val, item) => item.title || item.name || val },
      { key: 'category', label: 'Category' },
      { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'active'} /> },
      { key: 'created_at', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
    ];
  }, [columns]);

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
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">{title} Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {filteredItems.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time REST API persistence with MongoDB data store.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder={`Search ${title.toLowerCase()}...`} />

          {statusOptions.length > 0 && (
            <Filter value={statusFilter} onChange={setStatusFilter} options={statusOptions} label="Status" />
          )}

          {categoryOptions.length > 0 && (
            <Filter value={categoryFilter} onChange={setCategoryFilter} options={categoryOptions} label="Category" />
          )}

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New {title}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingState message={`Loading ${title} collection...`} />}

      {/* Error State */}
      {isError && (
        <div className="p-6 glass-panel rounded-3xl border border-rose-500/30 text-center text-rose-400 text-xs">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-400" />
          <p>Failed to communicate with REST API: {error.message}</p>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !isError && (
        <>
          {filteredItems.length === 0 ? (
            <EmptyState
              title={`No ${title} Records Found`}
              message={searchQuery || statusFilter ? 'No items match your search filter criteria.' : `Get started by creating your first ${title} entry.`}
              onAction={handleOpenAdd}
              actionLabel={`Add ${title}`}
            />
          ) : (
            <div className="space-y-4">
              <DataTable
                columns={tableColumns}
                data={paginatedItems}
                onEdit={handleOpenEdit}
                onDelete={(item) => setDeleteTarget(item)}
                onStatusChange={handleStatusChange}
              />
              <Pagination
                currentPage={currentPage}
                totalItems={filteredItems.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${editingId ? 'Edit' : 'Create New'} ${title}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div
                key={f.key}
                className={f.fullWidth || f.type === 'richtext' || f.type === 'textarea' ? 'md:col-span-2' : ''}
              >
                <label className="block text-slate-300 font-semibold mb-1">
                  {f.label} {f.required && <span className="text-rose-400">*</span>}
                </label>

                {f.type === 'richtext' ? (
                  <RichTextEditor
                    value={formData[f.key] ?? ''}
                    onChange={(val) => setFormData({ ...formData, [f.key]: val })}
                    placeholder={f.placeholder || `Enter rich content for ${f.label}...`}
                  />
                ) : f.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={formData[f.key] ?? ''}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full glass-input rounded-xl p-3 text-slate-100 placeholder:text-slate-500"
                  />
                ) : f.type === 'select' ? (
                  <select
                    value={formData[f.key] ?? (f.options?.[0]?.value || f.options?.[0] || '')}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="w-full glass-input rounded-xl p-2.5 text-slate-100 bg-slate-900 border border-slate-700"
                  >
                    {f.options?.map((opt) => {
                      const val = opt.value || opt;
                      const lbl = opt.label || opt;
                      return <option key={val} value={val}>{lbl}</option>;
                    })}
                  </select>
                ) : f.type === 'boolean' ? (
                  <label className="flex items-center gap-2 p-2.5 glass-input rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData[f.key])}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0"
                    />
                    <span className="text-slate-300 font-semibold">{f.placeholder || 'Enable Option'}</span>
                  </label>
                ) : (
                  <input
                    type={f.type || 'text'}
                    value={formData[f.key] ?? ''}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    placeholder={f.placeholder || (f.type === 'array' ? 'Comma separated values...' : '')}
                    className="w-full glass-input rounded-xl p-2.5 text-slate-100 placeholder:text-slate-500"
                  />
                )}
                {f.hint && <p className="text-[10px] text-slate-500 mt-1">{f.hint}</p>}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-5 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
            >
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingId ? 'Update Record' : 'Save New Record'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
        title="Delete Confirmation"
        message={`Are you sure you want to permanently delete record ${deleteTarget?.title || deleteTarget?.name || deleteTarget?.id}?`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
