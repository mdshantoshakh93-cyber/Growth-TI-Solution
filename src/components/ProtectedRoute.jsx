import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-10 h-10 animate-spin text-sky-400 mb-4" />
        <p className="text-sm font-medium tracking-wide">Authenticating Admin Session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'SUPER_ADMIN') {
    return (
      <div className="p-8 max-w-lg mx-auto my-12 glass-panel rounded-2xl border border-rose-500/30 text-center">
        <h2 className="text-2xl font-bold text-rose-400 mb-2">Access Forbidden</h2>
        <p className="text-slate-400 text-sm mb-4">
          Your active role (<span className="text-amber-400 font-mono">{user.role}</span>) does not have authorization to view this administrative resource.
        </p>
      </div>
    );
  }

  return children;
}
