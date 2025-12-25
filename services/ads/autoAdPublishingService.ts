/**
 * 自动发广告服务
 * Auto Ad Publishing Service - Automatically generates and publishes ads
 */

import { AICopywritingService } from './aiCopywritingService';
import { UnifiedAdsService, CreateCampaignInput } from './unifiedAdsService';
import { AdPlatform, BiddingStrategy } from '../../types';

export interface AutoAdConfig {
  // 产品信息
  productInfo: {
    name: string;
    description: string;
    category: string;
    price?: number;
    imageUrl?: string;
  };
  
  // 目标受众
  targetAudience: {
    locations: string[];
    ageRange: [number, number];
    gender?: 'male' | 'female' | 'all';
    interests: string[];
  };
  
  // 投放设置
  publishSettings: {
    platforms: AdPlatform[];
    dailyBudget: number;
    duration: number; // 天数
    startImmediately: boolean;
  };
  
  // 自动化选项
  autoOptions: {
    enableAutoOptimization: boolean;
    autoGenerateVariations: boolean;
    autoPauseOnLowPerformance: boolean;
    autoScaleBudget: boolean;
  };
}

export interface AutoPublishResult {
  success: boolean;
  campaignsCreated: Array<{
    platform: AdPlatform;
    campaignId: string;
    campaignName: string;
    status: string;
  }>;
  creativesGenerated: number;
  estimatedReach: number;
  message: string;
}

export class AutoAdPublishingService {
  private copywritingService: AICopywritingService;
  private adsService: UnifiedAdsService;

  constructor() {
    this.copywritingService = new AICopywritingService();
    this.adsService = new UnifiedAdsService();
  }

  /**
   * 一键自动发布广告到多个平台
   */
  async autoPublishAds(config: AutoAdConfig): Promise<AutoPublishResult> {
    const result: AutoPublishResult = {
      success: false,
      campaignsCreated: [],
      creativesGenerated: 0,
      estimatedReach: 0,
      message: ''
    };

    try {
      console.log('🚀 开始自动发布广告...');

      // Step 1: AI 生成广告文案
      const generatedCopy = await this.copywritingService.generateAdCopy({
        productName: config.productInfo.name,
        productDescription: config.productInfo.description,
        targetAudience: config.targetAudience.interests.join(', '),
        sellingPoints: [config.productInfo.category],
        platform: config.publishSettings.platforms[0],
        adType: 'display',
        tone: 'professional',
        language: 'Chinese (Simplified)'
      });

      result.creativesGenerated = generatedCopy.headlines.length;

      // Step 2: 为每个平台创建广告活动
      const startDate = config.publishSettings.startImmediately 
        ? new Date().toISOString()
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const endDate = new Date(
        new Date(startDate).getTime() + config.publishSettings.duration * 24 * 60 * 60 * 1000
      ).toISOString();

      for (const platform of config.publishSettings.platforms) {
        const campaignInput: CreateCampaignInput = {
          name: `${config.productInfo.name} - ${platform} - 自动投放`,
          platform: platform,
          adType: 'display',
          budget: {
            daily: config.publishSettings.dailyBudget,
            total: config.publishSettings.dailyBudget * config.publishSettings.duration,
            currency: 'CNY'
          },
          targeting: {
            locations: config.targetAudience.locations,
            ageRange: config.targetAudience.ageRange,
            gender: config.targetAudience.gender || 'all',
            interests: config.targetAudience.interests,
            keywords: [config.productInfo.name, config.productInfo.category]
          },
          biddingStrategy: 'maximize_conversions' as BiddingStrategy,
          schedule: {
            startDate,
            endDate
          }
        };

        const campaign = await this.adsService.createCampaign(campaignInput);

        // 创建多个创意变体
        const variationsCount = config.autoOptions.autoGenerateVariations ? 3 : 1;
        for (let i = 0; i < variationsCount; i++) {
          await this.adsService.createCreative({
            campaignId: campaign.id,
            type: 'text',
            headline: generatedCopy.headlines[i] || generatedCopy.headlines[0],
            description: generatedCopy.descriptions[i] || generatedCopy.descriptions[0],
            callToAction: generatedCopy.callToActions[i] || generatedCopy.callToActions[0],
            imageUrl: config.productInfo.imageUrl,
            aiGenerated: true
          });
        }

        // 自动启动广告
        if (config.publishSettings.startImmediately) {
          await this.adsService.updateCampaignStatus(campaign.id, 'active');
        }

        result.campaignsCreated.push({
          platform,
          campaignId: campaign.id,
          campaignName: campaign.name,
          status: config.publishSettings.startImmediately ? 'active' : 'scheduled'
        });

        result.estimatedReach += this.estimateReach(platform, config.publishSettings.dailyBudget);
      }

      result.success = true;
      result.message = `成功创建 ${result.campaignsCreated.length} 个广告活动，生成 ${result.creativesGenerated} 个创意变体。预计覆盖 ${result.estimatedReach.toLocaleString()} 人。`;

      return result;

    } catch (error: any) {
      result.success = false;
      result.message = `发布失败: ${error.message}`;
      return result;
    }
  }

  /**
   * 批量自动发布
   */
  async batchAutoPublish(configs: AutoAdConfig[]): Promise<AutoPublishResult[]> {
    const results: AutoPublishResult[] = [];
    for (const config of configs) {
      const result = await this.autoPublishAds(config);
      results.push(result);
      await this.delay(2000);
    }
    return results;
  }

  private estimateReach(platform: AdPlatform, budget: number): number {
    const cpmRates: Record<AdPlatform, number> = {
      google_ads: 30, facebook_ads: 25, tiktok_ads: 20, douyin_ads: 15,
      kuaishou_ads: 18, xiaohongshu_ads: 22, wechat_ads: 28, baidu_ads: 26,
      tencent_ads: 24, alimama_ads: 20
    };
    const cpm = cpmRates[platform] || 25;
    return Math.floor((budget / cpm) * 1000);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
