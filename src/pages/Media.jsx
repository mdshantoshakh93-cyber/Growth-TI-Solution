import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/client';
import { SearchInput } from '../components/SearchInput';
import { Filter } from '../components/Filter';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { Modal } from '../components/Modal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  UploadCloud,
  Grid,
  List as ListIcon,
  Copy,
  Check,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  FileImage,
  Cloud,
  HardDrive,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export function Media() {
  const queryClient = useQueryClient();

  // State
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Modals & Active selections
  const [previewItem, setPreviewItem] = useState(null);
  const [renameItem, setRenameItem] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteUsageWarning, setDeleteUsageWarning] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Fetch Media items
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['media'],
    queryFn: () => adminApi.getCollection('media'),
  });

  // 2. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteItem('media', id),
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
      setDeleteTarget(null);
      setDeleteUsageWarning(null);
      if (previewItem?.id === deleteTarget?.id) setPreviewItem(null);
      showToast('Media asset deleted successfully!');
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  // 3. Rename Mutation
  const renameMutation = useMutation({
    mutationFn: ({ id, name }) => adminApi.renameMedia(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
      setRenameItem(null);
      showToast('Media asset renamed!');
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  // Handlers
  const handleCopyUrl = (url) => {
    const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    showToast('Image URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              await adminApi.uploadMedia(e.target.result, file.name, file.type);
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      queryClient.invalidateQueries(['media']);
      showToast(`${files.length} image(s) uploaded successfully!`);
    } catch (err) {
      showToast(err.message || 'Failed to upload media asset.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleInitiateDelete = async (item) => {
    setDeleteTarget(item);
    try {
      const refCheck = await adminApi.checkMediaReferences(item.id);
      if (refCheck.isUsed) {
        setDeleteUsageWarning(refCheck);
      } else {
        setDeleteUsageWarning(null);
      }
    } catch (err) {
      setDeleteUsageWarning(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected assets?`)) {
      for (const id of selectedIds) {
        await adminApi.deleteItem('media', id);
      }
      setSelectedIds([]);
      queryClient.invalidateQueries(['media']);
      showToast(`${selectedIds.length} assets deleted.`);
    }
  };

  const rawMedia = data?.data || [];

  const filteredMedia = useMemo(() => {
    return rawMedia.filter((item) => {
      if (searchQuery) {
        const text = `${item.file_name} ${item.file_url} ${item.file_type}`.toLowerCase();
        if (!text.includes(searchQuery.toLowerCase())) return false;
      }
      if (typeFilter && !item.file_type?.toLowerCase().includes(typeFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [rawMedia, searchQuery, typeFilter]);

  const paginatedMedia = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMedia.slice(start, start + pageSize);
  }, [filteredMedia, currentPage, pageSize]);

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
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Media Library</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {filteredMedia.length} Assets
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Cloudinary & Local Storage Engine with safe dependency tracking.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search assets by filename..." />

          <Filter
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { label: 'JPEG Images', value: 'jpeg' },
              { label: 'PNG Images', value: 'png' },
              { label: 'WebP Images', value: 'webp' }
            ]}
            label="Type"
          />

          {/* View Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Button */}
          <label className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 flex items-center gap-1.5 cursor-pointer transition-all">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="p-6 glass-panel rounded-3xl border border-dashed border-sky-500/30 hover:border-sky-500/60 bg-sky-500/5 transition-all text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
      >
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-200">Drag & Drop image files here to upload</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Supports JPG, JPEG, PNG, WEBP (Max 5MB per file)</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingState message="Loading Media Library Assets..." />}

      {/* Error State */}
      {isError && (
        <div className="p-6 glass-panel rounded-3xl border border-rose-500/30 text-center text-rose-400 text-xs">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-400" />
          <p>Failed to load media assets: {error.message}</p>
        </div>
      )}

      {/* Content Display */}
      {!isLoading && !isError && (
        <>
          {filteredMedia.length === 0 ? (
            <EmptyState
              title="No Media Assets Found"
              message={searchQuery || typeFilter ? 'No images match your active search filters.' : 'Upload your first image asset to get started.'}
            />
          ) : (
            <div className="space-y-4">
              {/* Bulk action toolbar */}
              {selectedIds.length > 0 && (
                <div className="flex items-center justify-between p-3 px-6 glass-panel rounded-2xl border border-sky-500/30 bg-sky-500/10 text-xs text-sky-300 animate-in fade-in">
                  <span><strong>{selectedIds.length}</strong> items selected</span>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-bold border border-rose-500/30 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected</span>
                  </button>
                </div>
              )}

              {/* Grid View */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {paginatedMedia.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`group relative glass-panel rounded-2xl border overflow-hidden transition-all duration-200 hover:border-sky-500/50 hover:shadow-xl ${
                          isSelected ? 'border-sky-500 ring-2 ring-sky-500/30 bg-sky-500/5' : 'border-slate-800'
                        }`}
                      >
                        {/* Checkbox badge */}
                        <div className="absolute top-2 left-2 z-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedIds((prev) =>
                                prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id]
                              );
                            }}
                            className="rounded border-slate-700 bg-slate-950/80 text-sky-500 focus:ring-0 cursor-pointer w-4 h-4"
                          />
                        </div>

                        {/* Provider badge */}
                        <div className="absolute top-2 right-2 z-10">
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 border backdrop-blur-md ${
                              item.provider === 'cloudinary'
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                : 'bg-slate-900/80 text-slate-300 border-slate-700'
                            }`}
                          >
                            {item.provider === 'cloudinary' ? <Cloud className="w-2.5 h-2.5" /> : <HardDrive className="w-2.5 h-2.5" />}
                            <span className="capitalize">{item.provider || 'local'}</span>
                          </span>
                        </div>

                        {/* Image Preview Thumbnail */}
                        <div
                          onClick={() => setPreviewItem(item)}
                          className="aspect-square w-full bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer relative"
                        >
                          <img
                            src={item.file_url}
                            alt={item.file_name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-full h-full items-center justify-center text-slate-500 flex-col gap-1">
                            <FileImage className="w-6 h-6" />
                            <span className="text-[10px]">Preview</span>
                          </div>

                          {/* Hover Action Overlay */}
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                              title="Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCopyUrl(item.file_url); }}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                              title="Copy URL"
                            >
                              {copiedUrl === item.file_url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setRenameItem(item); setNewFileName(item.file_name); }}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                              title="Rename"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleInitiateDelete(item); }}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 border border-rose-500/30"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Info Footer */}
                        <div className="p-2.5 text-xs">
                          <p className="font-semibold text-slate-200 truncate" title={item.file_name}>
                            {item.file_name}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                            <span>{item.dimensions || '800x600'}</span>
                            <span className="font-mono text-emerald-400">{item.file_size_kb || 0} KB</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* List View Table */
                <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                          <th className="p-4 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.length === paginatedMedia.length && paginatedMedia.length > 0}
                              onChange={(e) => {
                                setSelectedIds(e.target.checked ? paginatedMedia.map(m => m.id) : []);
                              }}
                              className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0"
                            />
                          </th>
                          <th className="p-4">Asset</th>
                          <th className="p-4">Dimensions</th>
                          <th className="p-4">Size</th>
                          <th className="p-4">Provider</th>
                          <th className="p-4">Uploaded By</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {paginatedMedia.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-4 text-center">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(item.id)}
                                onChange={() => {
                                  setSelectedIds(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]);
                                }}
                                className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0"
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img src={item.file_url} alt={item.file_name} className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-950" />
                                <div>
                                  <div className="font-semibold text-slate-100">{item.file_name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{item.file_url}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-slate-300">{item.dimensions || '800x600'}</td>
                            <td className="p-4 font-mono text-emerald-400">{item.file_size_kb || 0} KB</td>
                            <td className="p-4 capitalize text-slate-300">{item.provider || 'local'}</td>
                            <td className="p-4 text-slate-400">{item.uploaded_by || 'Admin'}</td>
                            <td className="p-4 text-right space-x-1.5">
                              <button
                                onClick={() => handleCopyUrl(item.file_url)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Copy URL"
                              >
                                {copiedUrl === item.file_url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => { setRenameItem(item); setNewFileName(item.file_name); }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Rename"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleInitiateDelete(item)}
                                className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalItems={filteredMedia.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}
        </>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <Modal
          isOpen={Boolean(previewItem)}
          onClose={() => setPreviewItem(null)}
          title={`Image Preview: ${previewItem.file_name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="w-full max-h-[380px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-2">
              <img src={previewItem.file_url} alt={previewItem.file_name} className="max-h-[360px] object-contain rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px]">Filename:</span>
                <strong className="text-slate-100">{previewItem.file_name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Dimensions:</span>
                <strong className="text-sky-400 font-mono">{previewItem.dimensions || '800x600'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">File Size:</span>
                <strong className="text-emerald-400 font-mono">{previewItem.file_size_kb || 0} KB</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Storage Provider:</span>
                <strong className="capitalize text-slate-200">{previewItem.provider || 'local'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Upload Date:</span>
                <span>{previewItem.uploaded_at ? new Date(previewItem.uploaded_at).toLocaleString() : 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Uploaded By:</span>
                <span>{previewItem.uploaded_by || 'Admin'}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => handleCopyUrl(previewItem.file_url)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold flex items-center gap-1.5"
              >
                {copiedUrl === previewItem.file_url ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUrl === previewItem.file_url ? 'URL Copied!' : 'Copy Asset Link'}</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold hover:bg-sky-400"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Rename Modal */}
      {renameItem && (
        <Modal
          isOpen={Boolean(renameItem)}
          onClose={() => setRenameItem(null)}
          title="Rename Media Asset"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              renameMutation.mutate({ id: renameItem.id, name: newFileName });
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block text-slate-300 font-semibold mb-1">New Filename</label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                required
                className="w-full glass-input rounded-xl p-2.5 text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRenameItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={renameMutation.isPending}
                className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 flex items-center gap-1.5"
              >
                {renameMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Name</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Safe Delete Modal with Dependency Warning */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => { setDeleteTarget(null); setDeleteUsageWarning(null); }}
        onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
        title="Delete Media Asset"
        message={
          deleteUsageWarning?.isUsed
            ? `⚠️ WARNING: This asset is currently referenced in ${deleteUsageWarning.usageCount} location(s) (${deleteUsageWarning.references.map(r => `${r.collection}: ${r.title}`).join(', ')}). Deleting it will cause broken image links.`
            : `Are you sure you want to permanently delete '${deleteTarget?.file_name}'?`
        }
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
