import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      nodePolyfills({
        include: ['buffer']
      })
    ],
    define: {
      'global': {},
      'process.env': Object.fromEntries(
        Object.entries(env).filter(([key]) => 
          key.startsWith('REACT_APP_') || key.startsWith('VITE_')
        )
      )
    },
    resolve: {
      alias: {
        '@': '/src',
        'buffer': 'buffer/',
        'process': 'process/browser'
      },
    },
  };
});
