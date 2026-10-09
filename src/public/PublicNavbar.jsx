import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { Menu, X, Sun, Moon, Shield, Sparkles, ExternalLink } from 'lucide-react';

export function PublicNavbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Toggle Dark/Light Mode
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Fetch Dynamic Site Settings
  const { data: settingsData } = useQuery({
    queryKey: ['publicSettings'],
    queryFn: publicApi.getSiteSettings,
  });

  // Fetch Dynamic Navigation
  const { data: navData } = useQuery({
    queryKey: ['publicNav'],
    queryFn: publicApi.getNavigation,
  });

  const settings = settingsData?.data || {};
  const customNav = navData?.data || [];

  // Update dynamic favicon in head
  useEffect(() => {
    if (settings.favicon) {
      let iconLink = document.querySelector("link[rel~='icon']");
      if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(iconLink);
      }
      iconLink.href = settings.favicon;
    }
  }, [settings.favicon]);

  const defaultNavLinks = [
    { label: 'Home', path: '/', type: 'internal' },
    { label: 'About', path: '/about', type: 'internal' },
    { label: 'Services', path: '/services', type: 'internal' },
    { label: 'Portfolio', path: '/projects', type: 'internal' },
    { label: 'Pricing', path: '/pricing', type: 'internal' },
    { label: 'Blog', path: '/blog', type: 'internal' },
    { label: 'Careers', path: '/careers', type: 'internal' },
    { label: 'Contact', path: '/contact', type: 'internal' },
  ];

  const rawNav = customNav.length > 0 ? customNav : defaultNavLinks;
  const navLinks = [...rawNav].sort((a, b) => (a.order || 0) - (b.order || 0)).map(n => {
    const isExternal = n.type === 'external' || (n.url && (n.url.startsWith('http://') || n.url.startsWith('https://')));
    const rawPath = n.url || n.path || '/';
    const cleanPath = isExternal ? rawPath : (rawPath.startsWith('#') ? `/${rawPath}` : rawPath);
    return {
      label: n.label,
      path: cleanPath,
      isExternal
    };
  });

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img
            src={settings.logo || 'assets/logo.jpg'}
            alt="Brand Logo"
            className="w-10 h-10 rounded-xl object-cover border border-sky-500/30 group-hover:scale-105 transition-transform shadow-lg shadow-sky-500/10 shrink-0"
            onError={(e) => { e.target.src = 'assets/logo.jpg'; }}
          />
          <div className="flex flex-col shrink-0">
            <span className="text-lg font-extrabold text-slate-100 tracking-tight flex items-center gap-1 whitespace-nowrap">
              {settings.company_name || settings.site_name || 'Growth IT Solution'}
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            </span>
            <span className="text-[10px] text-sky-400 font-mono tracking-wider uppercase whitespace-nowrap">Enterprise IT Engine</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-medium text-xs">
          {navLinks.map((link, idx) => {
            const isActive = !link.isExternal && location.pathname === link.path;
            if (link.isExternal) {
              return (
                <a
                  key={idx}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-slate-100 hover:bg-slate-900/60 flex items-center gap-1 transition-all"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                </a>
              );
            }
            return (
              <Link
                key={idx}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30 shadow-inner'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>

          {/* Contact CTA */}
          <Link
            to="/contact"
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 py-6 space-y-3 animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link, idx) => {
              if (link.isExternal) {
                return (
                  <a
                    key={idx}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900 flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                  </a>
                );
              }
              return (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    location.pathname === link.path
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-sky-500 text-slate-950 font-bold text-xs rounded-xl text-center shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
