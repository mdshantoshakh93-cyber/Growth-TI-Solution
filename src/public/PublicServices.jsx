import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function PublicServices() {
  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['publicServices'],
    queryFn: publicApi.getServices,
  });

  const services = servicesData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
          Our Services Catalog
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Enterprise Services & Technical Solutions
        </h1>
        <p className="text-slate-300 text-sm">
          Discover our full suite of software development, cloud infrastructure, AI models, and cybersecurity solutions.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="group glass-panel p-8 rounded-3xl border border-slate-800 hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {service.icon || '⚡'}
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-sky-400 transition-colors">{service.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{service.short_description || service.description}</p>

              {/* Features preview */}
              {service.features && (
                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  {(Array.isArray(service.features) ? service.features : String(service.features).split(',')).slice(0, 3).map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{f.trim()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400">{service.pricing || 'Custom Quote'}</span>
              <Link
                to={`/services/${service.slug}`}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
