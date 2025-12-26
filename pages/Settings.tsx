import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, NeuralButton, NeuralInput, NeuralSwitch, NeuralBadge } from '../components/UIElements';

export const Settings: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [giteeToken, setGiteeToken] = useState(profile?.gitee_token || '');
  const [githubToken, setGithubToken] = useState(profile?.github_token || '');
  const [notifications, setNotifications] = useState({
    email: true,
    projectUpdates: true,
    deployments: true,
    billing: true,
  });

  return (
    <div className="p-4 md:p-12 space-y-8 max-w-4xl mx-auto animate-modal-fade">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
          Settings
        </h1>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
          Configure your account preferences
        </p>
      </div>

      {/* Account Settings */}
      <GlassCard className="p-8 space-y-6">
        <h3 className="text-lg font-black text-white border-b border-white/5 pb-4">
          Account
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/40">
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">Email Address</p>
              <p className="text-xs text-slate-500">{profile?.email}</p>
            </div>
            <NeuralBadge variant="primary">Verified</NeuralBadge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/40">
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">Password</p>
              <p className="text-xs text-slate-500">Last changed 30 days ago</p>
            </div>
            <NeuralButton variant="secondary" size="xs">
              Change
            </NeuralButton>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/40">
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500">Add an extra layer of security</p>
            </div>
            <NeuralButton variant="secondary" size="xs">
              Enable
            </NeuralButton>
          </div>
        </div>
      </GlassCard>

      {/* Integrations */}
      <GlassCard className="p-8 space-y-6">
        <h3 className="text-lg font-black text-white border-b border-white/5 pb-4">
          Integrations
        </h3>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">Gitee</h4>
                <p className="text-xs text-slate-500">Connect to deploy to Gitee Pages</p>
              </div>
            </div>
            <NeuralInput
              type="password"
              value={giteeToken}
              onChange={(e) => setGiteeToken(e.target.value)}
              placeholder="Gitee access token"
            />
            <NeuralButton variant="primary" size="sm">
              Save Token
            </NeuralButton>
          </div>

          <div className="h-px bg-white/5" />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">GitHub</h4>
                <p className="text-xs text-slate-500">Connect to sync repositories</p>
              </div>
            </div>
            <NeuralInput
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="GitHub personal access token"
            />
            <NeuralButton variant="primary" size="sm">
              Save Token
            </NeuralButton>
          </div>
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard className="p-8 space-y-6">
        <h3 className="text-lg font-black text-white border-b border-white/5 pb-4">
          Notifications
        </h3>

        <div className="space-y-4">
          <NeuralSwitch
            checked={notifications.email}
            onChange={(checked) => setNotifications({ ...notifications, email: checked })}
            label="Email Notifications"
            description="Receive email updates about your account"
          />

          <NeuralSwitch
            checked={notifications.projectUpdates}
            onChange={(checked) => setNotifications({ ...notifications, projectUpdates: checked })}
            label="Project Updates"
            description="Get notified when projects are generated or updated"
          />

          <NeuralSwitch
            checked={notifications.deployments}
            onChange={(checked) => setNotifications({ ...notifications, deployments: checked })}
            label="Deployment Notifications"
            description="Receive alerts about deployment status"
          />

          <NeuralSwitch
            checked={notifications.billing}
            onChange={(checked) => setNotifications({ ...notifications, billing: checked })}
            label="Billing Updates"
            description="Get notified about payments and subscription changes"
          />
        </div>
      </GlassCard>

      {/* Appearance */}
      <GlassCard className="p-8 space-y-6">
        <h3 className="text-lg font-black text-white border-b border-white/5 pb-4">
          Appearance
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {['Dark', 'Light', 'Auto'].map((theme) => (
            <button
              key={theme}
              className={`p-6 rounded-xl border transition-all ${
                theme === 'Dark'
                  ? 'bg-[#00DC82]/10 border-[#00DC82] text-[#00DC82]'
                  : 'bg-black/40 border-white/5 text-slate-500 hover:text-white'
              }`}
            >
              <div className="text-2xl mb-2">
                {theme === 'Dark' ? '🌙' : theme === 'Light' ? '☀️' : '⚡'}
              </div>
              <p className="text-xs font-black uppercase tracking-widest">{theme}</p>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard className="p-8 space-y-6 border-red-500/20">
        <h3 className="text-lg font-black text-red-400 border-b border-red-500/20 pb-4">
          Danger Zone
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">Sign Out</p>
              <p className="text-xs text-slate-400">Sign out from your account</p>
            </div>
            <NeuralButton
              variant="danger"
              size="sm"
              onClick={signOut}
            >
              Sign Out
            </NeuralButton>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="space-y-1">
              <p className="text-sm font-bold text-red-400">Delete Account</p>
              <p className="text-xs text-slate-400">Permanently delete your account and all data</p>
            </div>
            <NeuralButton
              variant="danger"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure? This action cannot be undone.')) {
                  alert('Account deletion would be processed here');
                }
              }}
            >
              Delete
            </NeuralButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
