import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { ShieldCheck, Cpu, Code2, Globe2, Award } from 'lucide-react';

export function About() {
  const { data: teamData } = useQuery({ queryKey: ['publicTeam'], queryFn: publicApi.getTeam });
  const team = teamData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
          About Growth IT Solution
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Architecting High-Performance Cloud & Software Systems
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          We help enterprises build, scale, and secure modern digital applications with cloud-native DevOps, custom AI models, and Zero Trust security auditing.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <Cpu className="w-8 h-8 text-sky-400" />
          <h3 className="font-bold text-slate-100 text-base">Enterprise AI</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Custom LLM fine-tuning, RAG knowledge stores, and automated computer vision models.</p>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <Globe2 className="w-8 h-8 text-indigo-400" />
          <h3 className="font-bold text-slate-100 text-base">Cloud DevOps</h3>
          <p className="text-xs text-slate-400 leading-relaxed">High-availability Kubernetes clusters on AWS, Azure, and Google Cloud with Terraform IaC.</p>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-base">Zero Trust Security</h3>
          <p className="text-xs text-slate-400 leading-relaxed">SOC2 readiness, penetration testing, and automated vulnerability scanning.</p>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <Code2 className="w-8 h-8 text-purple-400" />
          <h3 className="font-bold text-slate-100 text-base">Custom Software</h3>
          <p className="text-xs text-slate-400 leading-relaxed">High-throughput microservices in Go, Node.js, and React tailored to business workflows.</p>
        </div>
      </div>

      {/* Team Showcase */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">Our Leadership</h2>
          <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">Meet the Engineering Team</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.id} className="glass-panel p-6 rounded-3xl border border-slate-800 text-center space-y-3">
              <img src={member.profile_image || 'assets/logo.jpg'} alt={member.name} className="w-20 h-20 rounded-full mx-auto border-2 border-sky-500/30 object-cover" />
              <div>
                <h4 className="font-bold text-slate-100 text-base">{member.name}</h4>
                <p className="text-xs text-sky-400 font-medium">{member.position}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
