'use client';

import { useState } from 'react';
import { Calculator, CheckCircle2, Sparkles, Clock, ArrowRight, RefreshCw } from 'lucide-react';

const categories = [
  { id: 'Web Development', label: 'Next.js Modern Web App', icon: '🌐' },
  { id: 'Cloud Infrastructure', label: 'Cloud Architecture & DevOps', icon: '☁️' },
  { id: 'Artificial Intelligence', label: 'Custom Agentic AI Engine', icon: '🤖' },
  { id: 'Security & Compliance', label: 'Security Audit & Compliance', icon: '🛡️' },
];

const scales = [
  { id: 'Startup MVP', label: 'Startup MVP', desc: 'Single environment, core features, fast launch' },
  { id: 'Growth Scale', label: 'Growth Scale', desc: 'Multi-env setup, auto-scaling, analytics' },
  { id: 'Enterprise Multi-Region', label: 'Enterprise', desc: 'Zero-downtime multi-region HA, dedicated SLA' },
];

const addOns = [
  { id: 'cicd', label: 'Automated CI/CD Pipeline & GitHub Actions' },
  { id: 'vector_rag', label: 'Vector DB Knowledge Base (RAG)' },
  { id: 'websockets', label: 'Real-Time WebSocket Sync' },
  { id: 'compliance', label: 'SOC2 / GDPR Compliance Hardening' },
  { id: 'sla_monitoring', label: '24/7 Operational SLA Monitoring' },
];

export default function EstimatorWidget() {
  const [selectedCategory, setSelectedCategory] = useState('Web Development');
  const [selectedScale, setSelectedScale] = useState('Growth Scale');
  const [selectedAddOns, setSelectedAddOns] = useState(['cicd', 'websockets']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const toggleAddOn = (id) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          scale: selectedScale,
          features: selectedAddOns,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="estimator" className="py-20 bg-slate-900/50 border-y border-white/10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <Calculator className="w-4 h-4" /> Interactive Scope & Budget Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Estimate Your <span className="text-gradient">Project Cost & Timeline</span>
          </h2>
          <p className="mt-3 text-gray-400 text-base">
            Select your architectural parameters to calculate immediate estimated scope, delivery timeframe, and investment ranges.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-8">
            {/* Step 1: Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                1. Select Solution Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      selectedCategory === cat.id
                        ? 'border-blue-500 bg-blue-600/15 text-white shadow-lg shadow-blue-500/10'
                        : 'border-white/10 bg-slate-900/60 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Scale */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                2. Select Project Scale
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {scales.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedScale(s.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedScale === s.id
                        ? 'border-indigo-500 bg-indigo-600/15 text-white shadow-lg shadow-indigo-500/10'
                        : 'border-white/10 bg-slate-900/60 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-sm font-semibold">{s.label}</div>
                    <div className="text-[11px] text-gray-400 mt-1 leading-tight">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Add-Ons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                3. Custom Architecture Add-Ons
              </label>
              <div className="space-y-2.5">
                {addOns.map((addon) => {
                  const active = selectedAddOns.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddOn(addon.id)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        active
                          ? 'border-cyan-500/60 bg-cyan-500/10 text-white'
                          : 'border-white/5 bg-slate-900/40 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      <span className="text-sm font-medium">{addon.label}</span>
                      <CheckCircle2
                        className={`w-5 h-5 transition-colors ${
                          active ? 'text-cyan-400 fill-cyan-400/20' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold text-base rounded-xl shadow-xl shadow-blue-600/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Calculating Estimate...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Calculate Instant Proposal Estimate
                </>
              )}
            </button>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-2xl border border-blue-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 relative flex flex-col justify-between h-full min-h-[460px]">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <span className="text-sm font-semibold text-gray-400">Proposal Summary</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
                  Instant Output
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Estimated Budget Range</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      ${result ? result.estimatedCostUSD.toLocaleString() : '6,900'}
                    </span>
                    <span className="text-sm text-gray-400 font-mono">USD</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Estimated Delivery Timeframe</span>
                  <div className="flex items-center gap-2 mt-1 text-xl font-bold text-cyan-400">
                    <Clock className="w-5 h-5" />
                    <span>{result ? result.estimatedDurationDays : '31'} Business Days</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="font-semibold text-white">{selectedCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Scale Level:</span>
                    <span className="font-semibold text-white">{selectedScale}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Add-Ons:</span>
                    <span className="font-semibold text-cyan-400">{selectedAddOns.length} selected</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href="#contact"
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                Lock In Proposal & Consult Architect <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
