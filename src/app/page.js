import ServicesShowcase from '@/components/ServicesShowcase';
import EstimatorWidget from '@/components/EstimatorWidget';
import PortfolioSection from '@/components/PortfolioSection';
import ContactSection from '@/components/ContactSection';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-cyan-400/20 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-blue-500/30 text-blue-400 text-xs font-semibold mb-8 shadow-xl">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Next-Gen Enterprise Engineering & AI Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-5xl mx-auto leading-[1.15]">
            Architecting <span className="text-gradient">High-Growth Digital Infrastructure</span> & Agentic AI
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Growth IT Solution delivers production-grade multi-cloud migrations, custom autonomous LLM workflows, and modern web applications engineered for hyper-growth tech leaders.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#estimator"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold text-base rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
            >
              <span>Calculate Scope Budget</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#services"
              className="w-full sm:w-auto px-8 py-4 glass-panel text-gray-200 hover:text-white hover:border-blue-500/40 font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Explore Practice Areas
            </a>
          </div>

          {/* Key Metrics Counter Grid */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <div className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1">
                <span>99.99%</span>
              </div>
              <div className="text-xs text-gray-400 font-medium mt-1">Uptime SLA Guarantee</div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <div className="text-3xl font-extrabold text-blue-400 tracking-tight flex items-center justify-center gap-1">
                <span>250+</span>
              </div>
              <div className="text-xs text-gray-400 font-medium mt-1">Enterprise Deployments</div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <div className="text-3xl font-extrabold text-cyan-400 tracking-tight flex items-center justify-center gap-1">
                <span>4.2x</span>
              </div>
              <div className="text-xs text-gray-400 font-medium mt-1">Average Latency Speedup</div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <div className="text-3xl font-extrabold text-purple-400 tracking-tight flex items-center justify-center gap-1">
                <span>SOC2</span>
              </div>
              <div className="text-xs text-gray-400 font-medium mt-1">Security Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesShowcase />

      {/* Scope & Cost Estimator Tool */}
      <EstimatorWidget />

      {/* Enterprise Portfolio */}
      <PortfolioSection />

      {/* Consultation & Contact */}
      <ContactSection />
    </div>
  );
}
