import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'growthitsolution@gmail.com',
      password: 'growthitsolution123',
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      setIsSubmitting(true);
      const res = await login(data);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setServerError(res.error || 'Authentication failed.');
      }
    } catch (err) {
      setServerError(err.message || 'Server connection error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative z-10 border border-slate-800 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-sky-500/20">
            <ShieldCheck className="w-7 h-7 text-slate-950" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Growth IT Solution</h1>
          <p className="text-xs text-sky-400 font-semibold uppercase tracking-widest mt-1">Enterprise Admin Portal</p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                {...register('email')}
                className="w-full pl-10 pr-4 py-2.5 text-xs glass-input rounded-xl text-slate-100 placeholder-slate-500"
                placeholder="admin@growthit.com"
              />
            </div>
            {errors.email && (
              <p className="text-rose-400 text-[11px] mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                {...register('password')}
                className="w-full pl-10 pr-4 py-2.5 text-xs glass-input rounded-xl text-slate-100 placeholder-slate-500"
                placeholder="••••••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-rose-400 text-[11px] mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Credentials Note */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-200 mb-2">Default Super Admin Credentials:</p>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-[10px] space-y-1">
            <p><span className="text-slate-500">Email:</span> <span className="text-sky-400">growthitsolution@gmail.com</span></p>
            <p><span className="text-slate-500">Password:</span> <span className="text-emerald-400">growthitsolution123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
