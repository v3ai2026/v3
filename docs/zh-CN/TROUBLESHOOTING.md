# ❓ 常见问题解答

本文档收集了使用 AI 全栈开发与营销自动化平台时的常见问题和解决方案。

## 目录

- [安装和配置问题](#安装和配置问题)
- [AI 代码生成问题](#ai-代码生成问题)
- [广告系统问题](#广告系统问题)
- [部署问题](#部署问题)
- [性能问题](#性能问题)
- [API 和集成问题](#api-和集成问题)
- [其他问题](#其他问题)

---

## 安装和配置问题

### Q: 安装依赖时报错 "npm ERR! peer dependency"

**问题描述:**
```bash
npm ERR! peer dep missing: react@^19.0.0
```

**解决方案:**

**方法 1: 使用 legacy peer deps**
```bash
npm install --legacy-peer-deps
```

**方法 2: 强制安装**
```bash
npm install --force
```

**方法 3: 更新 npm 版本**
```bash
npm install -g npm@latest
npm install
```

---

### Q: ".env.local 文件不生效"

**问题描述:**
修改了 `.env.local` 但应用中仍然读取不到环境变量。

**解决方案:**

1. **检查文件名**
   ```bash
   # 确保文件名正确，不是 .env.local.txt
   ls -la .env.local
   ```

2. **检查变量名格式**
   ```env
   # ✅ 正确
   GEMINI_API_KEY=AIzaSy...
   
   # ❌ 错误（有引号）
   GEMINI_API_KEY="AIzaSy..."
   
   # ❌ 错误（有空格）
   GEMINI_API_KEY = AIzaSy...
   ```

3. **重启开发服务器**
   ```bash
   # 按 Ctrl+C 停止服务器
   # 然后重新启动
   npm run dev
   ```

4. **检查变量是否正确导入**
   ```typescript
   // Vite 项目使用 import.meta.env
   const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
   
   // 注意：Vite 要求环境变量以 VITE_ 开头才能在客户端访问
   ```

---

### Q: "端口 5173 已被占用"

**问题描述:**
```
Error: listen EADDRINUSE: address already in use :::5173
```

**解决方案:**

**方法 1: 使用其他端口**
```bash
npm run dev -- --port 3000
```

**方法 2: 结束占用进程（macOS/Linux）**
```bash
# 查找占用端口的进程
lsof -ti:5173

# 结束进程
kill -9 $(lsof -ti:5173)

# 或者一条命令
lsof -ti:5173 | xargs kill -9
```

**方法 3: 结束占用进程（Windows）**
```cmd
# 查找占用端口的进程
netstat -ano | findstr :5173

# 结束进程（替换 <PID> 为实际进程 ID）
taskkill /PID <PID> /F
```

---

### Q: "Node.js 版本过低"

**问题描述:**
```
Error: The engine "node" is incompatible with this module.
Expected version ">=18.0.0". Got "16.14.0"
```

**解决方案:**

**方法 1: 使用 nvm（推荐）**
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装最新 LTS 版本
nvm install --lts

# 使用该版本
nvm use --lts

# 设置为默认版本
nvm alias default node
```

**方法 2: 从官网安装**
访问 [Node.js 官网](https://nodejs.org/) 下载安装最新 LTS 版本。

**方法 3: 使用包管理器**
```bash
# macOS (使用 Homebrew)
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows (使用 Chocolatey)
choco install nodejs-lts
```

---

## AI 代码生成问题

### Q: "Gemini API 调用失败"

**问题描述:**
```
Error: Failed to generate code: 400 Bad Request
或
Error: Invalid API Key
```

**解决方案:**

1. **验证 API Key**
   ```bash
   # 检查 .env.local
   cat .env.local | grep GEMINI_API_KEY
   ```

2. **测试 API Key**
   ```bash
   curl -H "Content-Type: application/json" \
        -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
        "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_API_KEY"
   ```

3. **检查 API Key 权限**
   - 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
   - 确认 API Key 已启用
   - 检查配额是否用完

4. **重新生成 API Key**
   如果以上都不行，尝试创建新的 API Key。

---

### Q: "生成的代码质量不好"

**问题描述:**
生成的代码不符合预期，或者有错误。

**解决方案:**

1. **提供更详细的提示**
   ```
   ❌ 不好: "创建一个网站"
   
   ✅ 好: "创建一个电商网站，包含：
   - 产品列表页面（卡片布局）
   - 产品详情页面
   - 购物车功能
   - 使用 React + TypeScript
   - 使用 Tailwind CSS 样式
   - 响应式设计"
   ```

2. **分步生成**
   不要一次性生成整个项目，而是分步骤：
   - 先生成项目结构
   - 然后生成单个组件
   - 最后整合

3. **使用示例代码**
   在提示中提供参考代码风格。

4. **迭代优化**
   如果第一次生成不满意，要求 AI 修改特定部分。

---

### Q: "生成代码超时"

**问题描述:**
```
Error: Request timeout after 30s
```

**解决方案:**

1. **简化请求**
   - 减少生成内容的复杂度
   - 分多次请求生成

2. **使用更快的模型**
   ```typescript
   // 使用 gemini-flash 而不是 gemini-pro
   model: 'gemini-flash'
   ```

3. **检查网络连接**
   - 确保网络稳定
   - 尝试使用 VPN

---

## 广告系统问题

### Q: "无法连接到广告平台"

**问题描述:**
```
Error: Failed to create campaign on Google Ads
或
Authentication failed
```

**解决方案:**

1. **检查 API 凭证**
   ```bash
   # 确认环境变量已设置
   echo $GOOGLE_ADS_ACCESS_TOKEN
   ```

2. **验证 API 权限**
   - 确认 API 访问已启用
   - 检查账户权限
   - 确认没有欠费

3. **检查 API 限制**
   - 确认没有超出 API 调用限制
   - 查看广告平台的状态页面

4. **更新访问令牌**
   某些平台的访问令牌会过期，需要重新生成。

---

### Q: "广告创建成功但不显示"

**问题描述:**
广告状态显示"已创建"，但在广告平台上看不到。

**解决方案:**

1. **检查审核状态**
   ```
   状态可能是:
   - ⏳ 审核中 (2-24小时)
   - ❌ 审核未通过
   - ⏸️ 已暂停
   ```

2. **检查预算和出价**
   - 确认预算足够
   - 出价不能太低

3. **检查投放时间**
   - 确认在投放时段内
   - 检查开始日期

4. **查看平台通知**
   登录广告平台查看是否有错误或警告消息。

---

### Q: "AI 文案生成结果都很相似"

**问题描述:**
生成的多个标题/描述变体过于相似，缺乏多样性。

**解决方案:**

1. **提供更多上下文**
   ```typescript
   {
     productName: "连衣裙",
     productDescription: "详细描述...",
     sellingPoints: ["透气", "时尚", "限时优惠"],
     tone: "friendly", // 尝试不同语气
     targetAudience: "25-45岁都市女性" // 更具体的受众
   }
   ```

2. **指定多样性**
   在提示中明确要求：
   "生成 10 个风格完全不同的标题，包括：问句、陈述句、感叹句等"

3. **使用不同角度**
   要求从不同角度生成：
   - 功能导向
   - 情感导向
   - 优惠导向
   - 紧迫感导向

---

### Q: "广告数据不更新"

**问题描述:**
仪表板显示的数据是旧的。

**解决方案:**

1. **手动刷新**
   ```typescript
   // 点击刷新按钮，或
   await adsService.refreshMetrics();
   ```

2. **检查 API 限制**
   广告平台可能有 API 调用频率限制，数据不是实时的。

3. **等待数据同步**
   某些平台的数据有 2-4 小时的延迟。

4. **清除缓存**
   ```bash
   # 清除浏览器缓存
   # 或重启应用
   ```

---

### Q: "自动优化暂停了有效广告"

**问题描述:**
AI 自动优化错误地暂停了实际表现良好的广告。

**解决方案:**

1. **调整优化阈值**
   ```typescript
   // 在设置中调整
   optimization: {
     pauseThreshold: {
       cpa: 200, // 提高 CPA 阈值
       minDays: 7 // 增加最小运行天数
     }
   }
   ```

2. **手动恢复广告**
   - 找到被暂停的广告
   - 点击"恢复"按钮
   - 标记为"不优化"

3. **禁用自动优化**
   对特定广告禁用自动优化：
   ```typescript
   campaign.autoOptimize = false;
   ```

---

## 部署问题

### Q: "Vercel 部署失败"

**问题描述:**
```
Error: Deployment failed with exit code 1
```

**解决方案:**

1. **检查构建日志**
   查看详细的错误信息：
   ```bash
   npm run build
   ```

2. **常见构建错误**
   
   **TypeScript 错误:**
   ```bash
   # 检查类型错误
   npx tsc --noEmit
   
   # 修复或临时禁用严格模式
   # tsconfig.json
   {
     "strict": false
   }
   ```

   **环境变量缺失:**
   在 Vercel 项目设置中添加环境变量。

   **依赖问题:**
   ```bash
   # 清除缓存重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **检查 Vercel 配置**
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

---

### Q: "部署后环境变量不生效"

**问题描述:**
本地运行正常，部署后 API 调用失败。

**解决方案:**

1. **在 Vercel 添加环境变量**
   - 访问 Vercel 项目设置
   - 进入 "Environment Variables"
   - 添加所有必需的环境变量

2. **检查变量名前缀**
   ```
   Vite 项目需要 VITE_ 前缀:
   VITE_GEMINI_API_KEY=xxx
   ```

3. **重新部署**
   添加环境变量后需要重新部署：
   ```bash
   vercel --prod
   ```

---

## 性能问题

### Q: "应用加载很慢"

**问题描述:**
首次加载应用需要很长时间。

**解决方案:**

1. **代码分割**
   ```typescript
   // 使用懒加载
   const AdsDashboard = lazy(() => import('./components/ads/AdsDashboard'));
   ```

2. **优化依赖**
   ```bash
   # 分析包大小
   npm run build
   npx vite-bundle-visualizer
   ```

3. **启用缓存**
   ```typescript
   // vite.config.ts
   export default {
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'react-vendor': ['react', 'react-dom'],
             'editor': ['@monaco-editor/react']
           }
         }
       }
     }
   }
   ```

---

### Q: "Monaco Editor 加载慢"

**问题描述:**
代码编辑器加载需要很长时间。

**解决方案:**

1. **使用 CDN**
   ```typescript
   <MonacoEditor
     options={{
       automaticLayout: true
     }}
     loading={<div>加载中...</div>}
   />
   ```

2. **懒加载编辑器**
   只在需要时加载编辑器组件。

3. **减少语言支持**
   只加载需要的编程语言。

---

## API 和集成问题

### Q: "API 调用频率限制"

**问题描述:**
```
Error: Rate limit exceeded: 429 Too Many Requests
```

**解决方案:**

1. **实现请求节流**
   ```typescript
   // 使用节流函数
   const throttledRequest = throttle(apiCall, 1000); // 每秒最多一次
   ```

2. **使用请求队列**
   ```typescript
   class RequestQueue {
     private queue: Array<() => Promise<any>> = [];
     private processing = false;
     
     async add<T>(request: () => Promise<T>): Promise<T> {
       return new Promise((resolve, reject) => {
         this.queue.push(async () => {
           try {
             const result = await request();
             resolve(result);
           } catch (error) {
             reject(error);
           }
         });
         this.process();
       });
     }
     
     private async process() {
       if (this.processing || this.queue.length === 0) return;
       
       this.processing = true;
       while (this.queue.length > 0) {
         const request = this.queue.shift()!;
         await request();
         await new Promise(resolve => setTimeout(resolve, 1000)); // 延迟1秒
       }
       this.processing = false;
     }
   }
   ```

3. **增加 API 配额**
   联系平台提高 API 调用限制。

---

### Q: "CORS 错误"

**问题描述:**
```
Access to fetch at 'https://api.example.com' has been blocked by CORS policy
```

**解决方案:**

1. **使用代理**
   ```typescript
   // vite.config.ts
   export default {
     server: {
       proxy: {
         '/api': {
           target: 'https://api.example.com',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api/, '')
         }
       }
     }
   }
   ```

2. **后端配置 CORS**
   如果你控制后端，添加 CORS 头：
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   ```

3. **使用服务器端请求**
   在后端调用 API，而不是在前端。

---

## 其他问题

### Q: "如何备份广告数据？"

**解决方案:**

1. **导出所有数据**
   ```typescript
   import { analyticsService } from './services/ads/analyticsService';
   
   // 导出为 JSON
   const data = await analyticsService.exportData(campaigns, 'json');
   
   // 保存到文件
   const blob = new Blob([data], { type: 'application/json' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'ad-data-backup.json';
   a.click();
   ```

2. **定期自动备份**
   设置定时任务每天备份数据。

---

### Q: "如何迁移到生产环境？"

**解决方案:**

1. **准备生产环境变量**
   ```env
   NODE_ENV=production
   GEMINI_API_KEY=prod_key_here
   # ... 其他生产环境配置
   ```

2. **构建生产版本**
   ```bash
   npm run build
   ```

3. **测试构建结果**
   ```bash
   npm run preview
   ```

4. **部署**
   ```bash
   # Vercel
   vercel --prod
   
   # 或上传 dist/ 到你的服务器
   ```

5. **监控**
   - 设置错误监控（如 Sentry）
   - 配置性能监控
   - 定期检查日志

---

### Q: "如何获取技术支持？"

**解决方案:**

1. **查看文档**
   - [安装指南](INSTALLATION.md)
   - [API 参考](API_REFERENCE.md)
   - [广告系统指南](ADVERTISING_GUIDE.md)

2. **搜索现有 Issue**
   访问 [GitHub Issues](https://github.com/v3ai2026/vision-/issues)

3. **创建新 Issue**
   如果找不到答案，创建新 Issue 并提供：
   - 详细的问题描述
   - 复现步骤
   - 错误日志
   - 环境信息（Node.js 版本、操作系统等）
   - 截图（如果有界面问题）

4. **提供有用信息**
   ```bash
   # 收集系统信息
   node --version
   npm --version
   
   # 收集错误日志
   npm run dev 2>&1 | tee debug.log
   ```

---

### Q: "如何贡献代码？"

**解决方案:**

1. **Fork 仓库**
   在 GitHub 上 Fork 项目

2. **创建分支**
   ```bash
   git checkout -b feature/my-new-feature
   ```

3. **提交代码**
   ```bash
   git add .
   git commit -m "Add: 新功能描述"
   git push origin feature/my-new-feature
   ```

4. **创建 Pull Request**
   在 GitHub 上创建 PR，详细描述你的改动

5. **代码规范**
   - 遵循项目的代码风格
   - 添加必要的注释
   - 包含测试（如果适用）
   - 更新文档

---

## 错误代码参考

### Gemini API 错误

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 400 | 请求格式错误 | 检查请求参数 |
| 401 | API Key 无效 | 验证 API Key |
| 403 | 权限不足 | 检查 API 权限 |
| 429 | 请求过多 | 降低请求频率 |
| 500 | 服务器错误 | 稍后重试 |

### 广告平台错误

| 平台 | 错误类型 | 解决方案 |
|------|----------|----------|
| Google Ads | AUTHENTICATION_ERROR | 更新访问令牌 |
| Facebook | (#100) Invalid parameter | 检查参数格式 |
| TikTok | 40001: Invalid access token | 重新授权 |

---

## 诊断工具

### 系统健康检查

创建一个健康检查脚本：

```typescript
async function healthCheck() {
  console.log('🔍 系统健康检查...\n');
  
  // 检查 Gemini API
  try {
    await geminiService.chat('test');
    console.log('✅ Gemini API: 正常');
  } catch (error) {
    console.log('❌ Gemini API: 失败', error.message);
  }
  
  // 检查广告平台
  for (const platform of ['google_ads', 'facebook_ads', 'tiktok_ads']) {
    try {
      await adsService.testConnection(platform);
      console.log(`✅ ${platform}: 正常`);
    } catch (error) {
      console.log(`❌ ${platform}: 失败`, error.message);
    }
  }
  
  // 检查部署服务
  try {
    await vercelService.getProjects();
    console.log('✅ Vercel: 正常');
  } catch (error) {
    console.log('❌ Vercel: 失败', error.message);
  }
}

healthCheck();
```

---

## 调试技巧

### 1. 启用详细日志

```typescript
// 在 .env.local 中
DEBUG=*
LOG_LEVEL=debug
```

### 2. 使用浏览器开发者工具

- `F12` 打开开发者工具
- 查看 Console 标签页的错误
- 查看 Network 标签页的网络请求
- 使用 React DevTools 检查组件状态

### 3. 添加断点

```typescript
debugger; // 代码会在这里暂停
```

### 4. 使用 VS Code 调试

在 `.vscode/launch.json` 中配置：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

---

## 性能优化建议

1. **代码分割** - 使用动态导入
2. **图片优化** - 使用 WebP 格式，添加懒加载
3. **缓存策略** - 合理使用浏览器缓存
4. **CDN 加速** - 静态资源使用 CDN
5. **服务器端渲染** - 考虑 SSR 提升首屏速度

---

## 安全建议

1. **不要提交 .env.local** - 添加到 .gitignore
2. **使用环境变量** - 不要在代码中硬编码密钥
3. **定期更新依赖** - `npm audit fix`
4. **启用 HTTPS** - 生产环境必须使用 HTTPS
5. **实施访问控制** - 保护敏感功能

---

## 还有问题？

如果本文档没有解决你的问题：

1. 📖 查看 [GitHub Wiki](https://github.com/v3ai2026/vision-/wiki)
2. 💬 加入社区讨论
3. 📧 联系技术支持
4. 🐛 报告 Bug: [创建 Issue](https://github.com/v3ai2026/vision-/issues/new)

---

**希望这些解决方案能帮到你！祝使用愉快！** 🎉
