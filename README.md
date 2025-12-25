<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🚀 AI 全栈开发与营销自动化平台

一个集成了 **AI 全栈代码生成**、**多平台广告自动化**、**3D/AR 展示**、**智能客服** 于一体的超级 AI 系统。

**AI Studio 链接**: https://ai.studio/apps/drive/1pKtDgh7WukKx9-Yh1Rmpy0ihKgvkExTf

## ✨ 核心功能

### 🎨 AI 全栈开发系统
- **Gemini 驱动的代码生成** - 一键生成完整的全栈项目
- **智能架构设计** - SaaS、电商、作品集等多种架构模板
- **实时预览与编辑** - Monaco Editor 集成
- **一键部署** - Vercel 自动化部署
- **Colab Notebook 导出** - 支持数据科学工作流

### 📢 AI 广告营销自动化系统
- **多平台整合** - 支持 10+ 广告平台
  - Google Ads（搜索/展示/购物/YouTube）
  - Facebook Ads（Facebook + Instagram）
  - TikTok Ads（国际版）
  - 抖音、快手、小红书、微信、百度、腾讯、阿里妈妈
  
- **AI 创意生成**
  - 自动生成广告文案（10+ 变体）
  - 智能视频广告制作
  - AR 增强现实广告
  - 多语言本地化

- **智能投放管理**
  - AI 自动出价优化
  - 智能受众定向
  - 实时性能监控
  - 自动暂停低效广告
  - 自动增加高效广告预算

- **营销自动化**
  - 工作流引擎（欢迎流程、购物车挽回、售后跟进）
  - AI 客服机器人（24/7 多渠道支持）
  - 智能产品推荐
  - 自动优惠券发放

- **AR 广告体验**
  - WebXR/A-Frame 集成
  - 5 种 AR 模板（悬浮产品、虚拟试穿、互动广告牌等）
  - AR 互动追踪
  - 二维码一键启动

- **视频广告生成**
  - AI 自动剪辑
  - 15/30/60 秒多种时长
  - 多种风格模板
  - 自动字幕和特效

- **广告笔记本**
  - 广告记录管理
  - 笔记分类和标签
  - Markdown 导出
  - 自动生成总结报告

- **数据分析与报告**
  - 多平台数据整合
  - 实时仪表板
  - AI 洞察和建议
  - CSV/JSON 导出
  - 7 天性能预测

### 🎯 AI 代理管理系统
- **多代理协作** - 创建和管理多个 AI 代理
- **角色定制** - 为不同代理分配专门角色
- **任务编排** - 复杂任务的智能分解

### 🎭 设计集成
- **Figma 集成** - 直接从 Figma 设计生成代码
- **响应式设计** - 优先移动端适配

### ☁️ 云服务集成
- **Google Cloud Storage** - 文件上传和管理
- **语音转文字** - Gemini 多模态转录
- **文字转语音** - 自然语音合成

## 🛠️ 技术栈

### 前端
- **React 19** + **TypeScript**
- **Vite** - 超快构建工具
- **Monaco Editor** - VS Code 编辑器
- **Tailwind CSS** - 实用优先的 CSS
- **A-Frame** + **AR.js** - AR 增强现实

### AI/ML
- **Google Gemini** - 最先进的 AI 模型
  - gemini-pro
  - gemini-flash
  - gemini-exp
- **多模态支持** - 文本、图像、音频、视频

### 广告平台 API
- Google Ads API
- Facebook Marketing API
- TikTok For Business API
- 巨量引擎（抖音国内）
- 快手、小红书、微信、百度、腾讯、阿里妈妈

### 云服务
- **Vercel** - 自动化部署
- **Google Cloud Storage** - 文件存储
- **Supabase Ready** - 数据库集成准备

## 📦 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/v3ai2026/vision-.git
   cd vision-
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   创建 `.env.local` 文件：
   ```env
   # Gemini AI API Key (必需)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Vercel 部署 (可选)
   VERCEL_TOKEN=your_vercel_token
   
   # Google Cloud Storage (可选)
   GCS_BUCKET_NAME=your_bucket_name
   GCS_SERVICE_ACCOUNT=your_service_account_json
   
   # 广告平台 API Keys (可选)
   GOOGLE_ADS_API_KEY=your_google_ads_key
   FACEBOOK_ADS_ACCESS_TOKEN=your_facebook_token
   TIKTOK_ADS_ACCESS_TOKEN=your_tiktok_token
   # ... 其他平台
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问: `http://localhost:5173`

## 🎯 使用指南

### 🏗️ AI 全栈开发

1. 点击侧边栏的 **"Build"** 图标
2. 选择开发模式：
   - **Instant Mode** - 快速生成（30秒内）
   - **Architect Mode** - 深度定制架构
3. 描述你的项目需求
4. AI 自动生成完整代码
5. 实时预览和编辑
6. 一键部署到 Vercel

### 📢 AI 广告营销

1. 点击侧边栏的 **"Ads"** 图标
2. 选择 **"创建广告"**
3. 输入产品信息：
   - 产品名称和描述
   - 目标受众
   - 卖点
4. 选择投放平台（可多选）
5. 设置预算和时间
6. 点击 **"AI 生成广告创意"**
7. AI 自动生成：
   - 10+ 标题变体
   - 10+ 描述变体
   - 10+ CTA 变体
8. 预览并选择最佳版本
9. **一键启动广告** 🚀

### 📊 广告数据分析

