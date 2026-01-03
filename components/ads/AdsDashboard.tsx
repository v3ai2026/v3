/**
 * Unified Advertising Dashboard Component
 * Multi-platform ad campaign management interface
 */

import React, { useState, useEffect } from 'react';
import { 
  AdCampaign, 
  AdPlatform, 
  CampaignStatus, 
  AIInsight 
} from '../../types';
import { 
  NeuralButton, 
  NeuralBadge, 
  GlassCard, 
  NeuralSpinner 
} from '../UIElements';
import { UnifiedAdsService, CampaignMetrics } from '../../services/ads/unifiedAdsService';

interface AdsDashboardProps {
  adsService: UnifiedAdsService;
}

export const AdsDashboard: React.FC<AdsDashboardProps> = ({ adsService }) => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [selectedPlatform, adsService]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const filter = selectedPlatform !== 'all' ? { platform: selectedPlatform } : undefined;
      const campaignList = await adsService.listCampaigns(filter);
      setCampaigns(campaignList);

      const platformFilter = selectedPlatform !== 'all' ? selectedPlatform : undefined;
      const metricsData = await adsService.getAggregateMetrics(platformFilter);
      setMetrics(metricsData);

      const insightsList = await adsService.getInsights(5);
      setInsights(insightsList);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoOptimize = async () => {
    setIsOptimizing(true);
    try {
      const results = await adsService.autoOptimizeCampaigns();
      alert(`优化完成！\n暂停: ${results.paused.length} 个\n预算增加: ${results.budgetIncreased.length} 个`);
      await loadDashboardData();
    } catch (error) {
      console.error('Auto-optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handlePauseCampaign = async (id: string) => {
    await adsService.updateCampaignStatus(id, 'paused');
    await loadDashboardData();
  };

  const handleResumeCampaign = async (id: string) => {
    await adsService.updateCampaignStatus(id, 'active');
    await loadDashboardData();
  };

  const handleDismissInsight = async (id: string) => {
    await adsService.dismissInsight(id);
    const updatedInsights = insights.filter(i => i.id !== id);
    setInsights(updatedInsights);
  };

  const platforms: Array<{ id: AdPlatform | 'all'; label: string; icon: string }> = [
    { id: 'all', label: '全部平台', icon: '🌐' },
    { id: 'google_ads', label: 'Google', icon: '🔍' },
    { id: 'facebook_ads', label: 'Facebook', icon: '📘' },
    { id: 'tiktok_ads', label: 'TikTok', icon: '🎵' },
    { id: 'douyin_ads', label: '抖音', icon: '🎬' },
    { id: 'wechat_ads', label: '微信', icon: '💬' },
    { id: 'baidu_ads', label: '百度', icon: '🔎' }
  ];

  const getStatusColor = (status: CampaignStatus): string => {
    const colors = {
      active: 'text-[#00DC82] bg-[#00DC82]/10',
      paused: 'text-yellow-400 bg-yellow-400/10',
      completed: 'text-blue-400 bg-blue-400/10',
      draft: 'text-slate-400 bg-slate-400/10',
      optimizing: 'text-purple-400 bg-purple-400/10',
      error: 'text-red-400 bg-red-400/10'
    };
    return colors[status] || colors.draft;
  };

  const getPriorityColor = (priority: AIInsight['priority']): string => {
    const colors = {
      high: 'border-red-500/50 bg-red-500/5',
      medium: 'border-yellow-500/50 bg-yellow-500/5',
      low: 'border-blue-500/50 bg-blue-500/5'
    };
    return colors[priority];
  };

  const getInsightIcon = (type: AIInsight['type']): string => {
    const icons = {
      opportunity: '⭐',
      warning: '⚠️',
      suggestion: '💡'
    };
    return icons[type];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <NeuralSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-12 animate-modal-fade max-w-[1800px] mx-auto space-y-8 md:space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
            广告营销中枢
          </h2>
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
            AI 全自动多平台广告投放系统
          </p>
        </div>
        <div className="flex gap-2">
          <NeuralButton 
            onClick={handleAutoOptimize} 
            loading={isOptimizing}
            variant="primary"
            size="sm"
          >
            🤖 AI 自动优化
          </NeuralButton>
          <NeuralButton 
            onClick={loadDashboardData}
            variant="secondary"
            size="sm"
          >
            🔄 刷新
          </NeuralButton>
        </div>
      </div>

      {/* Platform Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {platforms.map(platform => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedPlatform === platform.id
                ? 'bg-[#00DC82] text-black'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <span className="mr-2">{platform.icon}</span>
            {platform.label}
          </button>
        ))}
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-6 space-y-2">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              总花费
            </div>
            <div className="text-3xl font-black text-white">
              ¥{metrics.totalSpent.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[9px] text-slate-600">
              {campaigns.length} 个活跃广告
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-2">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              转化数
            </div>
            <div className="text-3xl font-black text-[#00DC82]">
              {metrics.totalConversions.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-600">
              平均 CPA: ¥{metrics.averageCPA.toFixed(2)}
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-2">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              点击率
            </div>
            <div className="text-3xl font-black text-white">
              {metrics.averageCTR.toFixed(2)}%
            </div>
            <div className="text-[9px] text-slate-600">
              {metrics.totalClicks.toLocaleString()} 总点击
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-2">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              ROAS
            </div>
            <div className="text-3xl font-black text-white">
              {metrics.averageROAS.toFixed(1)}x
            </div>
            <div className="text-[9px] text-slate-600">
              投资回报率
            </div>
          </GlassCard>
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-[#00DC82] uppercase tracking-[0.3em]">
            🤖 AI 智能建议 ({insights.length})
          </h3>
          <div className="space-y-3">
            {insights.map(insight => (
              <GlassCard
                key={insight.id}
                className={`p-6 border-l-4 ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getInsightIcon(insight.type)}</span>
                      <h4 className="text-sm font-black text-white">{insight.title}</h4>
                      <NeuralBadge variant={insight.priority === 'high' ? 'danger' : 'secondary'} className="text-[8px]">
                        {insight.priority === 'high' ? '高优先级' : insight.priority === 'medium' ? '中优先级' : '低优先级'}
                      </NeuralBadge>
                    </div>
                    <p className="text-xs text-slate-400">{insight.description}</p>
                    {insight.action && (
                      <p className="text-[10px] text-[#00DC82] font-bold">
                        建议操作: {insight.action}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDismissInsight(insight.id)}
                    className="text-slate-600 hover:text-white transition-colors text-xs"
                  >
                    ✕
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Campaigns List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">
            广告活动 ({campaigns.length})
          </h3>
        </div>

        {campaigns.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="text-4xl mb-4">📢</div>
            <p className="text-slate-500 text-sm">暂无广告活动</p>
            <p className="text-slate-600 text-xs mt-2">开始创建您的第一个广告活动</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns.map(campaign => (
              <GlassCard key={campaign.id} className="p-6 space-y-4 hover:border-[#00DC82]/30 transition-all">
                {/* Campaign Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-white truncate">{campaign.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <NeuralBadge className={`text-[8px] ${getStatusColor(campaign.status)}`}>
                        {campaign.status === 'active' ? '运行中' : 
                         campaign.status === 'paused' ? '已暂停' :
                         campaign.status === 'completed' ? '已完成' :
                         campaign.status === 'optimizing' ? '优化中' : '草稿'}
                      </NeuralBadge>
                      <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">
                        {campaign.platform}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                      展示/点击
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      {campaign.performance.impressions.toLocaleString()} / {campaign.performance.clicks.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                      转化
                    </div>
                    <div className="text-sm font-bold text-[#00DC82] mt-1">
                      {campaign.performance.conversions}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                      CPA
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      ¥{campaign.performance.cpa.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                      ROAS
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      {campaign.performance.roas.toFixed(1)}x
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-[9px] uppercase tracking-widest font-black">
                    <span className="text-slate-500">预算使用</span>
                    <span className="text-white">
                      {((campaign.budget.spent / campaign.budget.daily) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00DC82] to-[#00C16A]"
                      style={{ width: `${Math.min((campaign.budget.spent / campaign.budget.daily) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-[8px] text-slate-600">
                    ¥{campaign.budget.spent.toFixed(0)} / ¥{campaign.budget.daily}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-white/5">
                  {campaign.status === 'active' ? (
                    <NeuralButton
                      onClick={() => handlePauseCampaign(campaign.id)}
                      variant="secondary"
                      size="xs"
                      className="flex-1"
                    >
                      ⏸️ 暂停
                    </NeuralButton>
                  ) : (
                    <NeuralButton
                      onClick={() => handleResumeCampaign(campaign.id)}
                      variant="primary"
                      size="xs"
                      className="flex-1"
                    >
                      ▶️ 恢复
                    </NeuralButton>
                  )}
                  <NeuralButton variant="ghost" size="xs" className="flex-1">
                    📊 详情
                  </NeuralButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
