import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';

export function PublicBlog() {
  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['publicBlogs'],
    queryFn: publicApi.getBlogs,
  });

  const blogs = blogsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
          Technical Blog & Insights
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Cloud Architecture, AI & DevOps Articles
        </h1>
        <p className="text-slate-300 text-sm">
          Deep-dive technical guides written by our principal architects and engineering leaders.
        </p>
      </div>

      {/* Blogs Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading Articles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="group glass-panel rounded-3xl border border-slate-800 overflow-hidden hover:border-sky-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="aspect-video w-full bg-slate-950 overflow-hidden relative">
                  <img
                    src={blog.featured_image || 'assets/hero_graphic.jpg'}
                    alt={blog.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-[11px] font-bold text-sky-400 backdrop-blur-md">
                    {blog.category}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      {blog.publish_date || new Date().toISOString().split('T')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      {blog.author || 'Engineering Team'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-sky-400 transition-colors">{blog.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{blog.excerpt}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <Tag className="w-3 h-3 text-sky-400" />
                  <span>{(Array.isArray(blog.tags) ? blog.tags : String(blog.tags || '').split(','))[0] || 'Tech'}</span>
                </div>
                <Link
                  to={`/blog/${blog.slug}`}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Read Article</span>
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
