/**
 * AI Ad Creator Component
 * One-click AI-powered ad generation wizard
 */

import React, { useState } from 'react';
import { 
  NeuralButton, 
  NeuralInput, 
  NeuralTextArea, 
  GlassCard,
  NeuralBadge,
  NeuralSpinner
} from '../UIElements';
import { AICopywritingService, GeneratedCopy } from '../../services/ads/aiCopywritingService';
import { UnifiedAdsService, CreateCampaignInput } from '../../services/ads/unifiedAdsService';
import { AdPlatform, AdType, BiddingStrategy } from '../../types';

interface AIAdCreatorProps {
  adsService: UnifiedAdsService;
  copywritingService: AICopywritingService;
  onCampaignCreated?: () => void;
}

export const AIAdCreator: React.FC<AIAdCreatorProps> = ({ 
  adsService, 
  copywritingService,
  onCampaignCreated 
}) => {
  const [step, setStep] = useState<'input' | 'generating' | 'preview' | 'success'>("input");
  
  // Form inputs
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [sellingPoints, setSellingPoints] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform>('google_ads');
  const [budget, setBudget] = useState('500');
  
  // Generated content
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);
  const [selectedHeadline, setSelectedHeadline] = useState(0);
  const [selectedDescription, setSelectedDescription] = useState(0);
  const [selectedCTA, setSelectedCTA] = useState(0);

  const platforms: Array<{ id: AdPlatform; label: string; icon: string; description: string }> = [
    { id: 'google_ads', label: 'Google Ads', icon: '🔍', description: '搜索和展示广告' },
    { id: 'facebook_ads', label: 'Facebook', icon: '📘', description: 'Facebook + Instagram' },
    { id: 'tiktok_ads', label: 'TikTok', icon: '🎵', description: '国际版抖音' },
    { id: 'douyin_ads', label: '抖音', icon: '🎬', description: '抖音国内版' },
    { id: 'wechat_ads', label: '微信', icon: '💬', description: '朋友圈/公众号' },
    { id: 'baidu_ads', label: '百度', icon: '🔎', description: '百度推广' }
  ];

  const handleGenerateAd = async () => {
    if (!productName || !productDescription || !targetAudience) {
      alert('请填写所有必填字段');
      return;
    }

    setStep('generating');

    try {
      const copy = await copywritingService.generateAdCopy({
        productName,
        productDescription,
        targetAudience,
        sellingPoints: sellingPoints.split(',').map(s => s.trim()).filter(Boolean),
        platform: selectedPlatform,
        adType: 'display',
        tone: 'professional',
        language: 'Chinese (Simplified)'
      });

      setGeneratedCopy(copy);
      setStep('preview');
    } catch (error) {
      console.error('Failed to generate ad copy:', error);
      alert('生成广告文案失败，请重试');
      setStep('input');
    }
  };

  const handleCreateCampaign = async () => {
    if (!generatedCopy) return;

    try {
      const campaignInput: CreateCampaignInput = {
        name: `${productName} - ${selectedPlatform}`,
        platform: selectedPlatform,
        adType: 'display',
        budget: {
          daily: parseFloat(budget),
          total: parseFloat(budget) * 30,
          currency: 'CNY'
        },
        targeting: {
          locations: ['中国'],
          ageRange: [18, 65],
          gender: 'all',
          interests: targetAudience.split(',').map(s => s.trim()).filter(Boolean)
        },
        biddingStrategy: 'maximize_conversions',
        schedule: {
          startDate: new Date().toISOString()
        }
      };

      const campaign = await adsService.createCampaign(campaignInput);

      // Create creative
      await adsService.createCreative({
        campaignId: campaign.id,
        type: 'text',
        headline: generatedCopy.headlines[selectedHeadline],
        description: generatedCopy.descriptions[selectedDescription],
        callToAction: generatedCopy.callToActions[selectedCTA],
        aiGenerated: true
      });

      // Activate campaign
      await adsService.updateCampaignStatus(campaign.id, 'active');

      setStep('success');
      
      if (onCampaignCreated) {
        setTimeout(() => {
          onCampaignCreated();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert('创建广告活动失败，请重试');
    }
  };

  const handleReset = () => {
    setStep('input');
    setProductName('');
    setProductDescription('');
    setTargetAudience('');
    setSellingPoints('');
    setBudget('500');
    setGeneratedCopy(null);
  };

  if (step === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <NeuralSpinner size="lg" />
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-white">AI 正在生成广告创意...</h3>
          <p className="text-sm text-slate-500">分析产品特性，优化文案策略</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-modal-fade">
        <div className="text-7xl">🎉</div>
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-black text-[#00DC82]">广告创建成功！</h3>
          <p className="text-sm text-slate-400">广告活动已启动，AI 正在自动优化中</p>
        </div>
        <NeuralButton onClick={handleReset} variant="primary">
          创建新广告
        </NeuralButton>
      </div>
    );
  }

  if (step === 'preview' && generatedCopy) {
    return (
      <div className="space-y-8 animate-modal-fade">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-white">预览广告创意</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
              选择最佳版本或重新生成
            </p>
          </div>
          <NeuralButton onClick={() => setStep('input')} variant="secondary" size="sm">
            ← 返回修改
          </NeuralButton>
        </div>

        {/* Headlines */}
        <div className="space-y-4">
          <label className="text-xs font-black text-[#00DC82] uppercase tracking-[0.3em]">
            标题 (选择一个)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {generatedCopy.headlines.slice(0, 6).map((headline, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedHeadline(idx)}
                className={`p-4 rounded-2xl text-left transition-all border-2 ${
                  selectedHeadline === idx
                    ? 'border-[#00DC82] bg-[#00DC82]/10 text-white'
                    : 'border-white/5 bg-black/40 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="text-sm font-bold">{headline}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-4">
          <label className="text-xs font-black text-[#00DC82] uppercase tracking-[0.3em]">
            描述 (选择一个)
          </label>
          <div className="grid grid-cols-1 gap-3">
            {generatedCopy.descriptions.slice(0, 4).map((description, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDescription(idx)}
                className={`p-4 rounded-2xl text-left transition-all border-2 ${
                  selectedDescription === idx
                    ? 'border-[#00DC82] bg-[#00DC82]/10 text-white'
                    : 'border-white/5 bg-black/40 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="text-xs">{description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-4">
          <label className="text-xs font-black text-[#00DC82] uppercase tracking-[0.3em]">
            行动号召 (选择一个)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {generatedCopy.callToActions.slice(0, 8).map((cta, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCTA(idx)}
                className={`p-3 rounded-xl text-center transition-all border-2 text-xs font-bold ${
                  selectedCTA === idx
                    ? 'border-[#00DC82] bg-[#00DC82]/10 text-[#00DC82]'
                    : 'border-white/5 bg-black/40 text-slate-400 hover:border-white/20'
                }`}
              >
                {cta}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Card */}
        <GlassCard className="p-8 space-y-4 border-l-4 border-[#00DC82]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
            广告预览
          </div>
          <div className="space-y-3">
            <h4 className="text-xl font-black text-white">
              {generatedCopy.headlines[selectedHeadline]}
            </h4>
            <p className="text-sm text-slate-300">
              {generatedCopy.descriptions[selectedDescription]}
            </p>
            <div className="pt-2">
              <span className="inline-block px-4 py-2 bg-[#00DC82] text-black text-xs font-black rounded-lg">
                {generatedCopy.callToActions[selectedCTA]}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <NeuralButton onClick={handleCreateCampaign} variant="primary" className="flex-1">
            🚀 创建并启动广告
          </NeuralButton>
          <NeuralButton onClick={handleGenerateAd} variant="secondary">
            🔄 重新生成
          </NeuralButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-modal-fade">
      <div className="text-center space-y-2">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
          🎨 AI 一键生成广告
        </h2>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
          输入产品信息，AI 自动生成高转化广告文案
        </p>
      </div>

      <GlassCard className="p-8 md:p-12 space-y-8">
        {/* Step 1: Product Info */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-[#00DC82] uppercase tracking-[0.3em]">
            1️⃣ 产品信息
          </h3>
          
          <NeuralInput
            label="产品名称 *"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="例如：夏季清凉连衣裙"
          />

          <NeuralTextArea
            label="产品描述 *"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="详细描述产品特点、材质、功能等..."
            className="h-32"
          />

          <NeuralInput
            label="卖点 (逗号分隔)"
            value={sellingPoints}
            onChange={(e) => setSellingPoints(e.target.value)}
            placeholder="透气舒适,限时7折,包邮"
          />

          <NeuralInput
            label="目标受众 *"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="25-45岁女性,注重时尚,中高收入"
          />
        </div>

        {/* Step 2: Platform Selection */}
        <div className="space-y-6 pt-8 border-t border-white/5">
          <h3 className="text-xs font-black text-[#00DC82] uppercase tracking-[0.3em]">
            2️⃣ 投放平台
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {platforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`p-6 rounded-2xl text-left transition-all border-2 space-y-2 ${
                  selectedPlatform === platform.id
                    ? 'border-[#00DC82] bg-[#00DC82]/10'
                    : 'border-white/5 bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="text-3xl">{platform.icon}</div>
                <div className="text-sm font-black text-white">{platform.label}</div>
                <div className="text-[9px] text-slate-500">{platform.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Budget */}
        <div className="space-y-6 pt-8 border-t border-white/5">
          <h3 className="text-xs font-black text-[#00DC82] uppercase tracking-[0.3em]">
            3️⃣ 预算设置
          </h3>
          
          <NeuralInput
            label="每日预算 (CNY)"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="500"
          />
          
          <div className="text-xs text-slate-500">
            预计月度预算: ¥{(parseFloat(budget) * 30).toLocaleString()} (30天)
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-8 border-t border-white/5">
          <NeuralButton 
            onClick={handleGenerateAd} 
            variant="primary" 
            size="lg"
            className="w-full !rounded-2xl"
          >
            ✨ AI 生成广告创意
          </NeuralButton>
        </div>
      </GlassCard>
    </div>
  );
};
