import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, Team } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, NeuralButton, NeuralInput, NeuralBadge, NeuralSpinner } from '../components/UIElements';
import { formatDistanceToNow } from 'date-fns';

export const Teams: React.FC = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  // Fetch teams where user is a member
  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          team:teams(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map((tm: any) => ({ ...tm.team, member_role: tm.role })) || [];
    },
    enabled: !!user,
  });

  const createTeam = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: newTeamName,
          slug: newTeamName.toLowerCase().replace(/\s+/g, '-'),
          owner_id: user.id,
          description: newTeamDescription,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as owner
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'owner',
        });

      if (memberError) throw memberError;

      return team;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsCreating(false);
      setNewTeamName('');
      setNewTeamDescription('');
    },
  });

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      createTeam.mutate();
    }
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
            Teams
          </h1>
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
            {teams?.length || 0} teams
          </p>
        </div>
        <NeuralButton
          onClick={() => setIsCreating(true)}
          variant="primary"
          size="lg"
        >
          <span className="mr-2">➕</span> Create Team
        </NeuralButton>
      </div>

      {/* Create Team Form */}
      {isCreating && (
        <GlassCard className="p-8 space-y-6 animate-modal-slide">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-xl font-black text-white">Create New Team</h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <NeuralInput
              label="Team Name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="My Awesome Team"
              required
            />

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">
                Description
              </label>
              <textarea
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
                placeholder="What's this team about?"
                className="w-full bg-black/40 border border-[#1a1e43] rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#00DC82]/50 resize-none h-24"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <NeuralButton
              onClick={handleCreateTeam}
              loading={createTeam.isPending}
              variant="primary"
              className="flex-1"
            >
              Create Team
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

      {/* Teams Grid */}
      {teams && teams.length === 0 ? (
        <GlassCard className="p-16 text-center space-y-6">
          <div className="text-6xl">👥</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">No teams yet</h3>
            <p className="text-slate-500 text-sm">
              Create your first team to collaborate with others
            </p>
          </div>
          <NeuralButton
            onClick={() => setIsCreating(true)}
            variant="primary"
            size="lg"
          >
            <span className="mr-2">➕</span> Create First Team
          </NeuralButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams?.map((team: any) => (
            <GlassCard
              key={team.id}
              className="p-6 space-y-6 group hover:border-[#00DC82]/30 transition-all"
            >
              {/* Team Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00DC82]/20 to-blue-500/20 flex items-center justify-center text-3xl shrink-0">
                  {team.avatar_url ? (
                    <img
                      src={team.avatar_url}
                      alt={team.name}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <span>👥</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-white truncate">
                    {team.name}
                  </h3>
                  <NeuralBadge variant={team.member_role === 'owner' ? 'primary' : 'secondary'}>
                    {team.member_role}
                  </NeuralBadge>
                </div>
              </div>

              {/* Team Description */}
              {team.description && (
                <p className="text-sm text-slate-400 line-clamp-2">
                  {team.description}
                </p>
              )}

              {/* Team Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Members
                  </p>
                  <p className="text-lg font-black text-white">
                    1/{team.max_members || 10}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Created
                  </p>
                  <p className="text-xs font-bold text-slate-300">
                    {formatDistanceToNow(new Date(team.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <NeuralButton variant="primary" size="xs" className="flex-1">
                  View
                </NeuralButton>
                {team.member_role === 'owner' && (
                  <NeuralButton variant="secondary" size="xs" className="flex-1">
                    Settings
                  </NeuralButton>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