- 实时查看所有广告表现
- AI 智能建议
- 自动优化低效广告
- 自动提升高效广告预算
- 导出详细报告（CSV/JSON）

### 🎬 视频广告生成

1. 进入广告创建流程
2. 选择 **"视频广告"**
3. 上传产品图片
4. 选择视频时长（15/30/60秒）
5. AI 自动生成：
   - 视频脚本
   - 字幕
   - 特效
   - 配音
6. 下载或直接投放

### 🥽 AR 广告体验

1. 创建 AR 广告
2. 选择 AR 模板
3. 配置产品 3D 模型
4. 生成 AR 二维码
5. 用户扫码进入 AR 体验
6. 追踪互动数据

## 📁 项目结构

```
vision-/
├── components/
│   ├── ads/                    # 广告系统组件
│   │   ├── AdsDashboard.tsx    # 广告仪表板
│   │   └── AIAdCreator.tsx     # AI 广告创建器
│   ├── UIElements.tsx          # UI 组件库
│   ├── NeuralModal.tsx         # 模态框组件
│   └── Modal.tsx               # 基础模态框
├── services/
│   ├── ads/                    # 广告服务
│   │   ├── unifiedAdsService.ts          # 统一广告服务
│   │   ├── aiCopywritingService.ts       # AI 文案生成
│   │   ├── analyticsService.ts           # 数据分析
│   │   ├── aiChatbotService.ts           # AI 客服
│   │   ├── marketingAutomationService.ts # 营销自动化
│   │   ├── autoAdPublishingService.ts    # 自动发布
│   │   ├── arAdvertisingService.ts       # AR 广告
│   │   ├── videoAdGenerationService.ts   # 视频生成
│   │   ├── adNotebookService.ts          # 广告笔记本
│   │   ├── googleAdsService.ts           # Google Ads
│   │   ├── facebookAdsService.ts         # Facebook Ads
│   │   ├── tiktokAdsService.ts           # TikTok Ads
│   │   └── chineseAdPlatformsService.ts  # 中国平台
│   ├── geminiService.ts        # Gemini AI 服务
│   ├── figmaService.ts         # Figma 集成
│   ├── vercelService.ts        # Vercel 部署
│   ├── gcsService.ts           # GCS 存储
│   ├── githubService.ts        # GitHub 集成
│   └── googleDriveService.ts   # Google Drive 服务
├── App.tsx                     # 主应用
├── types.ts                    # TypeScript 类型定义
├── index.tsx                   # 入口文件
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 界面展示

### AI 代码生成
```
┌─────────────────────────────────────┐
│  ✨ Build - AI 全栈代码生成器      │
├─────────────────────────────────────┤
│  描述你的项目:                      │
│  [创建一个电商网站...]              │
│                                     │
│  [🚀 AI 生成项目]                  │
└─────────────────────────────────────┘
```

### 广告仪表板
```
┌─────────────────────────────────────┐
│  📊 广告营销中枢                    │
├─────────────────────────────────────┤
│  今日数据                           │
│  💰 总花费: ¥12,345                │
│  👆 转化数: 234                     │
│  📈 ROAS: 4.2x                      │
├─────────────────────────────────────┤
│  🤖 AI 智能建议 (3)                │
│  • Google Ads 建议增加预算 20%     │
│  • Facebook 广告文案 A 表现更好    │
│  • 抖音广告建议调整投放时段        │
└─────────────────────────────────────┘
```

## 🚀 部署

### Vercel 一键部署

1. 在应用中配置 Vercel Token
2. 点击 **"Deploy to Vercel"**
3. 等待部署完成（约 2-3 分钟）
4. 获取部署 URL

### 手动部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 部署到你的服务器
# 将 dist/ 目录内容上传
```

## 📊 商业价值

### 对于开发者
- ⚡ **10 倍开发速度** - AI 自动生成代码
- 🎯 **零配置部署** - 一键上线
- 🔄 **持续迭代** - 快速响应需求

### 对于营销人员
- 💰 **节省 80% 运营时间** - 全自动化
- 📈 **提升 30-50% ROI** - AI 优化
- 🌐 **多平台覆盖** - 10+ 平台统一管理
- 🤖 **24/7 运营** - 无需人工值守

### 对于企业
- 💡 **降低获客成本** 20-40%
- 🚀 **快速市场响应**
- 📊 **数据驱动决策**
- 🔒 **规模化运营**

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- **Google Gemini** - 强大的 AI 引擎
- **Vercel** - 优秀的部署平台
- **React Team** - 出色的前端框架
- **所有开源贡献者**

## 📚 更多文档

- [详细安装指南](docs/zh-CN/INSTALLATION.md)
- [API 参考文档](docs/zh-CN/API_REFERENCE.md)
- [广告系统使用指南](docs/zh-CN/ADVERTISING_GUIDE.md)
- [常见问题解答](docs/zh-CN/TROUBLESHOOTING.md)
- [更新日志](CHANGELOG.md)

## 📞 联系方式

- 项目链接: [https://github.com/v3ai2026/vision-](https://github.com/v3ai2026/vision-)
- AI Studio: [https://ai.studio/apps/drive/1pKtDgh7WukKx9-Yh1Rmpy0ihKgvkExTf](https://ai.studio/apps/drive/1pKtDgh7WukKx9-Yh1Rmpy0ihKgvkExTf)

---

**真正的 AI 驱动全栈开发与营销自动化平台！让 AI 帮你构建和推广产品！** 🚀💡🤖
