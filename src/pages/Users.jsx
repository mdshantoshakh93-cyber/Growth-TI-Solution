import React from 'react';
import { ResourcePage } from './ResourcePage';
import { StatusBadge } from '../components/StatusBadge';
import { ShieldCheck } from 'lucide-react';

export function Users() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'full_name', label: 'User Name', render: (val, item) => (
      <div>
        <div className="font-semibold text-slate-100">{val}</div>
        <div className="text-[10px] text-slate-400">{item.email}</div>
      </div>
    )},
    { key: 'role', label: 'Assigned Role', render: (val) => (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
        <ShieldCheck className="w-3 h-3 text-sky-400" />
        <span>{val}</span>
      </span>
    )},
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'active'} /> },
    { key: 'created_at', label: 'Created At', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
  ];

  const fields = [
    { key: 'full_name', label: 'User Full Name', required: true, placeholder: 'John Doe' },
    { key: 'email', label: 'User Email Address', required: true, type: 'email', placeholder: 'user@growthit.com' },
    { key: 'password', label: 'Initial Password', required: true, type: 'password', placeholder: '••••••••••••' },
    { key: 'role', label: 'User RBAC Role', type: 'select', options: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'CONTENT_MANAGER'] },
    { key: 'status', label: 'User Status', type: 'select', options: ['active', 'inactive'] },
  ];

  const defaultItem = {
    full_name: '',
    email: '',
    password: '',
    role: 'ADMIN',
    status: 'active'
  };

  return (
    <ResourcePage
      title="System User & Role"
      collectionName="users"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
      statusOptions={['active', 'inactive']}
      categoryOptions={['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'CONTENT_MANAGER']}
    />
  );
}
