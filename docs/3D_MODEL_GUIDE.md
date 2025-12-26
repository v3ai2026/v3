# 3D 模型集成示例

## 模型文件准备

### 推荐格式
1. **GLB (推荐)** - 压缩的二进制 GLTF 格式
   - 单文件，包含所有纹理和材质
   - 文件大小最小
   - 加载速度快

2. **GLTF** - JSON 格式的 3D 模型
   - 可读性好
   - 适合调试
   - 通常需要额外的纹理文件

### 模型优化建议
```
✓ 多边形数量: < 50k triangles
✓ 纹理大小: 512x512 或 1024x1024
✓ 材质数量: < 5
✓ 使用 Draco 压缩
```

## 获取 3D 模型

### 免费资源
1. **Sketchfab** - https://sketchfab.com/
   - 大量免费 3D 模型
   - 支持 GLB 下载
   - 商业使用需检查许可证

2. **Google Poly** (Archive) - https://poly.pizza/
   - Google Poly 的社区存档
   - 免费 CC 许可证

3. **Three.js Examples** - https://github.com/mrdoob/three.js/tree/dev/examples/models
   - 测试用示例模型

### 商业资源
- **TurboSquid** - https://www.turbosquid.com/
- **CGTrader** - https://www.cgtrader.com/
- **Sketchfab Store** - https://sketchfab.com/store

## 使用示例

### 1. 添加 3D 产品到查看器

```typescript
// 在 App.tsx 中添加产品
const myProduct: Product3D = {
  id: 'my-product-1',
  name: '智能手表 Ultra',
  description: '最新款智能手表，支持健康监测',
  modelUrl: '/models/smartwatch.glb',  // 放在 public/models/ 目录
  modelFormat: 'GLB',
  category: 'electronics',
  price: 599,
  variants: [
    {
      id: 'color-black',
      name: '午夜黑',
      type: 'color',
      value: 'Black',
      hexColor: '#000000',
      // 可选：不同颜色使用不同模型
      modelUrl: '/models/smartwatch-black.glb'
    },
    {
      id: 'color-silver',
      name: '星光银',
      type: 'color',
      value: 'Silver',
      hexColor: '#C0C0C0',
      modelUrl: '/models/smartwatch-silver.glb'
    }
  ]
};

// 添加到产品列表
const [demo3DProducts] = useState<Product3D[]>([
  myProduct,
  // ... 其他产品
]);
```

### 2. 添加 AR 试戴产品

```typescript
// AR 眼镜产品示例
const myGlasses: ARProduct = {
  id: 'glasses-aviator',
  name: '经典飞行员眼镜',
  description: '经典设计，时尚百搭',
  modelUrl: '/models/aviator-glasses.glb',
  modelFormat: 'GLB',
  category: 'accessories',
  price: 199,
  variants: [
    {
      id: 'frame-gold',
      name: '金色镜框',
      type: 'color',
      value: 'Gold',
      hexColor: '#FFD700'
    },
    {
      id: 'frame-silver',
      name: '银色镜框',
      type: 'color',
      value: 'Silver',
      hexColor: '#C0C0C0'
    }
  ],
  // AR 特定属性
  arEnabled: true,
  arType: 'face',
  scale: [1, 1, 1],        // 缩放比例
  offset: [0, 0.02, 0.1]   // 位置偏移 [x, y, z]
};
```

### 3. 创建虚拟商店

```typescript
// 自定义虚拟商店
const myStore: VirtualStore = {
  id: 'electronics-store',
  name: '未来科技旗舰店',
  theme: 'tech',
  sceneUrl: '/scenes/tech-store.glb', // 可选：自定义场景模型
  products: [myProduct, /* ... */],
  layout: {
    shelves: [
      {
        id: 'shelf-1',
        position: [-5, 0, -10],
        rotation: [0, 0, 0],
        products: ['my-product-1', 'product-2']
      }
    ],
    displays: [
      {
        id: 'display-featured',
        position: [0, 0, -15],
        rotation: [0, 0, 0],
        type: 'featured',
        productId: 'my-product-1'
      }
    ],
    lighting: {
      ambient: { intensity: 0.6, color: '#ffffff' },
      directional: [
        { intensity: 1.2, color: '#ffffff', position: [10, 10, 5] },
        { intensity: 0.5, color: '#00DC82', position: [-10, 5, -5] }
      ],
      environment: 'studio'
    }
  }
};
```

