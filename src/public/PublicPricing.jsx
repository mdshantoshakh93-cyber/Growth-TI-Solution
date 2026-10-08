import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { CheckCircle2 } from 'lucide-react';

export function PublicPricing() {
  const { data: pricingData, isLoading } = useQuery({
    queryKey: ['publicPricing'],
    queryFn: publicApi.getPricing,
  });

  const pricing = pricingData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
          Transparent Pricing Plans
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Flexible Retainer & Engineering Packages
        </h1>
        <p className="text-slate-300 text-sm">
          Simple, scalable plans tailored to startups and high-growth enterprise teams.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricing.map((plan) => (
          <div
            key={plan.id}
            className={`glass-panel p-8 rounded-3xl border flex flex-col justify-between transition-all ${
              plan.featured ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-2xl bg-sky-500/5' : 'border-slate-800'
            }`}
          >
            <div>
              {plan.featured && (
                <span className="px-3 py-1 rounded-full bg-sky-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider mb-4 inline-block shadow-md">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold text-slate-100 mb-2">{plan.plan_name}</h3>
              <p className="text-xs text-slate-400 mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-100 font-mono">{plan.currency || '$'}{plan.price}</span>
                <span className="text-slate-400 text-xs font-normal"> / month</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800/80 pt-6 mb-8">
                {(Array.isArray(plan.features) ? plan.features : String(plan.features || '').split(',')).map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/contact"
              className={`w-full py-3.5 rounded-2xl text-xs font-extrabold text-center transition-all ${
                plan.featured
                  ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {plan.cta || 'Get Started'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
