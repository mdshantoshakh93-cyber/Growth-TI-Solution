import React from 'react';
import { ResourcePage } from './ResourcePage';
import { StatusBadge } from '../components/StatusBadge';

export function Pages() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'title', label: 'Page Title', render: (val, item) => (
      <div>
        <div className="font-semibold text-slate-100">{val}</div>
        <div className="text-[10px] text-slate-400 font-mono">/{item.slug}</div>
      </div>
    )},
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'published'} /> },
    { key: 'last_updated', label: 'Last Updated', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
  ];

  const fields = [
    { key: 'title', label: 'Page Title', required: true, placeholder: 'About Us' },
    { key: 'slug', label: 'Page Slug', required: true, placeholder: 'about' },
    { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'archived'] },
  ];

  const defaultItem = {
    title: '',
    slug: '',
    status: 'published'
  };

  return (
    <ResourcePage
      title="Dynamic Page"
      collectionName="pages"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
      statusOptions={['published', 'draft', 'archived']}
    />
  );
}
