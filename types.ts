
export interface GeneratedFile {
  path: string;
  content: string;
  type: 'frontend' | 'backend' | 'test' | 'config';
}

export interface GenerationResult {
  projectName: string;
  files: GeneratedFile[];
  agentLogs: {
    agent: string;
    action: string;
    status: 'complete' | 'working';
  }[];
}

export interface ModelConfig {
  temperature: number;
  topP: number;
  topK: number;
  thinkingBudget: number;
  systemInstruction: string;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  model: string;
  instruction: string;
  status: 'idle' | 'active' | 'deploying';
}

export interface LibraryItem {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'component' | 'api';
  previewColor: string;
  codeSnippet?: string;
}

export interface DeploymentStatus {
  id: string;
  url: string;
  state: string;
  createdAt: number;
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author: string;
  enabled: boolean;
  manifest: string;
}

export enum TabType {
  // Sector 1: Genesis (Creation)
  CREATION_BUILDER = 'CREATION_BUILDER',
  CREATION_NOTEBOOK = 'CREATION_NOTEBOOK',
  CREATION_ASSETS = 'CREATION_ASSETS',
  
  // Sector 2: Neural Market (Discovery)
  MARKET_REGISTRY = 'MARKET_REGISTRY',
  AGENT_MANAGER = 'AGENT_MANAGER',
  
  // Sector 3: Media Nexus (Commerce & Content)
  MEDIA_YOUTUBE = 'MEDIA_YOUTUBE',
  MEDIA_TIKTOK = 'MEDIA_TIKTOK',
  MEDIA_TMDB = 'MEDIA_TMDB',
  MEDIA_ADS = 'MEDIA_ADS',

  // Sector 4: Design & Multimodal
  DESIGN_FIGMA = 'DESIGN_FIGMA',
  
  // Sector 5: DevOps Shard (Automation)
  DEVOPS_WORKFLOW = 'DEVOPS_WORKFLOW',
  DEVOPS_DEPLOY = 'DEVOPS_DEPLOY',
  DEVOPS_GCS = 'DEVOPS_GCS',
  EDITOR = 'EDITOR',
  WORKSPACE = 'WORKSPACE',
  GITHUB = 'GITHUB',
  BLOB = 'BLOB'
}

// Advertising System Types
export type AdPlatform = 
  | 'google_ads' 
  | 'facebook_ads' 
  | 'tiktok_ads' 
  | 'douyin_ads' 
  | 'kuaishou_ads' 
  | 'xiaohongshu_ads' 
  | 'wechat_ads' 
  | 'baidu_ads' 
  | 'tencent_ads' 
  | 'alimama_ads';

export type AdType = 
  | 'search' 
  | 'display' 
  | 'video' 
  | 'shopping' 
  | 'dynamic' 
  | 'retargeting' 
  | 'app_promotion';

export type CampaignStatus = 
  | 'active' 
  | 'paused' 
  | 'completed' 
  | 'draft' 
  | 'optimizing' 
  | 'error';

export type BiddingStrategy = 
  | 'target_cpa' 
  | 'target_roas' 
  | 'maximize_conversions' 
  | 'maximize_clicks' 
  | 'manual_cpc';

export interface AdCampaign {
  id: string;
  name: string;
  platform: AdPlatform;
  adType: AdType;
  status: CampaignStatus;
  budget: {
    daily: number;
    total: number;
    spent: number;
    currency: string;
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    cpc: number;
    cpa: number;
    roas: number;
    ctr: number;
  };
  targeting: {
    locations: string[];
    ageRange: [number, number];
    gender?: 'male' | 'female' | 'all';
    interests: string[];
    keywords?: string[];
  };
  biddingStrategy: BiddingStrategy;
  schedule: {
    startDate: string;
    endDate?: string;
    timeSlots?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdCreative {
  id: string;
  campaignId: string;
  type: 'text' | 'image' | 'video';
  headline: string;
  description: string;
  callToAction: string;
  imageUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  aiGenerated: boolean;
  performanceScore?: number;
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'suggestion';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: string;
  campaignId?: string;
  timestamp: string;
}

export interface AdPlatformCredentials {
  platform: AdPlatform;
  apiKey?: string;
  accessToken?: string;
  accountId?: string;
  isConnected: boolean;
}
