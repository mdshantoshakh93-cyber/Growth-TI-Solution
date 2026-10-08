import React from 'react';
import { ResourcePage } from './ResourcePage';
import { StatusBadge } from '../components/StatusBadge';

export function Projects() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'title', label: 'Project Title', render: (val, item) => (
      <div>
        <div className="font-semibold text-slate-100">{val}</div>
        <div className="text-[10px] text-slate-400 font-mono">/{item.slug}</div>
      </div>
    )},
    { key: 'category', label: 'Category' },
    { key: 'client_name', label: 'Client' },
    { key: 'technologies', label: 'Technologies', render: (val) => (
      <div className="flex flex-wrap gap-1 max-w-xs">
        {(Array.isArray(val) ? val : String(val || '').split(',')).map((t, idx) => (
          <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
            {t.trim()}
          </span>
        ))}
      </div>
    )},
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'published'} /> },
  ];

  const fields = [
    { key: 'title', label: 'Project Title', required: true, placeholder: 'e.g. AI Financial Fraud Detection Platform' },
    { key: 'slug', label: 'URL Slug', required: true, placeholder: 'ai-financial-fraud-detection' },
    { key: 'category', label: 'Category', type: 'select', options: ['Cloud Architecture', 'Enterprise AI', 'Custom App Dev', 'Cybersecurity'] },
    { key: 'client_name', label: 'Client Name', placeholder: 'Global Bank Inc.' },
    { key: 'project_url', label: 'Live Project URL', placeholder: 'https://example.com' },
    { key: 'technologies', label: 'Technologies Used', type: 'array', hint: 'Comma separated e.g. React, Node.js, AWS, TensorFlow', fullWidth: true },
    { key: 'features', label: 'Key Features', type: 'array', hint: 'Comma separated list of features', fullWidth: true },
    { key: 'short_description', label: 'Short Description', type: 'textarea', fullWidth: true, placeholder: 'Brief summary of project outcomes...' },
    { key: 'full_description', label: 'Full Description', type: 'richtext', fullWidth: true },
    { key: 'main_image', label: 'Main Cover Image URL', placeholder: 'assets/hero_graphic.jpg' },
    { key: 'gallery', label: 'Gallery Image URLs', type: 'array', hint: 'Comma separated image URLs' },
    { key: 'display_order', label: 'Display Order', type: 'number', placeholder: '1' },
    { key: 'featured', label: 'Featured Project', type: 'boolean', placeholder: 'Show on homepage featured showcase' },
    { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'archived'] },
    { key: 'seo_title', label: 'SEO Meta Title', fullWidth: true },
    { key: 'seo_description', label: 'SEO Meta Description', type: 'textarea', fullWidth: true },
  ];

  const defaultItem = {
    title: '',
    slug: '',
    category: 'Cloud Architecture',
    client_name: '',
    project_url: '',
    technologies: [],
    features: [],
    short_description: '',
    full_description: '',
    main_image: 'assets/hero_graphic.jpg',
    gallery: [],
    display_order: 1,
    featured: true,
    status: 'published',
    seo_title: '',
    seo_description: ''
  };

  return (
    <ResourcePage
      title="Project"
      collectionName="portfolio_items"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
      statusOptions={['published', 'draft', 'archived']}
      categoryOptions={['Cloud Architecture', 'Enterprise AI', 'Custom App Dev', 'Cybersecurity']}
    />
  );
}
