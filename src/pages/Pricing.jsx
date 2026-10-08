import React from 'react';
import { ResourcePage } from './ResourcePage';
import { StatusBadge } from '../components/StatusBadge';

export function Pricing() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'plan_name', label: 'Plan Name', render: (val, item) => (
      <div>
        <div className="font-semibold text-slate-100">{val}</div>
        <div className="text-[10px] text-slate-400">{item.description}</div>
      </div>
    )},
    { key: 'price', label: 'Price Rate', render: (val, item) => (
      <div className="font-bold text-emerald-400 font-mono">
        {item.currency || '$'}{val}
      </div>
    )},
    { key: 'display_order', label: 'Order', align: 'center' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'published'} /> },
  ];

  const fields = [
    { key: 'plan_name', label: 'Plan Name', required: true, placeholder: 'Enterprise Pro Plan' },
    { key: 'price', label: 'Price Amount', required: true, placeholder: '4999' },
    { key: 'currency', label: 'Currency Symbol', placeholder: '$' },
    { key: 'description', label: 'Plan Short Description', type: 'textarea', fullWidth: true, placeholder: 'Dedicated cloud DevOps & 24/7 incident response' },
    { key: 'features', label: 'Plan Features', type: 'array', hint: 'Comma separated list of included features', fullWidth: true },
    { key: 'cta', label: 'Call To Action (CTA Button Label)', placeholder: 'Get Started' },
    { key: 'display_order', label: 'Display Order', type: 'number', placeholder: '1' },
    { key: 'featured', label: 'Featured / Popular Plan', type: 'boolean', placeholder: 'Highlight with glowing border badge' },
    { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'archived'] },
  ];

  const defaultItem = {
    plan_name: '',
    price: '2999',
    currency: '$',
    description: '',
    features: [],
    cta: 'Get Started',
    display_order: 1,
    featured: false,
    status: 'published'
  };

  return (
    <ResourcePage
      title="Pricing Plan"
      collectionName="pricing"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
      statusOptions={['published', 'draft', 'archived']}
    />
  );
}
