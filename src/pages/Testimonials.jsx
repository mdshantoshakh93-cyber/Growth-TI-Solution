import React from 'react';
import { ResourcePage } from './ResourcePage';
import { StatusBadge } from '../components/StatusBadge';
import { Star } from 'lucide-react';

export function Testimonials() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'name', label: 'Client Name', render: (val, item) => (
      <div className="flex items-center gap-2">
        <img src={item.profile_image || 'assets/logo.jpg'} alt={val} className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
        <div>
          <div className="font-semibold text-slate-100">{val}</div>
          <div className="text-[10px] text-slate-400">{item.position} at {item.company}</div>
        </div>
      </div>
    )},
    { key: 'rating', label: 'Rating', align: 'center', render: (val) => (
      <div className="flex items-center justify-center gap-0.5 text-amber-400 font-bold">
        <span>{val || 5}</span>
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      </div>
    )},
    { key: 'display_order', label: 'Order', align: 'center' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'published'} /> },
  ];

  const fields = [
    { key: 'name', label: 'Client / Executive Name', required: true, placeholder: 'Sarah Jenkins' },
    { key: 'company', label: 'Company / Enterprise Name', required: true, placeholder: 'FinTech Dynamics' },
    { key: 'position', label: 'Job Position', placeholder: 'Chief Technology Officer' },
    { key: 'profile_image', label: 'Profile Avatar Image URL', placeholder: 'assets/logo.jpg' },
    { key: 'rating', label: 'Rating (1 to 5 Stars)', type: 'number', placeholder: '5' },
    { key: 'review', label: 'Review Testimonial Text', type: 'textarea', required: true, fullWidth: true, placeholder: 'Growth IT Solution transformed our backend infrastructure...' },
    { key: 'display_order', label: 'Display Order', type: 'number', placeholder: '1' },
    { key: 'featured', label: 'Featured Testimonial', type: 'boolean', placeholder: 'Display on main homepage section' },
    { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'archived'] },
  ];

  const defaultItem = {
    name: '',
    company: '',
    position: '',
    profile_image: 'assets/logo.jpg',
    rating: 5,
    review: '',
    display_order: 1,
    featured: true,
    status: 'published'
  };

  return (
    <ResourcePage
      title="Testimonial"
      collectionName="testimonials"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
      statusOptions={['published', 'draft', 'archived']}
    />
  );
}
