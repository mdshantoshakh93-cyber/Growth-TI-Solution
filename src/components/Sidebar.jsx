import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  FileText,
  Quote,
  DollarSign,
  HelpCircle,
  Users,
  Briefcase,
  Mail,
  Newspaper,
  Image,
  Globe,
  Navigation as NavIcon,
  Search,
  UserCheck,
  History,
  Settings,
  X,
  ShieldCheck
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { label: 'Services', path: '/admin/services', icon: Layers },
  { label: 'Blog', path: '/admin/blogs', icon: FileText },
  { label: 'Testimonials', path: '/admin/testimonials', icon: Quote },
  { label: 'Pricing', path: '/admin/pricing', icon: DollarSign },
  { label: 'FAQ', path: '/admin/faqs', icon: HelpCircle },
  { label: 'Team', path: '/admin/team', icon: Users },
  { label: 'Careers', path: '/admin/careers', icon: Briefcase },
  { label: 'Messages', path: '/admin/messages', icon: Mail },
  { label: 'Newsletter', path: '/admin/newsletter', icon: Newspaper },
  { label: 'Media Library', path: '/admin/media', icon: Image },
  { label: 'Pages', path: '/admin/pages', icon: Globe },
  { label: 'Navigation', path: '/admin/navigation', icon: NavIcon },
  { label: 'SEO', path: '/admin/seo', icon: Search },
  { label: 'Users', path: '/admin/users', icon: UserCheck },
  { label: 'Activity Logs', path: '/admin/activity-logs', icon: History },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export function Sidebar({ mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 tracking-tight">GROWTH IT</h1>
              <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-widest block">SaaS Admin</span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm shadow-sky-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
          Growth IT Solution &copy; 2026
        </div>
      </aside>
    </>
  );
}
