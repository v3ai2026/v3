import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { NeuralButton, NeuralInput, GlassCard } from '../UIElements';

export const LoginForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithOAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await signIn(email, password);
    
    setLoading(false);
    
    if (signInError) {
      setError(signInError);
    } else {
      onSuccess?.();
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError('');
    
    const { error: oauthError } = await signInWithOAuth(provider);
    
    setLoading(false);
    
    if (oauthError) {
      setError(oauthError);
    }
  };

  return (
    <GlassCard className="w-full max-w-md p-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white">Welcome Back</h2>
        <p className="text-slate-400 text-sm">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <NeuralInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
        
        <NeuralInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-xl">
            {error}
          </div>
        )}

        <NeuralButton
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
        >
          Sign In
        </NeuralButton>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#020420] px-2 text-slate-500 font-black tracking-widest">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NeuralButton
          variant="secondary"
          onClick={() => handleOAuth('google')}
          disabled={loading}
          className="w-full"
        >
          <span className="mr-2">🔍</span> Google
        </NeuralButton>
        
        <NeuralButton
          variant="secondary"
          onClick={() => handleOAuth('github')}
          disabled={loading}
          className="w-full"
        >
          <span className="mr-2">⚡</span> GitHub
        </NeuralButton>
      </div>
    </GlassCard>
  );
};
