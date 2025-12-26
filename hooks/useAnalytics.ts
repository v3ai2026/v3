import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export function useAnalytics() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['analytics-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get total projects
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get projects this month
      const startOfThisMonth = startOfMonth(new Date()).toISOString();
      const { count: monthlyProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfThisMonth);

      // Get deployments
      const { count: deploymentCount } = await supabase
        .from('deployments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get AI usage this month
      const { data: aiUsage } = await supabase
        .from('usage_metrics')
        .select('metric_value')
        .eq('user_id', user.id)
        .eq('metric_type', 'ai_generation')
        .gte('created_at', startOfThisMonth);

      const totalAiUsage = aiUsage?.reduce((sum, item) => sum + item.metric_value, 0) || 0;

      return {
        totalProjects: projectCount || 0,
        monthlyProjects: monthlyProjects || 0,
        totalDeployments: deploymentCount || 0,
        aiUsageThisMonth: totalAiUsage,
      };
    },
    enabled: !!user,
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['analytics-trends', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), 5 - i);
        return {
          month: format(date, 'MMM'),
          start: startOfMonth(date).toISOString(),
          end: endOfMonth(date).toISOString(),
        };
      });

      const trendsData = await Promise.all(
        last6Months.map(async ({ month, start, end }) => {
          const { count: projects } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', start)
            .lte('created_at', end);

          const { count: deployments } = await supabase
            .from('deployments')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', start)
            .lte('created_at', end);

          const { data: aiData } = await supabase
            .from('usage_metrics')
            .select('metric_value')
            .eq('user_id', user.id)
            .eq('metric_type', 'ai_generation')
            .gte('created_at', start)
            .lte('created_at', end);

          const aiUsage = aiData?.reduce((sum, item) => sum + item.metric_value, 0) || 0;

          return {
            month,
            projects: projects || 0,
            deployments: deployments || 0,
            aiUsage,
          };
        })
      );

      return trendsData;
    },
    enabled: !!user,
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['recent-activity', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return {
    stats,
    trends,
    recentActivity,
    isLoading: statsLoading || trendsLoading || activityLoading,
  };
}
