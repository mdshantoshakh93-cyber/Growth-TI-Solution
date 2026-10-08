import React from 'react';
import { FileText } from 'lucide-react';

export function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-sky-400" />
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Terms & Conditions</h1>
          <p className="text-xs text-slate-400">Last updated: October 2026</p>
        </div>
      </div>

      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-6">
        <h2 className="text-lg font-bold text-slate-100">1. Master Services Agreement</h2>
        <p>
          By engaging Growth IT Solution for software development, cloud DevOps, or cybersecurity auditing services, client organizations agree to the terms outlined in their statement of work (SOW) and service level agreements (SLA).
        </p>

        <h2 className="text-lg font-bold text-slate-100">2. Intellectual Property Rights</h2>
        <p>
          All custom source code, documentation, and cloud architecture assets delivered under paid engineering contracts transfer to full client ownership upon final settlement of invoices.
        </p>

        <h2 className="text-lg font-bold text-slate-100">3. System Availability & SLA</h2>
        <p>
          Growth IT Solution guarantees a 99.99% uptime availability for managed enterprise cloud environments covered under active SLA retainers.
        </p>
      </div>
    </div>
  );
}
