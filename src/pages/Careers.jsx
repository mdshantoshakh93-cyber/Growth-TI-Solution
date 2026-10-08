import React from 'react';
import { ResourcePage } from './ResourcePage';
import { StatusBadge } from '../components/StatusBadge';

export function Careers() {
  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-sky-400">{val}</span> },
    { key: 'title', label: 'Job Title', render: (val, item) => (
      <div>
        <div className="font-semibold text-slate-100">{val || item.job_title}</div>
        <div className="text-[10px] text-slate-400">{item.department} • {item.location}</div>
      </div>
    )},
    { key: 'employment_type', label: 'Type' },
    { key: 'salary_range', label: 'Salary Range', render: (val) => <span className="font-mono text-emerald-400">{val}</span> },
    { key: 'deadline', label: 'Deadline' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'active'} /> },
  ];

  const fields = [
    { key: 'job_title', label: 'Job Title', required: true, placeholder: 'Senior Cloud DevOps Architect' },
    { key: 'department', label: 'Department', type: 'select', options: ['Engineering', 'Artificial Intelligence', 'Cybersecurity', 'Operations'] },
    { key: 'employment_type', label: 'Employment Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract', 'Remote'] },
    { key: 'location', label: 'Job Location', placeholder: 'Remote / New York, NY' },
    { key: 'salary_range', label: 'Salary Range', placeholder: '$140,000 - $180,000 USD' },
    { key: 'deadline', label: 'Application Deadline', type: 'date' },
    { key: 'responsibilities', label: 'Key Responsibilities', type: 'array', hint: 'Comma separated list', fullWidth: true },
    { key: 'requirements', label: 'Job Requirements', type: 'array', hint: 'Comma separated list', fullWidth: true },
    { key: 'benefits', label: 'Employee Benefits', type: 'array', hint: 'Comma separated list', fullWidth: true },
    { key: 'description', label: 'Job Role Overview', type: 'textarea', fullWidth: true, placeholder: 'We are seeking an experienced architect to lead multi-cloud deployments...' },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'closed', 'draft'] },
  ];

  const defaultItem = {
    job_title: '',
    department: 'Engineering',
    employment_type: 'Full-time',
    location: 'Remote',
    salary_range: '$130,000 - $170,000',
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    responsibilities: [],
    requirements: [],
    benefits: [],
    description: '',
    status: 'active'
  };

  return (
    <ResourcePage
      title="Career Opportunity"
      collectionName="careers"
      columns={columns}
      fields={fields}
      defaultItem={defaultItem}
      statusOptions={['active', 'closed', 'draft']}
      categoryOptions={['Engineering', 'Artificial Intelligence', 'Cybersecurity', 'Operations']}
    />
  );
}
