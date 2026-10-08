import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { ArrowRight, ExternalLink } from 'lucide-react';

export function PublicPortfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: portfolioData, isLoading } = useQuery({
    queryKey: ['publicPortfolio'],
    queryFn: () => publicApi.getPortfolio(),
  });

  const categories = [
    'All',
    'Web',
    'Software',
    'Mobile App',
    'E-commerce',
    'UI/UX',
    'ERP',
    'Cloud Architecture',
    'Enterprise AI'
  ];

  const projects = portfolioData?.data || [];

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
          Our Portfolio & Case Studies
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Enterprise Projects Engineered for Impact
        </h1>
        <p className="text-slate-300 text-sm">
          Explore real-world software, AI, and cloud infrastructure systems delivered for global enterprise clients.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                : 'glass-panel text-slate-300 hover:text-slate-100 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading Portfolio Data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group glass-panel rounded-3xl border border-slate-800 overflow-hidden hover:border-sky-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="aspect-video w-full bg-slate-950 overflow-hidden relative">
                  <img
                    src={project.main_image || 'assets/hero_graphic.jpg'}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-[11px] font-bold text-sky-400 backdrop-blur-md">
                    {project.category}
                  </span>
                </div>

                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-bold text-slate-100 group-hover:text-sky-400 transition-colors">{project.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{project.short_description}</p>

                  {/* Tech Stack Pills */}
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(Array.isArray(project.technologies) ? project.technologies : String(project.technologies).split(',')).map((tech, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Client: <strong>{project.client_name || 'Enterprise Client'}</strong></span>
                <Link
                  to={`/projects/${project.slug}`}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Project Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
