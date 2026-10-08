import Link from 'next/link';
import { Cpu, Globe, Share2, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Growth <span className="text-gradient">IT Solution</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Architecting next-generation cloud infrastructure, agentic AI engines, and enterprise web solutions for high-growth tech leaders.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500 transition-all">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-700 transition-all">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Practice Areas */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Core Capabilities</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="#services" className="hover:text-blue-400 transition-colors">Cloud & DevOps Migration</Link></li>
            <li><Link href="#services" className="hover:text-blue-400 transition-colors">Agentic AI & LLM Systems</Link></li>
            <li><Link href="#services" className="hover:text-blue-400 transition-colors">Next.js Web Applications</Link></li>
            <li><Link href="#services" className="hover:text-blue-400 transition-colors">Cybersecurity Auditing</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources & Tools</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="#estimator" className="hover:text-blue-400 transition-colors">Project Cost Estimator</Link></li>
            <li><Link href="#portfolio" className="hover:text-blue-400 transition-colors">Enterprise Case Studies</Link></li>
            <li><Link href="/api/health" target="_blank" className="hover:text-blue-400 transition-colors">System Health API</Link></li>
            <li><Link href="#contact" className="hover:text-blue-400 transition-colors">Schedule Consultation</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-sm">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Global HQ</h4>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
            <span>Enterprise Tower, Silicon Tech District, Suite 400</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-blue-400 shrink-0" />
            <span>contact@growthitsolution.com</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-blue-400 shrink-0" />
            <span>+1 (800) 555-GROWTH</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <p>&copy; 2026 Growth IT Solution Inc. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Security Disclosures</a>
        </div>
      </div>
    </footer>
  );
}
