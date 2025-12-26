import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { GlassCard, NeuralButton, NeuralInput, NeuralTextArea, NeuralSpinner } from '../components/UIElements';

export const Profile: React.FC = () => {
  const { profile, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    company: profile?.company || '',
    website: profile?.website || '',
    location: profile?.location || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        company: profile.company || '',
        website: profile.website || '',
        location: profile.location || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await updateProfile(formData);

    setSaving(false);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <NeuralSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-12 space-y-8 max-w-4xl mx-auto animate-modal-fade">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
          Profile
        </h1>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
          Manage your personal information
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassCard className="p-8 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-blue-500/20 flex items-center justify-center text-4xl">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">{profile?.full_name || 'User'}</h3>
              <p className="text-sm text-slate-400">@{profile?.username}</p>
              <NeuralButton variant="secondary" size="xs">
                Change Avatar
              </NeuralButton>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8 space-y-6">
          <h3 className="text-lg font-black text-white border-b border-white/5 pb-4">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NeuralInput
              label="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="John Doe"
            />

            <NeuralInput
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="johndoe"
            />
          </div>

          <NeuralInput
            label="Email"
            value={profile?.email || ''}
            disabled
            placeholder="your@email.com"
          />

          <NeuralTextArea
            label="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            className="h-32"
          />
        </GlassCard>

        <GlassCard className="p-8 space-y-6">
          <h3 className="text-lg font-black text-white border-b border-white/5 pb-4">
            Additional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NeuralInput
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Your Company"
            />

            <NeuralInput
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
            />
          </div>

          <NeuralInput
            label="Website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://yourwebsite.com"
          />
        </GlassCard>

        {message && (
          <div className={`p-4 rounded-xl text-center font-bold ${
            message.type === 'success' 
              ? 'bg-[#00DC82]/10 text-[#00DC82]' 
              : 'bg-red-500/10 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex gap-4">
          <NeuralButton
            type="submit"
            loading={saving}
            variant="primary"
            size="lg"
            className="flex-1"
          >
            Save Changes
          </NeuralButton>
          <NeuralButton
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => {
              if (profile) {
                setFormData({
                  full_name: profile.full_name || '',
                  username: profile.username || '',
                  bio: profile.bio || '',
                  company: profile.company || '',
                  website: profile.website || '',
                  location: profile.location || '',
                });
              }
            }}
          >
            Reset
          </NeuralButton>
        </div>
      </form>
    </div>
  );
};
