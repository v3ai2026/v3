/**
 * Unified Ads Service
 * Manages multi-platform ad campaigns with unified interface
 */

import { AdCampaign, AdCreative, AIInsight, AdPlatform, CampaignStatus, BiddingStrategy } from "../../types";

export interface CampaignMetrics {
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  averageCPC: number;
  averageCPA: number;
  averageROAS: number;
  averageCTR: number;
}

export interface CreateCampaignInput {
  name: string;
  platform: AdPlatform;
  adType: string;
  budget: {
    daily: number;
    total: number;
    currency?: string;
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
  };
}

export class UnifiedAdsService {
  private campaigns: Map<string, AdCampaign> = new Map();
  private creatives: Map<string, AdCreative> = new Map();
  private insights: AIInsight[] = [];

  // Campaign Management
  async createCampaign(input: CreateCampaignInput): Promise<AdCampaign> {
    const campaign: AdCampaign = {
      id: this.generateId(),
      name: input.name,
      platform: input.platform,
      adType: input.adType as any,
      status: 'draft',
      budget: {
        daily: input.budget.daily,
        total: input.budget.total,
        spent: 0,
        currency: input.budget.currency || 'CNY'
      },
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cpc: 0,
        cpa: 0,
        roas: 0,
        ctr: 0
      },
      targeting: input.targeting,
      biddingStrategy: input.biddingStrategy,
      schedule: input.schedule,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  async getCampaign(id: string): Promise<AdCampaign | null> {
    return this.campaigns.get(id) || null;
  }

  async listCampaigns(filters?: {
    platform?: AdPlatform;
    status?: CampaignStatus;
  }): Promise<AdCampaign[]> {
    let campaigns = Array.from(this.campaigns.values());

    if (filters?.platform) {
      campaigns = campaigns.filter(c => c.platform === filters.platform);
    }

    if (filters?.status) {
      campaigns = campaigns.filter(c => c.status === filters.status);
    }

    return campaigns.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async updateCampaign(id: string, updates: Partial<AdCampaign>): Promise<AdCampaign | null> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return null;

    const updated = {
      ...campaign,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.campaigns.set(id, updated);
    return updated;
  }

  async updateCampaignStatus(id: string, status: CampaignStatus): Promise<boolean> {
    const campaign = await this.updateCampaign(id, { status });
    return campaign !== null;
  }

  async deleteCampaign(id: string): Promise<boolean> {
    return this.campaigns.delete(id);
  }

  // Creative Management
  async createCreative(creative: Omit<AdCreative, 'id'>): Promise<AdCreative> {
    const newCreative: AdCreative = {
      ...creative,
      id: this.generateId()
    };

    this.creatives.set(newCreative.id, newCreative);
    return newCreative;
  }

  async getCreativesByCampaign(campaignId: string): Promise<AdCreative[]> {
    return Array.from(this.creatives.values())
      .filter(c => c.campaignId === campaignId);
  }

  // Performance Monitoring
  async updateCampaignPerformance(
    id: string,
    metrics: Partial<AdCampaign['performance']>
  ): Promise<void> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return;

    campaign.performance = {
      ...campaign.performance,
      ...metrics
    };

    // Calculate derived metrics
    if (campaign.performance.clicks > 0) {
      campaign.performance.ctr = 
        (campaign.performance.clicks / campaign.performance.impressions) * 100;
    }

    if (campaign.performance.conversions > 0) {
      campaign.performance.cpa = 
        campaign.budget.spent / campaign.performance.conversions;
    }

    campaign.updatedAt = new Date().toISOString();
    this.campaigns.set(id, campaign);

    // Check for optimization opportunities
    await this.analyzePerformance(campaign);
  }

  async getAggregateMetrics(platformFilter?: AdPlatform): Promise<CampaignMetrics> {
    let campaigns = Array.from(this.campaigns.values());

    if (platformFilter) {
      campaigns = campaigns.filter(c => c.platform === platformFilter);
    }

    const metrics: CampaignMetrics = {
      totalSpent: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      averageCPC: 0,
      averageCPA: 0,
      averageROAS: 0,
      averageCTR: 0
    };

    campaigns.forEach(campaign => {
      metrics.totalSpent += campaign.budget.spent;
      metrics.totalImpressions += campaign.performance.impressions;
      metrics.totalClicks += campaign.performance.clicks;
      metrics.totalConversions += campaign.performance.conversions;
    });

    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

    if (activeCampaigns > 0) {
      metrics.averageCPC = campaigns.reduce((sum, c) => sum + c.performance.cpc, 0) / activeCampaigns;
      metrics.averageCPA = campaigns.reduce((sum, c) => sum + c.performance.cpa, 0) / activeCampaigns;
      metrics.averageROAS = campaigns.reduce((sum, c) => sum + c.performance.roas, 0) / activeCampaigns;
      metrics.averageCTR = campaigns.reduce((sum, c) => sum + c.performance.ctr, 0) / activeCampaigns;
    }

    return metrics;
  }

  // AI-Powered Optimization
  private async analyzePerformance(campaign: AdCampaign): Promise<void> {
    const insights: AIInsight[] = [];

    // High CPA Warning
    if (campaign.performance.cpa > campaign.budget.daily * 0.3) {
      insights.push({
        id: this.generateId(),
        type: 'warning',
        priority: 'high',
        title: 'CPA 过高',
        description: `${campaign.name} 的获客成本异常升高，当前 CPA: ¥${campaign.performance.cpa.toFixed(2)}`,
        action: '建议暂停并优化定向或创意',
        campaignId: campaign.id,
        timestamp: new Date().toISOString()
      });
    }

    // Low CTR Warning
    if (campaign.performance.ctr < 0.5 && campaign.performance.impressions > 1000) {
      insights.push({
        id: this.generateId(),
        type: 'warning',
        priority: 'medium',
        title: '点击率过低',
        description: `${campaign.name} 的点击率仅为 ${campaign.performance.ctr.toFixed(2)}%`,
        action: '建议优化广告文案和创意',
        campaignId: campaign.id,
        timestamp: new Date().toISOString()
      });
    }

    // High ROAS Opportunity
    if (campaign.performance.roas > 3 && campaign.budget.spent < campaign.budget.daily * 0.7) {
      insights.push({
        id: this.generateId(),
        type: 'opportunity',
        priority: 'high',
        title: '高回报率广告',
        description: `${campaign.name} ROAS 达到 ${campaign.performance.roas.toFixed(1)}x`,
        action: '建议增加预算 20-30%',
        campaignId: campaign.id,
        timestamp: new Date().toISOString()
      });
    }

    // Budget Nearly Exhausted
    if (campaign.budget.spent / campaign.budget.daily > 0.9) {
      insights.push({
        id: this.generateId(),
        type: 'warning',
        priority: 'high',
        title: '预算即将用完',
        description: `${campaign.name} 今日预算已使用 ${((campaign.budget.spent / campaign.budget.daily) * 100).toFixed(0)}%`,
        action: '考虑增加每日预算',
        campaignId: campaign.id,
        timestamp: new Date().toISOString()
      });
    }

    this.insights.push(...insights);
  }

  async getInsights(limit?: number): Promise<AIInsight[]> {
    const sorted = this.insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return limit ? sorted.slice(0, limit) : sorted;
  }

  async dismissInsight(id: string): Promise<boolean> {
    const index = this.insights.findIndex(i => i.id === id);
    if (index === -1) return false;
    
    this.insights.splice(index, 1);
    return true;
  }

  // Auto-optimization
  async autoOptimizeCampaigns(): Promise<{
    paused: string[];
    budgetIncreased: string[];
    suggestions: string[];
  }> {
    const results = {
      paused: [] as string[],
      budgetIncreased: [] as string[],
      suggestions: [] as string[]
    };

    const campaigns = Array.from(this.campaigns.values());

    for (const campaign of campaigns) {
      if (campaign.status !== 'active') continue;

      // Auto-pause low performers
      if (
        campaign.performance.cpa > campaign.budget.daily * 0.4 &&
        campaign.performance.clicks > 50
      ) {
        await this.updateCampaignStatus(campaign.id, 'paused');
        results.paused.push(campaign.name);
      }

      // Auto-increase budget for high performers
      if (
        campaign.performance.roas > 3.5 &&
        campaign.budget.spent / campaign.budget.daily > 0.8
      ) {
        const newBudget = campaign.budget.daily * 1.2;
        await this.updateCampaign(campaign.id, {
          budget: { ...campaign.budget, daily: newBudget }
        });
        results.budgetIncreased.push(campaign.name);
      }
    }

    return results;
  }

  // Utility
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  // Mock data for testing
  async seedMockData(): Promise<void> {
    const mockCampaigns: CreateCampaignInput[] = [
      {
        name: '夏季连衣裙促销',
        platform: 'google_ads',
        adType: 'shopping',
        budget: { daily: 500, total: 15000, currency: 'CNY' },
        targeting: {
          locations: ['北京', '上海', '广州', '深圳'],
          ageRange: [25, 45],
          gender: 'female',
          interests: ['时尚', '购物', '服装'],
          keywords: ['连衣裙', '夏季服装', '女装']
        },
        biddingStrategy: 'target_roas',
        schedule: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        name: '新用户注册优惠',
        platform: 'facebook_ads',
        adType: 'display',
        budget: { daily: 800, total: 24000, currency: 'CNY' },
        targeting: {
          locations: ['中国'],
          ageRange: [18, 35],
          gender: 'all',
          interests: ['电商', '在线购物', '优惠活动']
        },
        biddingStrategy: 'maximize_conversions',
        schedule: {
          startDate: new Date().toISOString()
        }
      },
      {
        name: '抖音品牌推广',
        platform: 'douyin_ads',
        adType: 'video',
        budget: { daily: 1000, total: 30000, currency: 'CNY' },
        targeting: {
          locations: ['全国'],
          ageRange: [18, 30],
          gender: 'all',
          interests: ['短视频', '娱乐', '时尚']
        },
        biddingStrategy: 'maximize_clicks',
        schedule: {
          startDate: new Date().toISOString()
        }
      }
    ];

    for (const input of mockCampaigns) {
      const campaign = await this.createCampaign(input);
      
      // Add mock performance data
      await this.updateCampaignPerformance(campaign.id, {
        impressions: Math.floor(Math.random() * 50000) + 10000,
        clicks: Math.floor(Math.random() * 2000) + 500,
        conversions: Math.floor(Math.random() * 100) + 20,
        cpc: Math.random() * 5 + 1,
        cpa: Math.random() * 50 + 10,
        roas: Math.random() * 4 + 1
      });

      await this.updateCampaign(campaign.id, {
        status: 'active',
        budget: {
          ...campaign.budget,
          spent: Math.random() * campaign.budget.daily * 0.9
        }
      });
    }
  }
}
