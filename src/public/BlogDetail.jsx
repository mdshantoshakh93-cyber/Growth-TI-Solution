import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

export function BlogDetail() {
  const { slug } = useParams();

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['publicBlogs'],
    queryFn: publicApi.getBlogs,
  });

  const blogs = blogsData?.data || [];
  const blog = blogs.find((b) => b.slug === slug || b.id === slug) || blogs[0];

  if (isLoading) {
    return <div className="py-32 text-center text-slate-400">Loading Article...</div>;
  }

  if (!blog) {
    return (
      <div className="py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold">Article Not Found</h2>
        <Link to="/blog" className="text-sky-400 underline text-xs">Back to Articles</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-bold hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Articles</span>
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
            {blog.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            {blog.publish_date || new Date().toISOString().split('T')[0]}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            {blog.author || 'Growth IT Team'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
          {blog.title}
        </h1>

        <p className="text-base text-slate-300 leading-relaxed italic border-l-2 border-sky-500 pl-4 py-1">
          {blog.excerpt}
        </p>
      </div>

      {/* Featured Banner */}
      <div className="aspect-video w-full rounded-3xl bg-slate-950 overflow-hidden border border-slate-800">
        <img src={blog.featured_image || 'assets/hero_graphic.jpg'} alt={blog.title} className="w-full h-full object-cover" />
      </div>

      {/* HTML Content */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800">
        <div
          className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: blog.content || '<p>Article content coming soon...</p>' }}
        />
      </div>

      {/* Tags Footer */}
      {blog.tags && (
        <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-800">
          <Tag className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-400">Tags:</span>
          {(Array.isArray(blog.tags) ? blog.tags : String(blog.tags).split(',')).map((t, idx) => (
            <span key={idx} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300">
              #{t.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
