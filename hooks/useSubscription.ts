import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, Subscription } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data as Subscription | null;
    },
    enabled: !!user,
  });

  const createSubscription = useMutation({
    mutationFn: async (subscriptionData: Partial<Subscription>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          ...subscriptionData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });

  const updateSubscription = useMutation({
    mutationFn: async (updates: Partial<Subscription>) => {
      if (!subscription) throw new Error('No subscription found');

      const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', subscription.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });

  return {
    subscription,
    isLoading,
    createSubscription,
    updateSubscription,
  };
}
