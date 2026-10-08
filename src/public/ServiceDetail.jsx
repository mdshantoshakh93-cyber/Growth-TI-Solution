import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';

export function ServiceDetail() {
  const { slug } = useParams();

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['publicServices'],
    queryFn: publicApi.getServices,
  });

  const services = servicesData?.data || [];
  const service = services.find((s) => s.slug === slug || s.id === slug) || services[0];

  if (isLoading) {
    return <div className="py-32 text-center text-slate-400">Loading Service Details...</div>;
  }

  if (!service) {
    return (
      <div className="py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold">Service Not Found</h2>
        <Link to="/services" className="text-sky-400 underline text-xs">Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Link to="/services" className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-bold hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Services</span>
      </Link>

      {/* Banner */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-4xl shadow-inner">
          {service.icon || '⚡'}
        </div>

        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">{service.name}</h1>
        <p className="text-base text-slate-300 leading-relaxed max-w-3xl">{service.short_description || service.description}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
          <span className="text-sm font-mono text-emerald-400 font-bold">Pricing: {service.pricing || 'Custom Quote'}</span>
          <Link
            to="/contact"
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 flex items-center gap-1.5"
          >
            <span>Book Strategy Call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Features & Benefits split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            <span>Key Service Capabilities</span>
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            {(Array.isArray(service.features) ? service.features : String(service.features || '').split(',')).map((f, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{f.trim()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Business Outcomes & Benefits</span>
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            {(Array.isArray(service.benefits) ? service.benefits : String(service.benefits || '').split(',')).map((b, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{b.trim()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full Description / Rich Content */}
      {service.full_description && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-xl font-bold text-slate-100">Overview & Architecture Breakdown</h3>
          <div
            className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: service.full_description }}
          />
        </div>
      )}
    </div>
  );
}
