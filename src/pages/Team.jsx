import React from 'react';
import { ResourcePage } from './ResourcePage';
import { StatusBadge } from '../components/StatusBadge';

export function Team() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'name', label: 'Team Member', render: (val, item) => (
      <div className="flex items-center gap-2">
        <img src={item.profile_image || 'assets/logo.jpg'} alt={val} className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
        <div>
          <div className="font-semibold text-slate-100">{val}</div>
          <div className="text-[10px] text-slate-400">{item.position}</div>
        </div>
      </div>
    )},
    { key: 'skills', label: 'Core Skills', render: (val) => (
      <div className="flex flex-wrap gap-1 max-w-xs">
        {(Array.isArray(val) ? val : String(val || '').split(',')).map((s, idx) => (
          <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
            {s.trim()}
          </span>
        ))}
      </div>
    )},
    { key: 'display_order', label: 'Order', align: 'center' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'active'} /> },
  ];

  const fields = [
    { key: 'name', label: 'Full Name', required: true, placeholder: 'David Vance' },
    { key: 'position', label: 'Job Title / Position', required: true, placeholder: 'Head of Cloud Security' },
    { key: 'bio', label: 'Member Bio', type: 'textarea', fullWidth: true, placeholder: '15+ years experience in Zero Trust cloud architecture...' },
    { key: 'profile_image', label: 'Profile Photo URL', placeholder: 'assets/logo.jpg' },
    { key: 'skills', label: 'Expertise & Skills', type: 'array', hint: 'Comma separated e.g. AWS, Kubernetes, Terraform, SOC2', fullWidth: true },
    { key: 'social_links', label: 'Social Profile URL / Handle', placeholder: 'https://linkedin.com/in/davidvance' },
    { key: 'display_order', label: 'Display Order', type: 'number', placeholder: '1' },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'draft'] },
  ];

  const defaultItem = {
    name: '',
    position: '',
    bio: '',
    profile_image: 'assets/logo.jpg',
    skills: [],
    social_links: '',
    display_order: 1,
    status: 'active'
  };

  return (
    <ResourcePage
      title="Team Member"
      collectionName="team"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
      statusOptions={['active', 'inactive', 'draft']}
    />
  );
}
