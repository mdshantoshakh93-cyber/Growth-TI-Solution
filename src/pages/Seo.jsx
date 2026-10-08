import React from 'react';
import { ResourcePage } from './ResourcePage';
import { Search } from 'lucide-react';

export function Seo() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'page_type', label: 'Resource Type', render: (val) => (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 uppercase">
        {val || 'page'}
      </span>
    )},
    { key: 'page_slug', label: 'Slug / Route', render: (val) => <span className="font-semibold text-slate-100 font-mono">/{val}</span> },
    { key: 'meta_title', label: 'SEO Meta Title', render: (val) => <div className="max-w-xs truncate font-medium text-slate-100">{val}</div> },
    { key: 'canonical_url', label: 'Canonical URL', render: (val) => <div className="max-w-xs truncate font-mono text-[10px] text-slate-400">{val || '-'}</div> },
  ];

  const fields = [
    {
      key: 'page_type',
      label: 'Resource Category',
      type: 'select',
      options: [
        { label: 'Static Page (e.g. home, about, contact)', value: 'page' },
        { label: 'Service Detail Page', value: 'service' },
        { label: 'Project / Portfolio Detail', value: 'project' },
        { label: 'Blog Article', value: 'blog' }
      ]
    },
    { key: 'page_slug', label: 'Page / Resource Slug', required: true, placeholder: 'e.g. home, cloud-devops, fin-tech-migration' },
    { key: 'meta_title', label: 'SEO Title Tag', required: true, fullWidth: true, placeholder: 'Growth IT Solution | Enterprise Cloud Infrastructure' },
    { key: 'meta_description', label: 'Meta Description', type: 'textarea', fullWidth: true, placeholder: 'Enterprise IT architecture and AI solutions...' },
    { key: 'keywords', label: 'Keywords (Comma separated)', fullWidth: true, placeholder: 'cloud devops, enterprise ai, web development' },
    { key: 'canonical_url', label: 'Canonical URL', fullWidth: true, placeholder: 'https://growthitsolution.com/services/cloud-devops' },
    { key: 'og_image', label: 'OpenGraph (OG) Image URL', fullWidth: true, placeholder: 'assets/hero_graphic.jpg' }
  ];

  const defaultItem = {
    page_type: 'page',
    page_slug: 'home',
    meta_title: '',
    meta_description: '',
    keywords: '',
    canonical_url: '',
    og_image: ''
  };

  return (
    <ResourcePage
      title="Individual Page SEO Configuration"
      collectionName="seo"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
    />
  );
}
