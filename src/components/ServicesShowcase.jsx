'use client';

import { useState, useEffect } from 'react';
import { Cloud, Cpu, Globe, ShieldCheck, Check, ArrowRight, Layers } from 'lucide-react';

const iconMap = {
  Cloud: Cloud,
  Cpu: Cpu,
  Globe: Globe,
  ShieldCheck: ShieldCheck,
};

export default function ServicesShowcase() {
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServices(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const categories = ['All', 'Cloud', 'AI / ML', 'Web Development', 'Security'];

  const filteredServices =
    activeTab === 'All'
      ? services
      : services.filter((s) => s.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Layers className="w-4 h-4" /> Practice Areas & Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Enterprise <span className="text-gradient">Engineering Services</span>
          </h2>
          <p className="mt-4 text-gray-400 text-base leading-relaxed">
            High-performance IT infrastructure, custom AI model integration, next-generation web platforms, and cybersecurity auditing.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'glass-card text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredServices.map((service) => {
            const IconComponent = iconMap[service.icon] || Globe;
            return (
              <div
                key={service.id}
                className="glass-card p-8 rounded-2xl border border-white/10 flex flex-col justify-between group hover:border-blue-500/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-gray-400 px-3 py-1 rounded-full bg-slate-900 border border-white/10">
                      Starting at {service.startingPrice}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-8">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-between text-xs font-semibold text-blue-400 hover:text-blue-300 pt-4 border-t border-white/5"
                >
                  <span>Request Technical Specs</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
