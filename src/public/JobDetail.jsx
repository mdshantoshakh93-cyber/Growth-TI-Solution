import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { ArrowLeft, CheckCircle2, Send, MapPin, DollarSign, Calendar, Loader2 } from 'lucide-react';

export function JobDetail() {
  const { slug } = useParams();
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: careersData, isLoading } = useQuery({
    queryKey: ['publicCareers'],
    queryFn: publicApi.getCareers,
  });

  const jobs = careersData?.data || [];
  const job = jobs.find((j) => j.slug === slug || j.id === slug) || jobs[0];

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await publicApi.submitContact({
        name: applicantName,
        email: applicantEmail,
        subject: `Application for ${job.job_title || job.title}`,
        message: `Portfolio/Resume URL: ${portfolioUrl}\n\nCover Letter:\n${coverLetter}`,
        service: 'Job Application',
      });
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit application: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="py-32 text-center text-slate-400">Loading Job Details...</div>;
  }

  if (!job) {
    return (
      <div className="py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold">Job Posting Not Found</h2>
        <Link to="/careers" className="text-sky-400 underline text-xs">Back to Careers</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Link to="/careers" className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-bold hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Open Positions</span>
      </Link>

      {/* Header */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
            {job.department}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
            {job.employment_type}
          </span>
        </div>

        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">{job.job_title || job.title}</h1>
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sky-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-emerald-400">
            <DollarSign className="w-4 h-4" />
            {job.salary_range}
          </span>
          <span className="flex items-center gap-1.5 text-purple-300">
            <Calendar className="w-4 h-4" />
            Deadline: {job.deadline || 'Open until filled'}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{job.description}</p>
      </div>

      {/* Responsibilities & Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-xl font-bold text-slate-100">Key Responsibilities</h3>
          <ul className="space-y-3 text-xs text-slate-300">
            {(Array.isArray(job.responsibilities) ? job.responsibilities : String(job.responsibilities || '').split(',')).map((r, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{r.trim()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-xl font-bold text-slate-100">Job Requirements</h3>
          <ul className="space-y-3 text-xs text-slate-300">
            {(Array.isArray(job.requirements) ? job.requirements : String(job.requirements || '').split(',')).map((rq, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{rq.trim()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Application Form */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="text-2xl font-bold text-slate-100">Apply for this Position</h3>
        <p className="text-xs text-slate-400">Submit your details directly to our engineering hiring team.</p>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 space-y-2 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
            <h4 className="text-base font-bold">Application Received!</h4>
            <p className="text-xs text-emerald-200">Thank you for applying. Our talent team will review your profile and get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full glass-input rounded-xl p-3 text-slate-100 placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                  className="w-full glass-input rounded-xl p-3 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Portfolio / LinkedIn / Resume URL *</label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                required
                placeholder="https://linkedin.com/in/johndoe or https://github.com/johndoe"
                className="w-full glass-input rounded-xl p-3 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Cover Letter / Note</label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Briefly explain your relevant experience..."
                className="w-full glass-input rounded-xl p-3 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 flex items-center gap-2 transition-all"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Application</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
