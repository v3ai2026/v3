/**
 * Analytics and Reporting Service
 * Generates reports and provides data insights
 */

import { AdCampaign, AIInsight } from "../../types";

export interface ReportData {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalSpent: number;
    totalRevenue: number;
    totalConversions: number;
    averageROAS: number;
  };
  topPerformers: {
    campaignName: string;
    roas: number;
    conversions: number;
  }[];
  poorPerformers: {
    campaignName: string;
    cpa: number;
    ctr: number;
  }[];
  platformBreakdown: Record<string, {
    spent: number;
    conversions: number;
    roas: number;
  }>;
  recommendations: string[];
}

export class AnalyticsService {
  async generateReport(
    campaigns: AdCampaign[],
    startDate: Date,
    endDate: Date
  ): Promise<ReportData> {
    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    
    const summary = {
      totalCampaigns: campaigns.length,
      activeCampaigns: activeCampaigns.length,
      totalSpent: campaigns.reduce((sum, c) => sum + c.budget.spent, 0),
      totalRevenue: campaigns.reduce((sum, c) => sum + (c.budget.spent * c.performance.roas), 0),
      totalConversions: campaigns.reduce((sum, c) => sum + c.performance.conversions, 0),
      averageROAS: campaigns.length > 0 
        ? campaigns.reduce((sum, c) => sum + c.performance.roas, 0) / campaigns.length 
        : 0
    };

    // Top performers by ROAS
    const topPerformers = [...campaigns]
      .sort((a, b) => b.performance.roas - a.performance.roas)
      .slice(0, 5)
      .map(c => ({
        campaignName: c.name,
        roas: c.performance.roas,
        conversions: c.performance.conversions
      }));

    // Poor performers by CPA
    const poorPerformers = [...campaigns]
      .filter(c => c.performance.clicks > 50)
      .sort((a, b) => b.performance.cpa - a.performance.cpa)
      .slice(0, 5)
      .map(c => ({
        campaignName: c.name,
        cpa: c.performance.cpa,
        ctr: c.performance.ctr
      }));

    // Platform breakdown
    const platformBreakdown: Record<string, any> = {};
    campaigns.forEach(campaign => {
      if (!platformBreakdown[campaign.platform]) {
        platformBreakdown[campaign.platform] = {
          spent: 0,
          conversions: 0,
          roas: 0,
          count: 0
        };
      }
      platformBreakdown[campaign.platform].spent += campaign.budget.spent;
      platformBreakdown[campaign.platform].conversions += campaign.performance.conversions;
      platformBreakdown[campaign.platform].roas += campaign.performance.roas;
      platformBreakdown[campaign.platform].count += 1;
    });

    // Average ROAS per platform
    Object.keys(platformBreakdown).forEach(platform => {
      platformBreakdown[platform].roas /= platformBreakdown[platform].count;
    });

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (summary.averageROAS < 2) {
      recommendations.push('整体 ROAS 较低，建议优化广告创意和定向策略');
    }
    
    if (poorPerformers.length > 0) {
      recommendations.push(`发现 ${poorPerformers.length} 个低效广告，建议暂停或重新优化`);
    }

    const bestPlatform = Object.entries(platformBreakdown)
      .sort(([,a], [,b]) => (b as any).roas - (a as any).roas)[0];
    
    if (bestPlatform) {
      recommendations.push(`${bestPlatform[0]} 平台表现最佳，建议增加预算投入`);
    }

    return {
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      summary,
      topPerformers,
      poorPerformers,
      platformBreakdown,
      recommendations
    };
  }

  async exportToJSON(report: ReportData): Promise<string> {
    return JSON.stringify(report, null, 2);
  }

  async exportToCSV(campaigns: AdCampaign[]): Promise<string> {
    const headers = [
      'Campaign Name',
      'Platform',
      'Status',
      'Budget Spent',
      'Impressions',
      'Clicks',
      'Conversions',
      'CPC',
      'CPA',
      'CTR',
      'ROAS'
    ];

    const rows = campaigns.map(c => [
      c.name,
      c.platform,
      c.status,
      c.budget.spent.toFixed(2),
      c.performance.impressions,
      c.performance.clicks,
      c.performance.conversions,
      c.performance.cpc.toFixed(2),
      c.performance.cpa.toFixed(2),
      c.performance.ctr.toFixed(2),
      c.performance.roas.toFixed(2)
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }

  async predictPerformance(
    campaign: AdCampaign,
    daysAhead: number = 7
  ): Promise<{
    projectedSpend: number;
    projectedConversions: number;
    projectedROAS: number;
    confidence: number;
  }> {
    // Simple linear projection based on current performance
    const dailySpend = campaign.budget.spent / Math.max(1, this.getDaysSinceStart(campaign));
    const dailyConversions = campaign.performance.conversions / Math.max(1, this.getDaysSinceStart(campaign));

    return {
      projectedSpend: dailySpend * daysAhead,
      projectedConversions: Math.round(dailyConversions * daysAhead),
      projectedROAS: campaign.performance.roas, // Assume ROAS stays consistent
      confidence: campaign.performance.clicks > 100 ? 0.85 : 0.60
    };
  }

  private getDaysSinceStart(campaign: AdCampaign): number {
    const start = new Date(campaign.schedule.startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async generateInsights(campaigns: AdCampaign[]): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    // Identify seasonal trends
    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    if (activeCampaigns.length > 5) {
      insights.push({
        id: `insight-${Date.now()}-1`,
        type: 'suggestion',
        priority: 'low',
        title: '多广告活动管理',
        description: `当前运行 ${activeCampaigns.length} 个广告活动，建议定期审查并合并相似的广告组以提高管理效率`,
        timestamp: new Date().toISOString()
      });
    }

    // Budget optimization
    const totalDailyBudget = campaigns.reduce((sum, c) => sum + c.budget.daily, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.budget.spent, 0);
    
    if (totalSpent > totalDailyBudget * 0.9) {
      insights.push({
        id: `insight-${Date.now()}-2`,
        type: 'warning',
        priority: 'high',
        title: '预算接近上限',
        description: '今日总预算已使用超过 90%，某些高效广告可能因预算限制而停止投放',
        action: '建议增加预算或重新分配',
        timestamp: new Date().toISOString()
      });
    }

    return insights;
  }
}
