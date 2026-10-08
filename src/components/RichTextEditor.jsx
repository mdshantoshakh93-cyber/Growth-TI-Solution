import React, { useState } from 'react';
import { Bold, Italic, Heading1, Heading2, List, Quote, Code, Eye, Edit2 } from 'lucide-react';

export function RichTextEditor({ value, onChange, placeholder = 'Write your rich content HTML here...' }) {
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

  const insertTag = (openTag, closeTag = '') => {
    const text = value || '';
    const updated = text + `${openTag}${closeTag ? closeTag : ''}`;
    onChange(updated);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden text-xs">
      {/* Editor Toolbar Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertTag('<strong>', '</strong>')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
            title="Bold <strong>"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<em>', '</em>')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
            title="Italic <em>"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h2>', '</h2>')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
            title="Heading 2 <h2>"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h3>', '</h3>')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
            title="Heading 3 <h3>"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
            title="List <ul>"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<blockquote>', '</blockquote>')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
            title="Blockquote <blockquote>"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<code>', '</code>')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
            title="Code <code>"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${
              activeTab === 'write' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit2 className="w-3 h-3" />
            <span>Write HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${
              activeTab === 'preview' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === 'write' ? (
        <textarea
          rows={7}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 font-mono text-xs bg-slate-950 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-0 border-0 resize-y"
        />
      ) : (
        <div
          className="p-4 min-h-[160px] max-h-[300px] overflow-y-auto prose prose-invert text-xs text-slate-200 bg-slate-950/40"
          dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-500 italic">No content to preview.</p>' }}
        />
      )}
    </div>
  );
}
