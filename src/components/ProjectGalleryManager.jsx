import React, { useState } from 'react';
import { adminApi } from '../api/client';
import { UploadCloud, ArrowUp, ArrowDown, Star, Trash2, Replace, Image as ImageIcon, Loader2 } from 'lucide-react';

export function ProjectGalleryManager({
  mainImage,
  gallery = [],
  onMainImageChange,
  onGalleryChange
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadMain = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const res = await adminApi.uploadMedia(event.target.result, file.name, file.type);
          onMainImageChange(res.data.file_url);
        } catch (err) {
          alert('Failed to upload image: ' + err.message);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploading(false);
    }
  };

  const handleUploadGallery = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const newUrls = [];
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onload = async (event) => {
            try {
              const res = await adminApi.uploadMedia(event.target.result, file.name, file.type);
              newUrls.push(res.data.file_url);
            } catch (err) {
              console.error(err);
            } finally {
              resolve();
            }
          };
          reader.readAsDataURL(file);
        });
      }
      onGalleryChange([...gallery, ...newUrls]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMoveGalleryItem = (index, direction) => {
    const updated = [...gallery];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onGalleryChange(updated);
  };

  const handleSetMain = (url) => {
    onMainImageChange(url);
  };

  const handleDeleteGalleryItem = (index) => {
    const updated = gallery.filter((_, idx) => idx !== index);
    onGalleryChange(updated);
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* 1. Main Cover Image Section */}
      <div className="space-y-2">
        <label className="block font-semibold text-slate-300">Project Main Cover Image</label>
        <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="w-40 h-28 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center relative group">
            {mainImage ? (
              <img src={mainImage} alt="Main Cover" loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-slate-500 gap-1">
                <ImageIcon className="w-6 h-6" />
                <span className="text-[10px]">No Cover</span>
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <input
              type="text"
              value={mainImage || ''}
              onChange={(e) => onMainImageChange(e.target.value)}
              placeholder="e.g. assets/hero_graphic.jpg or /uploads/..."
              className="w-full glass-input rounded-xl p-2.5 text-slate-100"
            />
            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-md">
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                <span>Upload New Cover</span>
                <input type="file" accept="image/*" onChange={handleUploadMain} className="hidden" />
              </label>
              {mainImage && (
                <button
                  type="button"
                  onClick={() => onMainImageChange('')}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 font-semibold"
                >
                  Clear Cover
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Gallery Images Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block font-semibold text-slate-300">Project Gallery Showcase ({gallery.length} Images)</label>
          <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-colors">
            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
            <span>Add Gallery Images</span>
            <input type="file" accept="image/*" multiple onChange={handleUploadGallery} className="hidden" />
          </label>
        </div>

        {gallery.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-slate-500">
            No gallery images uploaded. Click "Add Gallery Images" to attach project screenshots.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {gallery.map((url, idx) => (
              <div key={idx} className="group relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="aspect-video w-full overflow-hidden bg-slate-900">
                  <img src={url} alt={`Gallery ${idx + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>

                {/* Control Actions Overlay */}
                <div className="p-2 flex items-center justify-between bg-slate-900/90 border-t border-slate-800">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveGalleryItem(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveGalleryItem(idx, 1)}
                      disabled={idx === gallery.length - 1}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetMain(url)}
                      className={`p-1 rounded ${mainImage === url ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-amber-400'}`}
                      title="Set as Main Cover"
                    >
                      <Star className="w-3 h-3 fill-current" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryItem(idx)}
                    className="p-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 border border-rose-500/30"
                    title="Remove from Gallery"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
