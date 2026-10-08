import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home as HomeIcon } from 'lucide-react';

export function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mx-auto">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <h1 className="text-6xl font-extrabold text-slate-100 font-mono">404</h1>
      <h2 className="text-2xl font-bold text-slate-200">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
        The route or resource you are trying to access does not exist or has been relocated.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
      >
        <HomeIcon className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
