import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/client';
import { StatCard } from '../components/StatCard';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  FileEdit,
  Layers,
  FileText,
  Mail,
  MailWarning,
  Briefcase,
  Users,
  PlusCircle,
  Activity,
  ArrowRight,
  Clock,
  Loader2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export function Dashboard() {
  const navigate = useNavigate();

  // 1. Fetch Real Database Stats
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats,
    refetchInterval: 10000,
  });

  // 2. Fetch Recent Activity Logs
  const { data: logsData } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: adminApi.getActivityLogs,
  });

  // 3. Fetch Recent Messages
  const { data: messagesData } = useQuery({
    queryKey: ['recentMessages'],
    queryFn: () => adminApi.getCollection('messages'),
  });

  const stats = statsData?.data || {};
  const logs = logsData?.data || [];
  const messages = messagesData?.data || [];

  const chartData = [
    { name: 'Projects', count: stats.total_projects || 0 },
    { name: 'Services', count: stats.total_services || 0 },
    { name: 'Blogs', count: stats.total_blogs || 0 },
    { name: 'Messages', count: stats.total_messages || 0 },
    { name: 'Jobs', count: stats.active_jobs || 0 },
    { name: 'Subscribers', count: stats.newsletter_subscribers || 0 },
  ];

  if (statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400 mb-3" />
        <p className="text-xs">Fetching Real Database Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Executive SaaS Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time database analytics & operational telemetry for Growth IT Solution.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/admin/projects')}
            className="px-3.5 py-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-semibold hover:bg-sky-500/25 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
          <button
            onClick={() => navigate('/admin/blogs')}
            className="px-3.5 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-semibold hover:bg-purple-500/25 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Write Blog</span>
          </button>
        </div>
      </div>

      {/* Real Statistics Grid (9 Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Projects" value={stats.total_projects || 0} icon={FolderKanban} color="sky" />
        <StatCard title="Published Projects" value={stats.published_projects || 0} icon={CheckCircle2} color="emerald" />
        <StatCard title="Draft Projects" value={stats.draft_projects || 0} icon={FileEdit} color="amber" />
        
        <StatCard title="Total Services" value={stats.total_services || 0} icon={Layers} color="indigo" />
        <StatCard title="Total Blogs" value={stats.total_blogs || 0} icon={FileText} color="purple" />
        <StatCard title="Total Messages" value={stats.total_messages || 0} icon={Mail} color="sky" />
        
        <StatCard title="Unread Messages" value={stats.unread_messages || 0} icon={MailWarning} color="rose" badge={stats.unread_messages > 0 ? "Action Required" : null} />
        <StatCard title="Active Jobs" value={stats.active_jobs || 0} icon={Briefcase} color="emerald" />
        <StatCard title="Subscribers" value={stats.newsletter_subscribers || 0} icon={Users} color="purple" />
      </div>

      {/* Analytics Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Data Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Database Resource Metrics</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-4">Quick Management Actions</h3>
            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/admin/services')}
                className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-xs text-slate-200 flex items-center justify-between transition-colors"
              >
                <span>Manage IT Services</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
              </button>
              <button
                onClick={() => navigate('/admin/messages')}
                className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-xs text-slate-200 flex items-center justify-between transition-colors"
              >
                <span>Review Client Inquiries ({stats.unread_messages || 0} unread)</span>
                <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-xs text-slate-200 flex items-center justify-between transition-colors"
              >
                <span>Manage System Users</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              </button>
              <button
                onClick={() => navigate('/admin/settings')}
                className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-xs text-slate-200 flex items-center justify-between transition-colors"
              >
                <span>System Configuration</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Recent Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200">Recent Client Inquiries</h3>
            <button
              onClick={() => navigate('/admin/messages')}
              className="text-xs text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {messages.slice(0, 4).map((msg) => (
              <div key={msg.id} className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200">{msg.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${msg.status === 'unread' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'}`}>
                    {msg.status}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] font-medium">{msg.subject}</p>
                <p className="text-slate-500 text-[11px] truncate mt-1">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Logs */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200">System Activity Audit Log</h3>
            <button
              onClick={() => navigate('/admin/activity-logs')}
              className="text-xs text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Audit Trail</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {logs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-200">{log.action}</p>
                  <p className="text-[11px] text-slate-400">{log.details}</p>
                  <span className="text-[10px] text-sky-400 font-mono mt-1 block">By {log.performed_by}</span>
                </div>
                <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
