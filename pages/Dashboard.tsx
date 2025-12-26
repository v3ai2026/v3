import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, NeuralBadge, NeuralSpinner } from '../components/UIElements';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { stats, trends, recentActivity, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <NeuralSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-12 space-y-8 max-w-7xl mx-auto animate-modal-fade">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
          Dashboard
        </h1>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
          Welcome back, {profile?.full_name || profile?.username}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl">📊</span>
            <NeuralBadge variant="primary">Projects</NeuralBadge>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-white">{stats?.totalProjects || 0}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              +{stats?.monthlyProjects || 0} this month
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl">🚀</span>
            <NeuralBadge variant="secondary">Deployments</NeuralBadge>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-white">{stats?.totalDeployments || 0}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              Total deployments
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl">🤖</span>
            <NeuralBadge variant="primary">AI Usage</NeuralBadge>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-white">{stats?.aiUsageThisMonth || 0}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              Generations this month
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl">⚡</span>
            <NeuralBadge>{profile?.subscription_tier?.toUpperCase()}</NeuralBadge>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#00DC82]">{profile?.ai_credits || 0}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              AI Credits remaining
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Trends Chart */}
      <GlassCard className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">Usage Trends</h3>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Last 6 months activity
            </p>
          </div>
          <NeuralBadge variant="primary">Live Data</NeuralBadge>
        </div>

        {trends && trends.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1e43" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020420',
                  border: '1px solid #1a1e43',
                  borderRadius: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="#00DC82"
                strokeWidth={2}
                name="Projects"
              />
              <Line
                type="monotone"
                dataKey="deployments"
                stroke="#60a5fa"
                strokeWidth={2}
                name="Deployments"
              />
              <Line
                type="monotone"
                dataKey="aiUsage"
                stroke="#f59e0b"
                strokeWidth={2}
                name="AI Usage"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-600">
            <p className="text-sm">No data available yet</p>
          </div>
        )}
      </GlassCard>

      {/* Recent Activity */}
      <GlassCard className="p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-xl font-black text-white">Recent Activity</h3>
          <NeuralBadge variant="secondary">{recentActivity?.length || 0} items</NeuralBadge>
        </div>

        <div className="space-y-3">
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-white/5 hover:border-[#00DC82]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00DC82]/10 flex items-center justify-center text-xl shrink-0">
                  {activity.action_type === 'create_project' && '📊'}
                  {activity.action_type === 'deploy' && '🚀'}
                  {activity.action_type === 'payment' && '💳'}
                  {activity.action_type === 'login' && '🔐'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {activity.description || activity.action_type}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
                <NeuralBadge variant="secondary" className="text-[8px]">
                  {activity.resource_type}
                </NeuralBadge>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-600">
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="group p-8 rounded-3xl bg-gradient-to-br from-[#00DC82]/10 to-transparent border border-[#00DC82]/20 hover:border-[#00DC82]/50 transition-all text-left space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#00DC82]/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            ✨
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-black text-white">Create Project</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Start building with AI assistance
            </p>
          </div>
        </button>

        <button className="group p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/50 transition-all text-left space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            📚
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-black text-white">View Projects</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage your existing projects
            </p>
          </div>
        </button>

        <button className="group p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/50 transition-all text-left space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            ⚙️
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-black text-white">Settings</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure your account
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
