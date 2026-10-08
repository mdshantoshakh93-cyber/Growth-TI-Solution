import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function PublicContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Cloud Architecture',
    budget: '$5,000 - $15,000',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { data: settingsData } = useQuery({
    queryKey: ['publicSettings'],
    queryFn: publicApi.getSiteSettings,
  });

  const settings = settingsData?.data || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in all required fields (Name, Email, and Message).');
      return;
    }

    setIsSubmitting(true);
    try {
      await publicApi.submitContact({
        ...formData,
        subject: `Inquiry for ${formData.service} (${formData.budget})`,
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
          Get in Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Let's Build Something Exceptional
        </h1>
        <p className="text-slate-300 text-sm">
          Have an enterprise project or architecture consultation inquiry? Send us a message and our team will respond within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Info Sidebar */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8 h-fit">
          <div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Direct Contact Info</h3>
            <p className="text-xs text-slate-400">Our engineering leads are available to review your system requirements.</p>
          </div>

          <div className="space-y-6 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Office Address</span>
                <span className="font-semibold">{settings.office_address || '100 Enterprise Way, Suite 500, New York, NY 10001'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Support</span>
                <span className="font-semibold">{settings.support_email || 'support@growthit.com'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Direct Phone</span>
                <span className="font-semibold">{settings.contact_phone || '+1 (800) 555-GROW'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-2xl font-bold text-slate-100">Send Inquiry Message</h3>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submitted ? (
            <div className="p-8 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
              <h4 className="text-xl font-bold text-slate-100">Message Sent Successfully!</h4>
              <p className="text-xs text-emerald-200">Thank you for reaching out. An engineer will review your message and reply via email within 24 hours.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 rounded-xl bg-slate-900 text-slate-200 font-bold text-xs border border-slate-700"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Alex Mercer"
                    className="w-full glass-input rounded-xl p-3 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="alex@enterprise.com"
                    className="w-full glass-input rounded-xl p-3 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 019-2834"
                    className="w-full glass-input rounded-xl p-3 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Financial Inc."
                    className="w-full glass-input rounded-xl p-3 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Service Required</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full glass-input rounded-xl p-3 text-slate-100 bg-slate-900 border border-slate-700"
                  >
                    <option value="Cloud Architecture">Cloud Architecture & DevOps</option>
                    <option value="Enterprise AI">Enterprise AI Models & RAG</option>
                    <option value="Custom Software">Custom Software Engineering</option>
                    <option value="Zero Trust Security">Zero Trust Security Audit</option>
                    <option value="Mobile App Dev">Mobile App Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated Budget Range</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full glass-input rounded-xl p-3 text-slate-100 bg-slate-900 border border-slate-700"
                  >
                    <option value="< $5,000">Under $5,000</option>
                    <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                    <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                    <option value="$50,000+">$50,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Message & Details *</label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder="Describe your project goals, timelines, and technical requirements..."
                  className="w-full glass-input rounded-xl p-3 text-slate-100 placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send Message to Engineers</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
