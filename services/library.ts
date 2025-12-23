
import { LibraryItem } from "../types";

export const TEMPLATE_LIBRARY: LibraryItem[] = [
  {
    id: 'tpl-saas-ixartz',
    name: 'Next.js SaaS Boilerplate',
    description: 'Inspired by ixartz/SaaS-Boilerplate. Features Tailwind CSS, TypeScript, and ESLint with strict production rules.',
    type: 'template',
    previewColor: 'from-blue-600 to-indigo-900',
  },
  {
    id: 'tpl-saas-async',
    name: 'Async Labs SaaS',
    description: 'React + Express architecture. Includes WebSocket support and production-ready MongoDB integrations.',
    type: 'template',
    previewColor: 'from-emerald-600 to-teal-900',
  },
  {
    id: 'tpl-saas-python',
    name: 'Pythonic SaaS Shard',
    description: 'Flask + PostgreSQL + React. Ideal for teams requiring a Python backend protocol.',
    type: 'template',
    previewColor: 'from-gold-600 to-yellow-900',
  },
  {
    id: 'tpl-bento-luxury',
    name: 'Bento Grid Dashboard',
    description: 'Ultra-modern grid layout with glassmorphism and gold accents for high-end SaaS interfaces.',
    type: 'template',
    previewColor: 'from-gray-900 to-black',
  }
];

export const COMPONENT_LIBRARY: LibraryItem[] = [
  {
    id: 'cmp-neural-modal',
    name: 'Neural Modal Shard',
    description: 'WCAG 2.1 compliant dialogue with focus trapping and cinematic transitions.',
    type: 'component',
    previewColor: 'from-indigo-600 to-purple-700',
    codeSnippet: `props: { title: string, isOpen: boolean, onClose: () => void }`
  },
  {
    id: 'api-browser-orchestrator',
    name: 'Browser Logic Agent',
    description: 'Playwright/Selenium-ready abstraction for intelligent web automation and data extraction.',
    type: 'api',
    previewColor: 'from-red-600 to-orange-700',
  },
  {
    id: 'cmp-data-viz',
    name: 'Enterprise Analytics Shard',
    description: 'Responsive charting components with dynamic data binding and luxury styling.',
    type: 'component',
    previewColor: 'from-gold-400 to-yellow-600',
  }
];
