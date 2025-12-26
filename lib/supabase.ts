import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  email: string;
  bio?: string;
  company?: string;
  website?: string;
  location?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status?: 'active' | 'cancelled' | 'expired';
  subscription_end_date?: string;
  stripe_customer_id?: string;
  gitee_token?: string;
  github_token?: string;
  ai_credits: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  project_type?: string;
  framework?: string;
  status: 'draft' | 'generating' | 'completed' | 'deployed';
  thumbnail_url?: string;
  preview_url?: string;
  repository_url?: string;
  gitee_repo_url?: string;
  vercel_deployment_url?: string;
  is_public: boolean;
  is_template: boolean;
  tags?: string[];
  metadata?: any;
  created_at: string;
  updated_at: string;
  last_deployed_at?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id?: string;
  stripe_price_id?: string;
  plan_name: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id?: string;
  stripe_payment_id?: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  payment_method?: string;
  invoice_url?: string;
  receipt_url?: string;
  description?: string;
  metadata?: any;
  created_at: string;
}

export interface UsageMetric {
  id: string;
  user_id: string;
  metric_type: string;
  metric_value: number;
  resource_id?: string;
  metadata?: any;
  created_at: string;
  date: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  description?: string;
  avatar_url?: string;
  subscription_tier: string;
  max_members: number;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  key_name: string;
  api_key: string;
  key_prefix: string;
  scopes?: string[];
  last_used_at?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  resource_type: string;
  resource_id?: string;
  description?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
  created_at: string;
}
