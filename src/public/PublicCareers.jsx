import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { ArrowRight, MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';

export function PublicCareers() {
  const { data: careersData, isLoading } = useQuery({
    queryKey: ['publicCareers'],
    queryFn: publicApi.getCareers,
  });

  const jobs = careersData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
          Careers at Growth IT Solution
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Build the Future of Enterprise IT with Us
        </h1>
        <p className="text-slate-300 text-sm">
          Join a global team of principal architects, AI engineers, and security specialists shaping mission-critical software.
        </p>
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading Job Openings...</div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-bold border border-sky-500/20">
                    {job.department}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    {job.employment_type}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-100">{job.job_title || job.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salary_range}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Deadline: {job.deadline || 'Open until filled'}
                  </span>
                </div>
              </div>

              <Link
                to={`/careers/${job.slug || job.id}`}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shrink-0"
              >
                <span>View Job & Apply</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
