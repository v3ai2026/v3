# 3D/AR Virtual Store System

## 概述

这是一个集成在 IntelliBuild Studio 中的高级 3D/AR 虚拟商店系统，提供虚拟试衣、AR 试戴、3D 商品展示等功能。

## 功能特性

### 1. 3D 产品查看器 📦
- **360° 旋转查看**：完整的产品旋转视图
- **缩放和拖拽**：自由控制查看距离和角度
- **自动旋转模式**：自动展示产品各个角度
- **环境切换**：支持 Studio、City、Sunset、Warehouse 等多种环境
- **材质和颜色切换**：实时切换产品变体
- **截图功能**：捕获并分享产品图片

### 2. AR 试戴系统 👓
- **实时面部追踪**：使用 MediaPipe Face Mesh 技术
- **眼镜虚拟试戴**：精准叠加 3D 模型到面部
- **实时预览**：流畅的 AR 体验
- **拍照和分享**：捕获试戴效果并分享

### 3. 虚拟商店漫游 🏪
- **3D 场景漫游**：第一人称/自由视角浏览虚拟商店
- **产品互动展示**：点击产品查看详情
- **动态展示台**：产品悬浮和光效展示
- **沉浸式购物体验**：完整的虚拟店铺环境

### 4. AI 身材分析 🤖
- **身体测量**：基于输入数据分析体型
- **尺码推荐**：智能推荐最合适的服装尺码
- **三围估算**：提供胸围、腰围、臀围参考
- **信心度评分**：显示分析结果的可信度

### 5. 社交分享 📱
- **滤镜效果**：Vintage、Vivid、Noir 等多种滤镜
- **多平台分享**：支持 WeChat、Weibo、TikTok
- **一键下载**：保存 AR 试戴照片到本地

## 技术栈

### 核心技术
- **React Three Fiber**：React 的 Three.js 集成
- **@react-three/drei**：Three.js 辅助工具
- **Three.js**：3D 图形渲染引擎
- **MediaPipe**：AI 驱动的面部追踪
- **TensorFlow.js**：机器学习推理

### 物理引擎
- **Cannon.js**：物理模拟（未来用于布料模拟）

## 组件结构

```
components/
├── 3d/
│   ├── Product3DViewer.tsx      # 3D 产品查看器
│   └── VirtualStoreScene.tsx    # 虚拟商店场景
├── ar/
│   ├── ARCamera.tsx             # AR 相机组件
│   └── ARGlassesTryOn.tsx       # 眼镜试戴组件
├── ai/
│   └── BodyAnalyzer.tsx         # AI 身材分析
└── social/
    └── PhotoCapture.tsx         # 照片捕获和分享

hooks/
└── useMediaPipeFace.ts          # MediaPipe 面部追踪 Hook
```

## 使用指南

### 1. 访问 AR Try-On
点击侧边栏的 👓 图标进入 AR 试戴模式：
- 允许摄像头权限
- 等待面部识别系统初始化
- 选择不同的眼镜产品进行试戴
- 点击拍照按钮捕获图片
- 应用滤镜和分享到社交媒体

### 2. 使用 3D Product Viewer
点击侧边栏的 📦 图标查看 3D 产品：
- 拖拽旋转产品
- 滚轮缩放
- 切换不同的颜色和材质
- 选择不同的环境光照
- 截图保存产品图片

### 3. 虚拟商店漫游
点击侧边栏的 🏪 图标进入虚拟商店：
- 拖拽旋转视角
- 滚轮缩放距离
- 点击产品查看详情
- 添加产品到购物车

### 4. AI 身材分析
在 AR Try-On 页面右侧：
- 输入身高和体重
- 点击"Analyze Body Type"
- 查看推荐的尺码和体型分析

## 性能优化建议

1. **模型优化**
   - 使用 GLB 格式（压缩的 GLTF）
   - 降低多边形数量
   - 使用纹理压缩

2. **LOD (Level of Detail)**
   - 根据距离显示不同精度的模型
   - 减少渲染负担

3. **懒加载**
   - 按需加载 3D 模型
   - 使用 Suspense 处理加载状态

4. **移动端优化**
   - 降低渲染分辨率
   - 减少光源数量
   - 简化材质

## 浏览器兼容性

- ✅ Chrome 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Edge 90+

### WebXR 支持
- Chrome Android (AR)
- Safari iOS (AR Quick Look)

## 未来路线图

### 即将推出
- [ ] 帽子和手表 AR 试戴
- [ ] 全身衣服试穿（MediaPipe Pose）
- [ ] AR 家具摆放
- [ ] VR 模式支持
- [ ] 实时直播集成
- [ ] 更多 AI 功能（风格推荐、虚拟导购）

### 实验性功能
- [ ] 布料物理模拟
- [ ] 妆容试色
- [ ] WebXR 平面检测
- [ ] 多人虚拟购物

## 安全和隐私

- **本地处理**：所有面部数据在本地处理，不上传服务器
- **相机权限**：用户完全控制摄像头权限
- **数据加密**：敏感数据加密存储
- **可关闭功能**：用户可随时关闭 AR 功能

## 故障排除

### 摄像头无法启动
1. 检查浏览器权限设置
2. 确保使用 HTTPS 连接
3. 重新加载页面

### 面部追踪不稳定
1. 确保充足的光照
2. 保持面部在摄像头视野内
3. 减少背景干扰

### 3D 模型加载失败
1. 检查模型文件路径
2. 确保模型格式正确（GLB/GLTF）
3. 检查网络连接

### 性能问题
1. 关闭其他标签页
2. 降低浏览器缩放比例
3. 使用性能模式（简化渲染）

## 开发者指南

### 添加新的 3D 产品

```typescript
const newProduct: Product3D = {
  id: 'product-new',
  name: 'New Product',
  description: 'Product description',
  modelUrl: '/models/new-product.glb',
  modelFormat: 'GLB',
  category: 'electronics',
  price: 299,
  variants: [
    {
      id: 'v1',
      name: 'Color 1',
      type: 'color',
      value: 'Red',
      hexColor: '#FF0000'
    }
  ]
};
```

### 添加新的 AR 产品

```typescript
const newARProduct: ARProduct = {
  ...newProduct,
  arEnabled: true,
  arType: 'face', // 'face' | 'body' | 'hand' | 'ground'
  scale: [1, 1, 1],
  offset: [0, 0, 0]
};
```

### 自定义虚拟商店

```typescript
const customStore: VirtualStore = {
  id: 'store-custom',
  name: 'My Custom Store',
  theme: 'luxury',
  sceneUrl: '/scenes/custom-store.glb',
  products: [...],
  layout: {
    shelves: [],
    displays: [],
    lighting: {
      ambient: { intensity: 0.5, color: '#ffffff' },
      directional: [
        { intensity: 1, color: '#ffffff', position: [10, 10, 5] }
      ],
      environment: 'studio'
    }
  }
};
```

## 贡献

欢迎贡献代码、报告问题或提出新功能建议！

## 许可证

本项目遵循 MIT 许可证。

## 联系方式

- GitHub: [VisionCommerce](https://github.com/visioncommerce/visioncommerce)
- Issues: [报告问题](https://github.com/visioncommerce/visioncommerce/issues)

---

**注意**：这是一个演示系统，部分功能需要实际的 3D 模型文件才能完全运行。请准备好 GLB/GLTF 格式的 3D 模型文件。
