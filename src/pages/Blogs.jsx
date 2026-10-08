import React from 'react';
import { ResourcePage } from './ResourcePage';
import { StatusBadge } from '../components/StatusBadge';

export function Blogs() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'title', label: 'Article Title', render: (val, item) => (
      <div>
        <div className="font-semibold text-slate-100">{val}</div>
        <div className="text-[10px] text-slate-400 font-mono">/{item.slug}</div>
      </div>
    )},
    { key: 'category', label: 'Category' },
    { key: 'author', label: 'Author' },
    { key: 'tags', label: 'Tags', render: (val) => (
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
    { key: 'title', label: 'Article Title', required: true, placeholder: 'Scaling Kubernetes to 1 Million Concurrent Connections' },
    { key: 'slug', label: 'URL Slug', required: true, placeholder: 'scaling-kubernetes-1m-connections' },
    { key: 'category', label: 'Category', type: 'select', options: ['Cloud DevOps', 'Enterprise AI', 'Cybersecurity', 'Software Architecture'] },
    { key: 'author', label: 'Author Name', placeholder: 'Alex Rivers, Principal Architect' },
    { key: 'publish_date', label: 'Publish Date', type: 'date' },
    { key: 'tags', label: 'Article Tags', type: 'array', hint: 'Comma separated e.g. Kubernetes, AWS, High Availability', fullWidth: true },
    { key: 'excerpt', label: 'Short Excerpt', type: 'textarea', fullWidth: true, placeholder: 'Deep dive into load balancing tuning...' },
    { key: 'content', label: 'Article Content (Safe Rich Text HTML)', type: 'richtext', fullWidth: true },
    { key: 'featured_image', label: 'Featured Banner Image URL', placeholder: 'assets/hero_graphic.jpg' },
    { key: 'featured', label: 'Featured Post', type: 'boolean', placeholder: 'Feature on top blog slider' },
    { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'archived'] },
    { key: 'seo_title', label: 'SEO Meta Title', fullWidth: true },
    { key: 'seo_description', label: 'SEO Meta Description', type: 'textarea', fullWidth: true },
  ];

  const defaultItem = {
    title: '',
    slug: '',
    category: 'Cloud DevOps',
    author: 'Growth IT Engineering Team',
    publish_date: new Date().toISOString().split('T')[0],
    tags: [],
    excerpt: '',
    content: '<h2>Introduction</h2><p>Write article breakdown here...</p>',
    featured_image: 'assets/hero_graphic.jpg',
    featured: true,
    status: 'published',
    seo_title: '',
    seo_description: ''
  };

  return (
    <ResourcePage
      title="Blog Post"
      collectionName="blogs"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
      statusOptions={['published', 'draft', 'archived']}
      categoryOptions={['Cloud DevOps', 'Enterprise AI', 'Cybersecurity', 'Software Architecture']}
    />
  );
}