## 文件结构

```
public/
├── models/
│   ├── smartwatch.glb
│   ├── smartwatch-black.glb
│   ├── smartwatch-silver.glb
│   ├── aviator-glasses.glb
│   ├── sofa.glb
│   └── ...
├── scenes/
│   ├── tech-store.glb
│   ├── luxury-store.glb
│   └── ...
└── textures/
    ├── wood.jpg
    ├── metal.jpg
    └── ...
```

## 模型转换工具

### 1. Blender (免费)
```bash
# 安装 Blender
# 导入模型: File > Import > (FBX/OBJ/etc)
# 导出为 GLB: File > Export > glTF 2.0 (.glb)
# 选择: GLB format, Include textures
```

### 2. gltf-pipeline (命令行)
```bash
# 安装
npm install -g gltf-pipeline

# 优化 GLTF 为 GLB
gltf-pipeline -i model.gltf -o model.glb

# 使用 Draco 压缩
gltf-pipeline -i model.gltf -o model.glb -d
```

### 3. 在线工具
- **glTF Viewer** - https://gltf-viewer.donmccurdy.com/
- **Model Viewer** - https://modelviewer.dev/editor/
- **Babylon.js Sandbox** - https://sandbox.babylonjs.com/

## 测试模型

### 使用 Three.js 编辑器测试
```bash
# 访问在线编辑器
https://threejs.org/editor/

# 或本地运行
git clone https://github.com/mrdoob/three.js.git
cd three.js/editor
npm install
npm start
```

### 快速验证清单
- [ ] 模型在编辑器中正常显示
- [ ] 纹理正确加载
- [ ] 文件大小合理 (< 5MB)
- [ ] 包含正确的材质
- [ ] 模型朝向正确 (前方 = -Z 轴)
- [ ] 缩放比例合适

## AR 调试技巧

### 眼镜位置调整
```typescript
// 如果眼镜位置不对，调整 offset
const glassesProduct: ARProduct = {
  // ...
  offset: [
    0,      // X: 左右偏移 (正数向右)
    0.02,   // Y: 上下偏移 (正数向上)
    0.1     // Z: 前后偏移 (正数向前)
  ]
};
```

### 眼镜大小调整
```typescript
// 如果眼镜太大或太小，调整 scale
const glassesProduct: ARProduct = {
  // ...
  scale: [
    0.8,    // X: 宽度
    0.8,    // Y: 高度
    0.8     // Z: 深度
  ]
};
```

## 常见问题

### Q: 模型加载失败
A: 检查文件路径、格式和 CORS 设置

### Q: 模型显示为黑色
A: 可能缺少光照或材质问题

### Q: 模型太大/太小
A: 在 3D 软件中调整，或使用 scale 属性

### Q: 纹理丢失
A: 确保使用 GLB 格式，包含所有纹理

### Q: AR 眼镜位置不对
A: 调整 offset 和 scale 值

## 性能优化

### 模型优化
```bash
# 使用 gltfpack 压缩
gltfpack -i input.glb -o output.glb

# 减少纹理大小
convert texture.png -resize 1024x1024 texture-opt.png
```

### 代码优化
```typescript
// 使用 Suspense 和懒加载
<Suspense fallback={<Loader />}>
  <Model3D url={modelUrl} />
</Suspense>

// 使用 LOD (Level of Detail)
<Lod distances={[0, 10, 20]}>
  <DetailedModel />
  <MediumModel />
  <SimpleModel />
</Lod>
```

## 进一步学习

- Three.js 文档: https://threejs.org/docs/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber/
- glTF 规范: https://www.khronos.org/gltf/
- Blender 教程: https://www.blender.org/support/tutorials/

---

**提示**: 从简单的模型开始，逐步增加复杂度。确保在添加到生产环境前充分测试！
