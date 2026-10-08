'use client';

import { useState, useEffect } from 'react';
import { Briefcase, TrendingUp } from 'lucide-react';

export default function PortfolioSection() {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPortfolio(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section id="portfolio" className="py-24 bg-slate-950 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
            <Briefcase className="w-4 h-4" /> Enterprise Case Studies & Track Record
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Proven <span className="text-gradient">Production Success</span>
          </h2>
          <p className="mt-4 text-gray-400 text-base leading-relaxed">
            Real-world enterprise deployments across FinTech, HealthTech, E-Commerce, and Cloud Infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
                    {item.category}
                  </span>
                  <span className="font-mono text-gray-400">{item.client}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Impact Metric Banner */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 flex items-center gap-3 text-xs font-semibold text-cyan-300 mb-6">
                  <TrendingUp className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>{item.metrics}</span>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {item.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-slate-900 border border-white/10 text-[11px] text-gray-300 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
