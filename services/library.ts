
import { LibraryItem } from "../types";

export const TEMPLATE_LIBRARY: LibraryItem[] = [
  {
    id: 'tpl-vercel-dashboard',
    name: 'Vercel 风格控制台',
    description: '一个极致纯净、高性能的后台管理界面，灵感来自 Vercel 官方矩阵。',
    type: 'template',
    previewColor: 'from-slate-900 to-black',
  },
  {
    id: 'tpl-bento',
    name: 'Bento 栅格展示',
    description: '现代多列网格布局，适合展示产品特性或统计数据，带有磨砂玻璃卡片效果。',
    type: 'template',
    previewColor: 'from-blue-500 to-indigo-600',
  }
];

export const COMPONENT_LIBRARY: LibraryItem[] = [
  {
    id: 'cmp-neural-modal',
    name: '神经态无障碍模态框',
    description: '符合 WAI-ARIA 规范的 React 模态框，内置键盘捕获与焦点管理，集成 TDD 基因。',
    type: 'component',
    previewColor: 'from-indigo-600 to-purple-700',
    codeSnippet: `props: { title: string, content: ReactNode, isOpen: boolean, onClose: () => void }`
  },
  {
    id: 'api-github-integration',
    name: 'GitHub 自动化专家',
    description: '后端集成模块，支持通过 REST API 创建仓库、初始化内容及自动化推送流程。',
    type: 'api',
    previewColor: 'from-slate-800 to-black',
  },
  {
    id: 'cmp-universal-btn',
    name: '全能动作按钮',
    description: '强大的 React 按钮，支持多种变体（主要、次要、危险）及点击交互，完美适配键盘操作。',
    type: 'component',
    previewColor: 'from-blue-400 to-indigo-500',
  }
];
