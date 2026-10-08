import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-sky-400" />
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last updated: October 2026</p>
        </div>
      </div>

      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-6">
        <h2 className="text-lg font-bold text-slate-100">1. Information Collection & Usage</h2>
        <p>
          Growth IT Solution collects personal data provided explicitly through our contact forms, newsletter subscription inputs, and career application submissions. We store email addresses, names, and inquiry details strictly to provide enterprise engineering support and consultation.
        </p>

        <h2 className="text-lg font-bold text-slate-100">2. Security Standards & Data Protection</h2>
        <p>
          All data transmitted across Growth IT Solution APIs is encrypted in-transit using TLS 1.3 encryption. Passwords and credentials are stored using Bcrypt salted hashing algorithms on isolated server instances.
        </p>

        <h2 className="text-lg font-bold text-slate-100">3. Third-Party Sharing & Cookies</h2>
        <p>
          We do not sell, rent, or lease client information to third-party advertisers. Secure HTTP-Only session cookies are strictly used for admin session authentication.
        </p>
      </div>
    </div>
  );
}
