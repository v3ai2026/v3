import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, ApiKey } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, NeuralButton, NeuralInput, NeuralBadge, NeuralSpinner } from '../components/UIElements';
import { formatDistanceToNow } from 'date-fns';

export const ApiKeys: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['read']);

  const availableScopes = [
    { value: 'read', label: 'Read', description: 'Read access to projects and data' },
    { value: 'write', label: 'Write', description: 'Create and modify projects' },
    { value: 'deploy', label: 'Deploy', description: 'Deploy projects' },
    { value: 'admin', label: 'Admin', description: 'Full administrative access' },
  ];

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['api-keys', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ApiKey[];
    },
    enabled: !!user,
  });

  const createApiKey = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      // Generate API key
      const key = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const prefix = key.substring(0, 10);

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          key_name: keyName,
          api_key: key,
          key_prefix: prefix,
          scopes: selectedScopes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setIsCreating(false);
      setKeyName('');
      setSelectedScopes(['read']);
    },
  });

  const deleteApiKey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope]
    );
  };

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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
            API Keys
          </h1>
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
            {apiKeys?.length || 0} active keys
          </p>
        </div>
        <NeuralButton
          onClick={() => setIsCreating(true)}
          variant="primary"
          size="lg"
        >
          <span className="mr-2">🔑</span> Create API Key
        </NeuralButton>
      </div>

      {/* Create Key Form */}
      {isCreating && (
        <GlassCard className="p-8 space-y-6 animate-modal-slide">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-xl font-black text-white">Create New API Key</h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <NeuralInput
            label="Key Name"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder="Production API Key"
            required
          />

          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">
              Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableScopes.map((scope) => (
                <button
                  key={scope.value}
                  onClick={() => toggleScope(scope.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedScopes.includes(scope.value)
                      ? 'bg-[#00DC82]/10 border-[#00DC82]'
                      : 'bg-black/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{scope.label}</span>
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        selectedScopes.includes(scope.value)
                          ? 'bg-[#00DC82] border-[#00DC82]'
                          : 'border-slate-700'
                      }`}
                    >
                      {selectedScopes.includes(scope.value) && (
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">{scope.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <NeuralButton
              onClick={() => createApiKey.mutate()}
              loading={createApiKey.isPending}
              variant="primary"
              className="flex-1"
              disabled={!keyName.trim() || selectedScopes.length === 0}
            >
              Generate Key
            </NeuralButton>
            <NeuralButton
              onClick={() => setIsCreating(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </NeuralButton>
          </div>
        </GlassCard>
      )}

      {/* API Keys List */}
      {apiKeys && apiKeys.length === 0 ? (
        <GlassCard className="p-16 text-center space-y-6">
          <div className="text-6xl">🔑</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">No API keys yet</h3>
            <p className="text-slate-500 text-sm">
              Create an API key to integrate with our platform
            </p>
          </div>
          <NeuralButton
            onClick={() => setIsCreating(true)}
            variant="primary"
            size="lg"
          >
            <span className="mr-2">🔑</span> Create First Key
          </NeuralButton>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {apiKeys?.map((key) => (
            <GlassCard key={key.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-white">{key.key_name}</h3>
                    <NeuralBadge variant={key.is_active ? 'primary' : 'secondary'}>
                      {key.is_active ? 'Active' : 'Inactive'}
                    </NeuralBadge>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-slate-400">{key.key_prefix}•••••••••••••</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(key.api_key);
                        alert('API key copied to clipboard');
                      }}
                      className="text-[#00DC82] hover:text-[#00DC82]/80 transition-colors"
                    >
                      📋
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {key.scopes?.map((scope) => (
                      <span
                        key={scope}
                        className="px-3 py-1 rounded-lg bg-black/40 text-xs font-bold text-slate-400"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this API key?')) {
                      deleteApiKey.mutate(key.id);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Created
                  </p>
                  <p className="text-xs font-bold text-slate-300">
                    {formatDistanceToNow(new Date(key.created_at), { addSuffix: true })}
                  </p>
                </div>

                {key.last_used_at && (
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Last Used
                    </p>
                    <p className="text-xs font-bold text-slate-300">
                      {formatDistanceToNow(new Date(key.last_used_at), { addSuffix: true })}
                    </p>
                  </div>
                )}

                {key.expires_at && (
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Expires
                    </p>
                    <p className="text-xs font-bold text-slate-300">
                      {formatDistanceToNow(new Date(key.expires_at), { addSuffix: true })}
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
