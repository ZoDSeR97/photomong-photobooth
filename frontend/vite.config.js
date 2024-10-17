import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';
import purgecss from '@fullhuman/postcss-purgecss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Visualization plugin to analyze bundle size
    visualizer({
      filename: './bundle-visualizer.html', // Output file for visualization
      open: true, // Open the visualizer in the browser automatically after build
    }),
    // Enable gzip compression
    viteCompression({
      algorithm: 'gzip',
    }),
    // Image optimization plugin
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
      },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs' },
        ],
      },
    }),
  ],

  // Optimization settings
  optimizeDeps: {
    include: ['react', 'react-dom'], // Pre-bundle specific dependencies
    exclude: [],     // Exclude any unnecessary or problematic dependencies
  },

  // Build settings
  build: {
    target: 'esnext',               // Target the latest JavaScript syntax for modern browsers
    minify: 'esbuild',              // Use esbuild for faster minification
    sourcemap: false,               // Disable sourcemaps in production for better performance
    rollupOptions: {
      plugins: [],
    },
  },

  // CSS Optimization with PurgeCSS
  css: {
    postcss: {
      plugins: [
        purgecss({
          content: ['./index.html', './src/**/*.jsx'], // Paths to files for scanning unused CSS
          defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        }),
      ],
    },
  },
  
  server: {
    proxy: {
      '/api': {
        target: 'http://172.30.174.2:5000',
        changeOrigin: true,
      }
    }
  }
})