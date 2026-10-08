import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Shield,
  ChevronDown
} from 'lucide-react';

export function Topbar({ setMobileOpen, darkMode, setDarkMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/60"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Global search projects, services, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions & Admin Profile */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800/60 transition-colors"
          title="Toggle Light / Dark Mode"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800/60 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-800/80 mx-1" />

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-400 font-bold text-xs flex items-center justify-center">
              {user?.full_name ? user.full_name.charAt(0) : 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.full_name || 'Admin User'}
              </div>
              <div className="text-[10px] text-sky-400 font-mono font-medium">
                {user?.role || 'SUPER_ADMIN'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                <p className="text-xs font-bold text-slate-200">{user?.full_name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  {user?.role}
                </span>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/admin/settings');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-xl transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Settings</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
