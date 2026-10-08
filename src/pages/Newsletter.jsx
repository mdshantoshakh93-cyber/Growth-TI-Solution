import React from 'react';
import { ResourcePage } from './ResourcePage';

export function Newsletter() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'email', label: 'Subscriber Email', render: (val) => (
      <span className="font-semibold text-slate-100">{val}</span>
    )},
    { key: 'subscribed_at', label: 'Subscribed Date', render: (val) => val ? new Date(val).toLocaleString() : 'N/A' },
  ];

  const fields = [
    { key: 'email', label: 'Subscriber Email Address', required: true, placeholder: 'client@company.com' },
  ];

  const defaultItem = {
    email: ''
  };

  return (
    <ResourcePage
      title="Newsletter Subscriber"
      collectionName="newsletter"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
    />
  );
}
