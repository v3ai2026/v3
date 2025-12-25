# 📚 API 参考文档

本文档详细介绍了 AI 全栈开发与营销自动化平台的所有 API 和服务接口。

## 目录

- [Gemini AI 服务](#gemini-ai-服务)
- [广告服务](#广告服务)
- [部署服务](#部署服务)
- [云存储服务](#云存储服务)
- [工具服务](#工具服务)

---

## Gemini AI 服务

### `geminiService.ts`

提供 Google Gemini AI 模型的核心功能。

#### `generateCode(prompt: string): Promise<string>`

生成代码。

**参数:**
- `prompt` (string): 代码生成提示

**返回:**
- `Promise<string>`: 生成的代码

**示例:**
```typescript
import { geminiService } from './services/geminiService';

const code = await geminiService.generateCode(
  '创建一个 React 组件，显示用户列表'
);
console.log(code);
```

#### `chat(message: string, history?: Message[]): Promise<string>`

进行对话交互。

**参数:**
- `message` (string): 用户消息
- `history` (Message[]): 可选的对话历史

**返回:**
- `Promise<string>`: AI 回复

**示例:**
```typescript
const response = await geminiService.chat(
  '如何优化 React 性能？',
  [{ role: 'user', content: '你好' }, { role: 'assistant', content: '你好！' }]
);
```

---

## 广告服务

### 统一广告服务 - `unifiedAdsService.ts`

管理所有广告平台的统一接口。

#### `createCampaign(config: CampaignConfig): Promise<Campaign>`

创建广告活动。

**参数:**
```typescript
interface CampaignConfig {
  name: string;                    // 活动名称
  platform: AdPlatform;            // 广告平台
  type: CampaignType;              // 活动类型
  objective: CampaignObjective;    // 营销目标
  budget: {
    daily?: number;                // 每日预算
    total?: number;                // 总预算
    currency?: string;             // 货币（默认 'CNY'）
  };
  schedule: {
    startDate: Date;               // 开始日期
    endDate?: Date;                // 结束日期
  };
  targeting: {
    locations?: string[];          // 地理位置
    age?: { min: number; max: number }; // 年龄范围
    gender?: 'male' | 'female' | 'all'; // 性别
    interests?: string[];          // 兴趣标签
  };
}
```

**返回:**
```typescript
interface Campaign {
  id: string;
  name: string;
  platform: AdPlatform;
  status: 'active' | 'paused' | 'ended';
  budget: Budget;
  metrics: Metrics;
  createdAt: Date;
  updatedAt: Date;
}
```

**示例:**
```typescript
import { unifiedAdsService } from './services/ads/unifiedAdsService';

const campaign = await unifiedAdsService.createCampaign({
  name: '夏季促销活动',
  platform: 'google_ads',
  type: 'search',
  objective: 'conversions',
  budget: {
    daily: 500,
    total: 15000,
    currency: 'CNY'
  },
  schedule: {
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  targeting: {
    locations: ['China', 'CN-11'], // 中国、北京
    age: { min: 25, max: 45 },
    gender: 'all',
    interests: ['fashion', 'shopping']
  }
});
```

#### `getAggregateMetrics(): Promise<AggregateMetrics>`

获取所有广告的聚合指标。

**返回:**
```typescript
interface AggregateMetrics {
  totalSpend: number;              // 总花费
  totalImpressions: number;        // 总展示量
  totalClicks: number;             // 总点击量
  totalConversions: number;        // 总转化数
  averageCTR: number;              // 平均点击率
  averageCPC: number;              // 平均点击成本
  averageCPA: number;              // 平均转化成本
  averageROAS: number;             // 平均广告支出回报率
  activeCampaigns: number;         // 活跃广告数
}
```

#### `autoOptimizeCampaigns(): Promise<OptimizationResult[]>`

自动优化所有广告活动。

**返回:**
```typescript
interface OptimizationResult {
  campaignId: string;
  action: 'paused' | 'budget_increased' | 'no_action';
  reason: string;
  oldValue?: number;
  newValue?: number;
}
```

**示例:**
```typescript
const results = await unifiedAdsService.autoOptimizeCampaigns();
results.forEach(result => {
  console.log(`${result.campaignId}: ${result.action} - ${result.reason}`);
});
```

---

### AI 文案生成服务 - `aiCopywritingService.ts`

AI 驱动的广告文案创意生成。

#### `generateAdCopy(config: AdCopyConfig): Promise<AdCopyVariants>`

生成广告文案变体。

**参数:**
```typescript
interface AdCopyConfig {
  productName: string;             // 产品名称
  productDescription: string;      // 产品描述
  targetAudience: string;          // 目标受众
  sellingPoints: string[];         // 卖点
  tone?: 'professional' | 'casual' | 'urgent' | 'friendly'; // 语气
  platform: AdPlatform;            // 广告平台
  language?: string;               // 语言（默认 'zh-CN'）
}
```

**返回:**
```typescript
interface AdCopyVariants {
  headlines: string[];             // 10+ 标题变体
  descriptions: string[];          // 10+ 描述变体
  ctas: string[];                  // 10+ CTA 变体
  keywords: string[];              // 推荐关键词
  hashtags?: string[];             // 推荐话题标签（适用于社交媒体）
}
```

**示例:**
```typescript
import { aiCopywritingService } from './services/ads/aiCopywritingService';

const copy = await aiCopywritingService.generateAdCopy({
  productName: '夏季连衣裙',
  productDescription: '轻薄透气，时尚百搭的夏季必备单品',
  targetAudience: '25-45岁都市女性',
  sellingPoints: ['透气舒适', '时尚设计', '限时7折'],
  tone: 'friendly',
  platform: 'google_ads',
  language: 'zh-CN'
});

console.log('标题:', copy.headlines);
console.log('描述:', copy.descriptions);
console.log('CTA:', copy.ctas);
```

#### `optimizeCopy(originalCopy: string, metrics: Metrics): Promise<string>`

基于性能数据优化文案。

**参数:**
- `originalCopy` (string): 原始文案
- `metrics` (Metrics): 广告性能数据

**返回:**
- `Promise<string>`: 优化后的文案

---

### 数据分析服务 - `analyticsService.ts`

广告数据分析和报告生成。

#### `generateReport(campaigns: Campaign[]): Promise<AnalyticsReport>`

生成详细分析报告。

**返回:**
```typescript
interface AnalyticsReport {
  summary: {
    totalSpend: number;
    totalRevenue: number;
    totalConversions: number;
    averageROAS: number;
  };
  topPerformers: Campaign[];       // 表现最佳的广告
  underperformers: Campaign[];     // 表现不佳的广告
  platformBreakdown: {
    platform: string;
    spend: number;
    conversions: number;
    roas: number;
  }[];
  recommendations: string[];       // AI 推荐
  insights: string[];              // 数据洞察
}
```

#### `predictPerformance(campaign: Campaign, days: number): Promise<Prediction>`

预测广告未来表现。

**参数:**
- `campaign` (Campaign): 广告活动
- `days` (number): 预测天数

**返回:**
```typescript
interface Prediction {
  estimatedSpend: number;
  estimatedClicks: number;
  estimatedConversions: number;
  estimatedROAS: number;
  confidence: number;              // 置信度 (0-1)
}
```

#### `exportData(campaigns: Campaign[], format: 'csv' | 'json'): Promise<string>`

导出广告数据。

**参数:**
- `campaigns` (Campaign[]): 广告活动列表
- `format` ('csv' | 'json'): 导出格式

**返回:**
- `Promise<string>`: 导出的数据字符串

---

### AI 客服服务 - `aiChatbotService.ts`

智能客服机器人。

#### `chat(message: string, context: ChatContext): Promise<ChatResponse>`

处理客户消息。

**参数:**
```typescript
interface ChatContext {
  userId: string;
  channel: 'web' | 'facebook' | 'wechat' | 'whatsapp';
  history: Message[];
  userProfile?: {
    name?: string;
    email?: string;
    previousPurchases?: Product[];
  };
}
```

**返回:**
```typescript
interface ChatResponse {
  message: string;                 // AI 回复
  intent: string;                  // 识别的意图
  recommendations?: Product[];     // 产品推荐
  actions?: Action[];              // 建议的操作
  sentiment: 'positive' | 'neutral' | 'negative'; // 情感分析
}
```

#### `generateFollowUp(userId: string, type: 'cart_abandonment' | 'post_purchase'): Promise<string>`

生成自动跟进消息。

---

### 营销自动化服务 - `marketingAutomationService.ts`

自动化营销工作流。

#### `createWorkflow(config: WorkflowConfig): Promise<Workflow>`

创建自动化工作流。

**参数:**
```typescript
interface WorkflowConfig {
  name: string;
  trigger: {
    type: 'user_signup' | 'purchase' | 'cart_abandonment' | 'custom';
    conditions?: Record<string, any>;
  };
  steps: WorkflowStep[];
}

interface WorkflowStep {
  action: 'send_email' | 'send_sms' | 'create_ad' | 'send_coupon' | 'wait';
  delay?: number;                  // 延迟（秒）
  config: Record<string, any>;
}
```

**示例:**
```typescript
import { marketingAutomationService } from './services/ads/marketingAutomationService';

const workflow = await marketingAutomationService.createWorkflow({
  name: '购物车放弃挽回流程',
  trigger: {
    type: 'cart_abandonment'
  },
  steps: [
    {
      action: 'wait',
      delay: 7200 // 2小时后
    },
    {
      action: 'send_email',
      config: {
        template: 'cart_reminder',
        subject: '您的购物车还有商品哦'
      }
    },
    {
      action: 'wait',
      delay: 86400 // 24小时后
    },
    {
      action: 'send_coupon',
      config: {
        discount: 15,
        type: 'percentage'
      }
    }
  ]
});
```

#### `triggerWorkflow(workflowId: string, userId: string, data?: any): Promise<void>`

手动触发工作流。

---

### AR 广告服务 - `arAdvertisingService.ts`

增强现实广告体验。

#### `createARExperience(config: ARConfig): Promise<ARExperience>`

创建 AR 广告体验。

**参数:**
```typescript
interface ARConfig {
  type: 'floating_product' | 'virtual_try_on' | 'interactive_billboard' | 'portal' | 'game';
  product: {
    name: string;
    modelUrl: string;              // 3D 模型 URL
    scale?: number;
    rotation?: { x: number; y: number; z: number };
  };
  interactions?: string[];         // 可用交互
  analytics?: boolean;             // 是否启用分析
}
```

**返回:**
```typescript
interface ARExperience {
  id: string;
  url: string;                     // AR 体验 URL
  qrCode: string;                  // 二维码（base64）
  embedCode: string;               // 嵌入代码
  analytics: {
    views: number;
    interactions: number;
    averageTime: number;
  };
}
```

---

### 视频广告生成服务 - `videoAdGenerationService.ts`

AI 视频广告制作。

#### `generateVideo(config: VideoConfig): Promise<VideoAd>`

生成视频广告。

**参数:**
```typescript
interface VideoConfig {
  product: {
    name: string;
    images: string[];              // 产品图片 URLs
    description: string;
  };
  duration: 15 | 30 | 60;          // 视频时长（秒）
  style: 'modern' | 'minimal' | 'energetic' | 'professional';
  music?: boolean;                 // 是否添加背景音乐
  voiceover?: boolean;             // 是否添加配音
  subtitles?: boolean;             // 是否添加字幕
}
```

**返回:**
```typescript
interface VideoAd {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  script: string;                  // 视频脚本
  downloadUrl: string;
}
```

---

### 广告笔记本服务 - `adNotebookService.ts`

广告记录和管理。

#### `createNote(note: AdNote): Promise<AdNote>`

创建广告笔记。

**参数:**
```typescript
interface AdNote {
  title: string;
  content: string;
  tags: string[];
  relatedCampaigns?: string[];
  attachments?: File[];
}
```

#### `exportNotes(noteIds: string[], format: 'markdown' | 'pdf'): Promise<Blob>`

导出笔记。

---

## 部署服务

### Vercel 部署服务 - `vercelService.ts`

自动化部署到 Vercel。

#### `deploy(project: Project): Promise<Deployment>`

部署项目到 Vercel。

**参数:**
```typescript
interface Project {
  name: string;
  files: {
    path: string;
    content: string;
  }[];
  env?: Record<string, string>;
}
```

**返回:**
```typescript
interface Deployment {
  id: string;
  url: string;
  status: 'queued' | 'building' | 'ready' | 'error';
  createdAt: Date;
}
```

**示例:**
```typescript
import { vercelService } from './services/vercelService';

const deployment = await vercelService.deploy({
  name: 'my-website',
  files: [
    { path: 'index.html', content: '<html>...</html>' },
    { path: 'style.css', content: 'body { ... }' }
  ],
  env: {
    API_KEY: 'xxx'
  }
});

console.log('部署 URL:', deployment.url);
```

---

## 云存储服务

### Google Cloud Storage - `gcsService.ts`

文件上传和管理。

#### `uploadFile(file: File, path: string): Promise<string>`

上传文件到 GCS。

**返回:**
- `Promise<string>`: 文件的公开 URL

#### `deleteFile(path: string): Promise<void>`

删除文件。

#### `listFiles(prefix?: string): Promise<FileInfo[]>`

列出文件。

---

## 工具服务

### Figma 集成 - `figmaService.ts`

从 Figma 设计生成代码。

#### `importDesign(figmaUrl: string): Promise<string>`

从 Figma URL 导入设计并生成代码。

**参数:**
- `figmaUrl` (string): Figma 文件或节点的 URL

**返回:**
- `Promise<string>`: 生成的代码

---

## 类型定义

所有类型定义位于 `types.ts` 文件中。主要类型包括：

### 广告平台枚举

```typescript
type AdPlatform = 
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
```

### 广告活动类型

```typescript
type CampaignType = 
  | 'search'
  | 'display'
  | 'video'
  | 'shopping'
  | 'app'
  | 'local'
  | 'smart';
```

### 营销目标

```typescript
type CampaignObjective = 
  | 'awareness'
  | 'consideration'
  | 'conversions'
  | 'sales'
  | 'leads'
  | 'traffic'
  | 'engagement';
```

---

## 错误处理

所有 API 调用都应该使用 try-catch 进行错误处理：

```typescript
try {
  const campaign = await unifiedAdsService.createCampaign(config);
  console.log('创建成功:', campaign);
} catch (error) {
  console.error('创建失败:', error.message);
  // 处理错误
}
```

常见错误类型：
- `InvalidAPIKeyError`: API 密钥无效
- `QuotaExceededError`: API 配额超限
- `InvalidParameterError`: 参数错误
- `NetworkError`: 网络连接错误
- `PlatformAPIError`: 广告平台 API 错误

---

## 最佳实践

### 1. 使用环境变量

不要在代码中硬编码 API 密钥：

```typescript
// ❌ 不好
const apiKey = 'AIzaSy...';

// ✅ 好
const apiKey = import.meta.env.GEMINI_API_KEY;
```

### 2. 错误处理

始终处理可能的错误：

```typescript
try {
  await adService.createCampaign(config);
} catch (error) {
  if (error instanceof QuotaExceededError) {
    // 处理配额超限
  } else if (error instanceof NetworkError) {
    // 处理网络错误
  }
}
```

### 3. 性能优化

使用批量操作而不是循环调用：

```typescript
// ❌ 不好
for (const campaign of campaigns) {
  await service.updateCampaign(campaign);
}

// ✅ 好
await service.batchUpdateCampaigns(campaigns);
```

### 4. 数据验证

在调用 API 前验证数据：

```typescript
if (!config.name || config.budget.daily <= 0) {
  throw new InvalidParameterError('Invalid campaign config');
}
```

---

## 相关资源

- [安装指南](INSTALLATION.md)
- [广告系统使用指南](ADVERTISING_GUIDE.md)
- [常见问题解答](TROUBLESHOOTING.md)
- [GitHub 仓库](https://github.com/v3ai2026/vision-)

---

**需要帮助？创建一个 [Issue](https://github.com/v3ai2026/vision-/issues) 或查看其他文档！** 📖
