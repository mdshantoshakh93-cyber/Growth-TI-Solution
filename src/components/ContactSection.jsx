'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Next.js Modern Web Application',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ type: 'success', text: data.message, ticketId: data.ticketId });
        setFormData({ name: '', email: '', company: '', service: 'Next.js Modern Web Application', message: '' });
      } else {
        setStatus({ type: 'error', text: data.error || 'Submission failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Network connection error. Please retry.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900/60 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
                <MessageSquare className="w-4 h-4" /> Direct Engineering Channel
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Schedule an <span className="text-gradient">Architect Consultation</span>
              </h2>
              <p className="mt-3 text-gray-400 text-base leading-relaxed">
                Connect directly with our Principal Solutions Architects for technical reviews, system auditing, and custom proposals.
              </p>
            </div>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="glass-card p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-semibold">Technical Inquiry Email</div>
                  <div className="text-white font-medium">contact@growthitsolution.com</div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-600/10 flex items-center justify-center text-cyan-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-semibold">Global SLA Hotline</div>
                  <div className="text-white font-medium">+1 (800) 555-GROWTH</div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-semibold">Silicon Tech District</div>
                  <div className="text-white font-medium">Suite 400, Enterprise Tower</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 glass-panel p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Inquiry & Project Submission</h3>

            {status && (
              <div
                className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 ${
                  status.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div>{status.text}</div>
                  {status.ticketId && (
                    <div className="text-xs font-mono mt-1 opacity-80">Reference Ticket ID: {status.ticketId}</div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. TechCorp Inc."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Primary Service Interest
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option>Next.js Modern Web Application</option>
                    <option>Enterprise Cloud & DevOps Migration</option>
                    <option>Custom AI & Agentic Solutions</option>
                    <option>Cybersecurity Auditing & Compliance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Project Brief & Technical Overview *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Outline your architectural goals, timeline, and key requirements..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Submitting Consultation Request...'
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Consultation Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
