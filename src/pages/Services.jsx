import React from 'react';
import { ResourcePage } from './ResourcePage';
import { StatusBadge } from '../components/StatusBadge';

export function Services() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'name', label: 'Service Name', render: (val, item) => (
      <div className="flex items-center gap-2">
        <span className="text-lg">{item.icon || '⚡'}</span>
        <div>
          <div className="font-semibold text-slate-100">{val}</div>
          <div className="text-[10px] text-slate-400 font-mono">/{item.slug}</div>
        </div>
      </div>
    )},
    { key: 'pricing', label: 'Pricing Model' },
    { key: 'display_order', label: 'Order', align: 'center' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'published'} /> },
  ];

  const fields = [
    { key: 'name', label: 'Service Name', required: true, placeholder: 'Cloud Infrastructure & DevOps' },
    { key: 'slug', label: 'URL Slug', required: true, placeholder: 'cloud-infrastructure-devops' },
    { key: 'icon', label: 'Service Emoji / Icon', placeholder: '☁️' },
    { key: 'pricing', label: 'Starting Price / Retainer', placeholder: 'Starting from $4,999/mo' },
    { key: 'features', label: 'Service Features', type: 'array', hint: 'Comma separated list of features', fullWidth: true },
    { key: 'benefits', label: 'Business Benefits', type: 'array', hint: 'Comma separated list of business benefits', fullWidth: true },
    { key: 'short_description', label: 'Short Description', type: 'textarea', fullWidth: true, placeholder: 'Architect resilient multi-cloud environments...' },
    { key: 'full_description', label: 'Full Description', type: 'richtext', fullWidth: true },
    { key: 'image', label: 'Service Banner Image URL', placeholder: 'assets/hero_graphic.jpg' },
    { key: 'display_order', label: 'Display Order', type: 'number', placeholder: '1' },
    { key: 'featured', label: 'Featured Service', type: 'boolean', placeholder: 'Highlight on homepage' },
    { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'archived'] },
    { key: 'seo_title', label: 'SEO Meta Title', fullWidth: true },
    { key: 'seo_description', label: 'SEO Meta Description', type: 'textarea', fullWidth: true },
  ];

  const defaultItem = {
    name: '',
    slug: '',
    icon: '⚡',
    pricing: 'Custom Quote',
    features: [],
    benefits: [],
    short_description: '',
    full_description: '',
    image: 'assets/hero_graphic.jpg',
    display_order: 1,
    featured: true,
    status: 'published',
    seo_title: '',
    seo_description: ''
  };

  return (
    <ResourcePage
      title="Service"
      collectionName="services"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
      statusOptions={['published', 'draft', 'archived']}
    />
  );
}
