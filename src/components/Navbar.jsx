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
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
          <Link href="#hero" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link href="#project" className="hover:text-blue-400 transition-colors">Project</Link>
          <Link href="#service" className="hover:text-blue-400 transition-colors">Service</Link>
          <Link href="#websitedemo" className="hover:text-blue-400 transition-colors">Website Demo</Link>
          <Link href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</Link>
          <Link href="#team" className="hover:text-blue-400 transition-colors">Team</Link>
          <Link href="#blog" className="hover:text-blue-400 transition-colors">Blog</Link>
          <Link href="#contact" className="hover:text-blue-400 transition-colors">Contact</Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center space-x-4">

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
