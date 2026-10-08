import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Star,
  ShieldCheck,
  Zap,
  Globe,
  Award,
  Cpu,
  Clock,
  Code
} from 'lucide-react';

export function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Fetch API Data
  const { data: settingsData } = useQuery({ queryKey: ['publicSettings'], queryFn: publicApi.getSiteSettings });
  const { data: servicesData } = useQuery({ queryKey: ['publicServices'], queryFn: publicApi.getServices });
  const { data: portfolioData } = useQuery({ queryKey: ['publicPortfolio'], queryFn: () => publicApi.getPortfolio() });
  const { data: testimonialsData } = useQuery({ queryKey: ['publicTestimonials'], queryFn: publicApi.getTestimonials });
  const { data: pricingData } = useQuery({ queryKey: ['publicPricing'], queryFn: publicApi.getPricing });
  const { data: faqsData } = useQuery({ queryKey: ['publicFaqs'], queryFn: publicApi.getFaqs });

  const settings = settingsData?.data || {};
  const services = servicesData?.data || [];
  const projects = portfolioData?.data || [];
  const testimonials = testimonialsData?.data || [];
  const pricing = pricingData?.data || [];
  const faqs = faqsData?.data || [];

  const whyChooseUs = settings.why_choose_us || [
    { title: 'Enterprise Architecture', description: 'Built with microservices, zero-trust security and scalable cloud infrastructure.' },
    { title: 'Cutting-Edge AI Models', description: 'Integrating modern LLMs and vector search RAG systems to automate enterprise data.' },
    { title: 'Dedicated Support', description: 'Round-the-clock engineering monitoring and proactive threat resolution.' }
  ];

  const processSteps = settings.process_steps || [
    { step: '01', title: 'Discovery & Audit', description: 'We analyze your current infrastructure, architecture and business goals.' },
    { step: '02', title: 'Strategy & Engineering', description: 'Our senior engineers architect a custom high-availability solution.' },
    { step: '03', title: 'Deployment & Scaling', description: 'We launch with zero downtime, continuous integration, and monitoring.' }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* DYNAMIC HERO SECTION WITH BACKGROUND IMAGE */}
      <section className="relative pt-24 pb-20 overflow-hidden min-h-[640px] flex items-center justify-center">
        {/* Professional Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.hero_image || 'assets/hero_graphic.jpg'}
            alt="Enterprise Technology Infrastructure"
            className="w-full h-full object-cover opacity-20 filter contrast-125 saturate-150 scale-105"
            onError={(e) => { e.target.src = 'assets/hero_graphic.jpg'; }}
          />
          {/* Multi-layered Dark Gradient Masks */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/75 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />
          {/* Glowing Ambient Light Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-500/20 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Hero Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-sky-500/30 text-sky-400 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-2 shadow-xl shadow-sky-500/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{settings.hero_badge || 'Next-Gen Enterprise IT Engine & AI Solutions'}</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-100 tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6 drop-shadow-lg">
            {settings.hero_heading || 'Grow Your Business With Smart Technology'}
          </h1>

          {/* Hero Description */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal drop-shadow-md">
            {settings.hero_description || 'Growth IT Solution provides innovative software, web, mobile and digital solutions that help businesses grow faster, work smarter and operate more efficiently.'}
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <Link
              to={settings.hero_cta_primary_url || '/contact'}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>{settings.hero_cta_primary_label || 'Get Started'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={settings.hero_cta_secondary_url || '/services'}
              className="w-full sm:w-auto px-8 py-4 glass-panel hover:bg-slate-900/80 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700/80 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <span>{settings.hero_cta_secondary_label || 'Explore Services'}</span>
            </Link>
          </div>

          {/* Statistics Counters */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-300 text-center max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono">{settings.stats_projects || '150+'}</div>
              <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Projects Delivered</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">{settings.stats_clients || '98%'}</div>
              <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Client Satisfaction</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{settings.stats_uptime || '99.99%'}</div>
              <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">SLA Uptime</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">{settings.stats_satisfaction || '24/7'}</div>
              <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Engineering Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">Why Partner With Us</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">Engineered for Scalability & Speed</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyChooseUs.map((item, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-sky-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                {idx === 0 ? <ShieldCheck className="w-6 h-6" /> : idx === 1 ? <Cpu className="w-6 h-6 text-indigo-400" /> : <Clock className="w-6 h-6 text-emerald-400" />}
              </div>
              <h4 className="text-xl font-bold text-slate-100">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC SERVICES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">Our Core Capabilities</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">Enterprise Solutions Engineered for Scale</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group glass-panel p-8 rounded-3xl border border-slate-800/80 hover:border-sky-500/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
                  {service.icon || '⚡'}
                </div>
                <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-sky-400 transition-colors">{service.name || service.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{service.short_description || service.tagline || service.description}</p>
              </div>

              <Link
                to={`/services/${service.slug}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors pt-4 border-t border-slate-800/60"
              >
                <span>Learn More Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* OUR DEVELOPMENT PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">How We Work</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">Our Proven Engineering Methodology</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {processSteps.map((step, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden">
              <span className="text-4xl font-extrabold text-sky-500/20 font-mono absolute top-4 right-4">{step.step || `0${idx + 1}`}</span>
              <h4 className="text-xl font-bold text-slate-100 pt-2">{step.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS PORTFOLIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">Client Success Stories</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">Featured Case Studies</h3>
          </div>
          <Link to="/projects" className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1">
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.slice(0, 4).map((project) => (
            <div key={project.id} className="group glass-panel rounded-3xl border border-slate-800 overflow-hidden hover:border-sky-500/40 transition-all">
              <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                <img
                  src={project.main_image || project.image_url || 'assets/hero_graphic.jpg'}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-[11px] font-bold text-sky-400 backdrop-blur-md">
                  {project.category || 'Engineering'}
                </div>
              </div>

              <div className="p-8 space-y-4">
                <h4 className="text-2xl font-bold text-slate-100 group-hover:text-sky-400 transition-colors">{project.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{project.short_description || project.solution}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400 font-mono">Client: {project.client_name || 'Enterprise Client'}</span>
                  <Link to={`/projects/${project.slug}`} className="text-xs font-bold text-sky-400 flex items-center gap-1">
                    <span>Explore Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC PRICING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">Transparent Investment</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">Flexible Engineering & Retainer Plans</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricing.map((plan) => (
            <div
              key={plan.id}
              className={`glass-panel p-8 rounded-3xl border flex flex-col justify-between transition-all ${
                plan.highlighted || plan.featured ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-2xl bg-sky-500/5' : 'border-slate-800'
              }`}
            >
              <div>
                {(plan.highlighted || plan.featured) && (
                  <span className="px-3 py-1 rounded-full bg-sky-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider mb-4 inline-block shadow-md">
                    Most Popular
                  </span>
                )}
                <h4 className="text-2xl font-bold text-slate-100 mb-2">{plan.tier_name || plan.plan_name}</h4>
                <p className="text-xs text-slate-400 mb-6">{plan.billing_cycle || plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-100 font-mono">${plan.price_usd || plan.price}</span>
                  <span className="text-slate-400 text-xs font-normal"> / project</span>
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
                  plan.highlighted || plan.featured
                    ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {plan.cta || 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">Client Feedback</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">Trusted by CTOs & Technical Leaders</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{t.comment || t.review}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <img src={t.avatar_url || t.profile_image || 'assets/logo.jpg'} alt={t.client_name || t.name} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                <div>
                  <div className="font-bold text-slate-100 text-xs">{t.client_name || t.name}</div>
                  <div className="text-[11px] text-slate-400">{t.role || t.position} at {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">Got Questions?</h2>
          <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={faq.id || idx} className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                className="w-full p-5 text-left font-bold text-sm text-slate-100 flex items-center justify-between gap-4"
              >
                <span>{faq.question}</span>
                {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-sky-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {openFaqIndex === idx && (
                <div className="p-5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              {settings.cta_banner_title || 'Ready to Transform Your Technology Stack?'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {settings.cta_banner_description || 'Partner with Growth IT Solution to build scalable cloud software and AI applications tailored for your growth.'}
            </p>
            <div className="pt-4">
              <Link
                to={settings.cta_banner_button_url || '/contact'}
                className="inline-flex items-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-sky-500/25 transition-all hover:scale-105"
              >
                <span>{settings.cta_banner_button_label || 'Schedule a Consultation'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
