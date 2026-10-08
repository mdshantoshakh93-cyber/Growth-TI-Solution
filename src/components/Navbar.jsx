'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cpu, ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [health, setHealth] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => setHealth({ status: 'offline' }));
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Growth <span className="text-gradient">IT Solution</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block -mt-1 font-semibold">
              Enterprise Engineering
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <Link href="#services" className="hover:text-blue-400 transition-colors">
            Services
          </Link>
          <Link href="#estimator" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <span className="px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded-md font-semibold border border-blue-500/30">
              Tool
            </span>
            Cost Estimator
          </Link>
          <Link href="#portfolio" className="hover:text-blue-400 transition-colors">
            Case Studies
          </Link>
          <Link href="#contact" className="hover:text-blue-400 transition-colors">
            Consultation
          </Link>
        </nav>

        {/* Right CTA & Health Indicator */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Health Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${health?.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-gray-300 font-mono">
              {health?.status === 'online' ? 'API Online' : 'Connecting...'}
            </span>
          </div>

          <Link
            href="#estimator"
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-1.5"
          >
            Get Scope Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-200 hover:text-blue-400 text-base font-medium"
          >
            Services
          </Link>
          <Link
            href="#estimator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-200 hover:text-blue-400 text-base font-medium"
          >
            Cost Estimator
          </Link>
          <Link
            href="#portfolio"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-200 hover:text-blue-400 text-base font-medium"
          >
            Case Studies
          </Link>
          <Link
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-200 hover:text-blue-400 text-base font-medium"
          >
            Consultation
          </Link>
        </div>
      )}
    </header>
  );
}
