import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { NeuralButton, NeuralInput, GlassCard } from '../UIElements';

export const RegisterForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signUpError } = await signUp(email, password, {
      full_name: fullName,
      username: username || email.split('@')[0],
    });
    
    setLoading(false);
    
    if (signUpError) {
      setError(signUpError);
    } else {
      onSuccess?.();
    }
  };

  return (
    <GlassCard className="w-full max-w-md p-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white">Create Account</h2>
        <p className="text-slate-400 text-sm">Start building with AI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <NeuralInput
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          required
        />

        <NeuralInput
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="johndoe"
        />
        
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
          Create Account
        </NeuralButton>
      </form>
    </GlassCard>
  );
};
