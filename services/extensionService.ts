
import { Extension } from "../types";

export const PLUGIN_REGISTRY: Extension[] = [
  {
    id: 'vsl-a11y-guardian',
    name: 'A11y Guardian',
    description: 'Enforces strict WCAG 2.1 compliance during the inference phase.',
    category: 'PROTOCOL',
    version: '1.0.4',
    author: 'Studio Core',
    enabled: true,
    manifest: 'Injects [aria-*] and [role] attributes into all interactive nodes.'
  },
  {
    id: 'vsl-pwa-booster',
    name: 'PWA Manifestor',
    description: 'Automatically generates manifest.json and service worker logic.',
    category: 'COMPILER',
    version: '0.9.2',
    author: 'Studio Core',
    enabled: false,
    manifest: 'Appends sw.js and web-manifest config to build output.'
  },
  {
    id: 'vsl-neural-styles',
    name: 'Neural Theme Engine',
    description: 'Applies deep-dark aesthetics and glassmorphism by default.',
    category: 'INTERFACE',
    version: '2.1.0',
    author: 'Studio Core',
    enabled: true,
    manifest: 'Pre-configures Tailwind with studio-custom design tokens.'
  },
  {
    id: 'vsl-vitest-runner',
    name: 'Vitest Automated',
    description: 'Generates robust test suites for every created component.',
    category: 'COMPILER',
    version: '1.2.1',
    author: 'Studio Core',
    enabled: true,
    manifest: 'Targets 90%+ coverage for all React logic.'
  }
];

export const getActiveInstructions = (extensions: Extension[]): string => {
  return extensions
    .filter(ext => ext.enabled)
    .map(ext => `[Plugin: ${ext.name}] ${ext.manifest}`)
    .join('\n');
};
