import React from 'react';
import { ResourcePage } from './ResourcePage';
import { StatusBadge } from '../components/StatusBadge';

export function Faqs() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'question', label: 'Question', render: (val) => (
      <div className="font-semibold text-slate-100 max-w-md">{val}</div>
    )},
    { key: 'category', label: 'Category' },
    { key: 'display_order', label: 'Order', align: 'center' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'published'} /> },
  ];

  const fields = [
    { key: 'question', label: 'Question Title', required: true, fullWidth: true, placeholder: 'What cloud providers do you support?' },
    { key: 'category', label: 'Category', type: 'select', options: ['General', 'Cloud Architecture', 'Security & Compliance', 'Pricing & Billing'] },
    { key: 'answer', label: 'Detailed Answer', type: 'textarea', required: true, fullWidth: true, placeholder: 'We architect and migrate infrastructure across AWS, Azure, and Google Cloud...' },
    { key: 'display_order', label: 'Display Order', type: 'number', placeholder: '1' },
    { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'archived'] },
  ];

  const defaultItem = {
    question: '',
    answer: '',
    category: 'General',
    display_order: 1,
    status: 'published'
  };

  return (
    <ResourcePage
      title="FAQ"
      collectionName="faqs"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
      statusOptions={['published', 'draft', 'archived']}
      categoryOptions={['General', 'Cloud Architecture', 'Security & Compliance', 'Pricing & Billing']}
    />
  );
}
