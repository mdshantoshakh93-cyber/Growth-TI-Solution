import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { Mail, Phone, MapPin, Send, CheckCircle2, Facebook, Instagram, Linkedin, Youtube, Twitter, Clock } from 'lucide-react';

export function PublicFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const { data: settingsData } = useQuery({
    queryKey: ['publicSettings'],
    queryFn: publicApi.getSiteSettings,
  });

  const settings = settingsData?.data || {};

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await publicApi.submitNewsletter(email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const socialLinks = [
    { name: 'Facebook', url: settings.social_facebook, icon: Facebook },
    { name: 'Instagram', url: settings.social_instagram, icon: Instagram },
    { name: 'LinkedIn', url: settings.social_linkedin, icon: Linkedin },
    { name: 'YouTube', url: settings.social_youtube, icon: Youtube },
    { name: 'TikTok', url: settings.social_tiktok, icon: VideoIcon },
    { name: 'X', url: settings.social_x, icon: Twitter },
  ].filter(s => s.url);

  function VideoIcon(props) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 8-6 4 6 4V8Z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
      </svg>
    );
  }

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs font-sans pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={settings.logo || 'assets/logo.jpg'}
                alt="Logo"
                className="w-10 h-10 rounded-xl object-cover border border-sky-500/30"
                onError={(e) => { e.target.src = 'assets/logo.jpg'; }}
              />
              <span className="text-lg font-extrabold text-slate-100 tracking-tight">
                {settings.company_name || settings.site_name || 'Growth IT Solution'}
              </span>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {settings.footer_description || settings.company_description || 'Growth IT Solution provides innovative software, web, mobile and digital solutions that help businesses grow faster, work smarter and operate more efficiently.'}
            </p>

            <div className="space-y-2 pt-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{settings.office_address || '100 Enterprise Way, Suite 500, New York, NY 10001'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{settings.support_email || 'growthitsolution@gmail.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{settings.contact_phone || '+1 (800) 555-GROW'}</span>
              </div>
              {settings.business_hours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{settings.business_hours}</span>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <div className="pt-2 flex items-center gap-3">
                {socialLinks.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-sky-400 border border-slate-800 transition-colors"
                      title={s.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Solutions */}
          <div>
            <h4 className="font-bold text-slate-100 text-sm mb-4 tracking-wide uppercase text-[11px]">Services</h4>
            <ul className="space-y-2.5">
              <li><Link to="/services" className="hover:text-sky-400 transition-colors">Cloud Architecture</Link></li>
              <li><Link to="/services" className="hover:text-sky-400 transition-colors">Enterprise AI Models</Link></li>
              <li><Link to="/services" className="hover:text-sky-400 transition-colors">Custom Software Engineering</Link></li>
              <li><Link to="/services" className="hover:text-sky-400 transition-colors">Zero Trust Cybersecurity</Link></li>
              <li><Link to="/services" className="hover:text-sky-400 transition-colors">Mobile App Development</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-100 text-sm mb-4 tracking-wide uppercase text-[11px]">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
              <li><Link to="/projects" className="hover:text-sky-400 transition-colors">Case Studies & Portfolio</Link></li>
              <li><Link to="/pricing" className="hover:text-sky-400 transition-colors">Pricing Plans</Link></li>
              <li><Link to="/careers" className="hover:text-sky-400 transition-colors">Careers & Hiring</Link></li>
              <li><Link to="/faq" className="hover:text-sky-400 transition-colors">FAQ & Support</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-sky-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="font-bold text-slate-100 text-sm mb-3 tracking-wide uppercase text-[11px]">Stay Connected</h4>
            <p className="text-slate-400 mb-4 leading-relaxed text-[11px]">
              Subscribe to our quarterly IT Architecture & AI insights newsletter.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter work email"
                  required
                  className="w-full glass-input rounded-xl p-2.5 text-xs text-slate-100 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join Newsletter</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>{settings.footer_copyright || `© ${new Date().getFullYear()} ${settings.company_name || settings.site_name || 'Growth IT Solution Inc.'} All rights reserved.`}</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-slate-300">Terms & Conditions</Link>
            <Link to="/admin/login" className="hover:text-sky-400 font-semibold">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
