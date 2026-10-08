import React from 'react';
import { ResourcePage } from './ResourcePage';
import { Globe, Link as LinkIcon } from 'lucide-react';

export function Navigation() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'label', label: 'Menu Item Label', render: (val, item) => (
      <div>
        <div className="font-semibold text-slate-100 flex items-center gap-1.5">
          {item.type === 'external' ? <Globe className="w-3.5 h-3.5 text-amber-400" /> : <LinkIcon className="w-3.5 h-3.5 text-sky-400" />}
          <span>{val}</span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">{item.url}</div>
      </div>
    )},
    { key: 'type', label: 'Link Type', render: (val) => (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${val === 'external' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'}`}>
        {val === 'external' ? 'External URL' : 'Internal Route'}
      </span>
    )},
    { key: 'order', label: 'Display Order', align: 'center', render: (val) => <span className="font-mono font-bold text-slate-200">{val}</span> },
    { key: 'visible', label: 'Status', render: (val) => (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${val !== false ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
        {val !== false ? 'Enabled' : 'Disabled'}
      </span>
    )},
  ];

  const fields = [
    { key: 'label', label: 'Menu Item Label', required: true, placeholder: 'e.g. Services, About Us, Client Portal' },
    {
      key: 'type',
      label: 'Link Destination Type',
      type: 'select',
      options: [
        { label: 'Internal Route (e.g. /services, /projects)', value: 'internal' },
        { label: 'External URL (e.g. https://example.com)', value: 'external' }
      ]
    },
    { key: 'url', label: 'Target URL / Path', required: true, placeholder: '/services or https://example.com' },
    { key: 'order', label: 'Display Order Position', type: 'number', placeholder: '1' },
    { key: 'visible', label: 'Enable Menu Item (Visible on Public Header)', type: 'boolean', placeholder: 'Visible' },
  ];

  const defaultItem = {
    label: '',
    type: 'internal',
    url: '/',
    order: 1,
    visible: true
  };

  return (
    <ResourcePage
      title="Website Header Navigation Links"
      collectionName="navigation"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
    />
  );
}
