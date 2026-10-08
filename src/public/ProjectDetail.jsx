import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { ArrowLeft, ExternalLink, CheckCircle2, Cpu } from 'lucide-react';

export function ProjectDetail() {
  const { slug } = useParams();

  const { data: portfolioData, isLoading } = useQuery({
    queryKey: ['publicPortfolio'],
    queryFn: () => publicApi.getPortfolio(),
  });

  const projects = portfolioData?.data || [];
  const project = projects.find((p) => p.slug === slug || p.id === slug) || projects[0];

  if (isLoading) {
    return <div className="py-32 text-center text-slate-400">Loading Case Study...</div>;
  }

  if (!project) {
    return (
      <div className="py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold">Project Not Found</h2>
        <Link to="/projects" className="text-sky-400 underline text-xs">Back to Portfolio</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-bold hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Case Studies</span>
      </Link>

      {/* Main Cover & Header */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="aspect-video w-full bg-slate-950 max-h-[420px] overflow-hidden">
          <img src={project.main_image || 'assets/hero_graphic.jpg'} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <div className="p-8 sm:p-12 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="px-3.5 py-1 rounded-full bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
              {project.category}
            </span>
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
              >
                <span>Visit Live System</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">{project.title}</h1>
          <p className="text-sm text-slate-300 leading-relaxed">{project.short_description}</p>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Client:</span>
              <strong className="text-slate-200">{project.client_name || 'Global Enterprise'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Category:</span>
              <strong className="text-sky-400">{project.category}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Status:</span>
              <strong className="text-emerald-400 capitalize">{project.status || 'Live'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack & Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Technologies */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400" />
            <span>Technologies & Frameworks</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(project.technologies) ? project.technologies : String(project.technologies || '').split(',')).map((t, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200">
                {t.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Key System Features</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {(Array.isArray(project.features) ? project.features : String(project.features || '').split(',')).map((f, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{f.trim()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gallery Showcase */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-100">Project Screenshot Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {project.gallery.map((imgUrl, idx) => (
              <div key={idx} className="aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                <img src={imgUrl} alt={`Gallery ${idx + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Description */}
      {project.full_description && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-2xl font-bold text-slate-100">Deep-Dive Implementation Report</h3>
          <div
            className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: project.full_description }}
          />
        </div>
      )}
    </div>
  );
}
