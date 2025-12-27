import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // React and React DOM
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                return 'react-vendor';
              }
              // Three.js ecosystem
              if (id.includes('node_modules/three') || 
                  id.includes('node_modules/@react-three')) {
                return 'three-vendor';
              }
              // Monaco Editor
              if (id.includes('node_modules/@monaco-editor') || 
                  id.includes('node_modules/monaco-editor')) {
                return 'editor';
              }
              // Radix UI and Framer Motion
              if (id.includes('node_modules/@radix-ui') || 
                  id.includes('node_modules/framer-motion')) {
                return 'ui-vendor';
              }
              // Ads system (local modules)
              if (id.includes('/services/ads/')) {
                return 'ads';
              }
              // Default: undefined means it goes to the main chunk
            }
          }
        },
        chunkSizeWarningLimit: 600,
      }
    };
});
