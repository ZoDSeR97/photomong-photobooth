import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';
import purgecss from 'vite-plugin-purgecss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Visualization plugin to analyze bundle size
    visualizer({
      filename: './bundle-visualizer.html', // Output file for visualization
      open: true, // Open the visualizer in the browser automatically after build
      gzipSize: true, // Calculate gzip size
      brotliSize: true, // Calculate brotli size
    }),
    // Enable gzip compression
    viteCompression({
      algorithm: ['gzip', 'brotliCompress'],
      ext: ['.js', '.css', '.html', '.svg'],
      threshold: 1024 // Only compress files larger than 1kb
    }),
    // Image optimization plugin
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: true },
          { name: 'removeUnknownsAndDefaults', active: true }
        ]
      }
    }),
    purgecss({
      content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
        './src/**/*.{css,scss}' // Ensure CSS files are also scanned
      ],
      safelist: {
        standard: [
          /^((?!hidden).)*$/, // Preserve existing safelist pattern
          'active',           // Common utility classes
          'disabled',
          'hover:*',          // Tailwind hover states
          'focus:*',          // Tailwind focus states
          'group-*',          // Group hover/focus states
          /^(dark|light):*/   // Theme-related classes
        ],
        deep: [
          /^(dark|light)/, // Preserve entire classes starting with dark/light
          /^(enter|leave)-/  // Animation classes
        ],
        greedy: [
          /^(transition|duration|ease)-/ // Preserve animation and transition classes
        ]
      },
      blocklist: [
        'body',
        'html',
        'main'  // Prevent removing base element styles
      ],
      extractors: [
        {
          extractor: (content) => {
            // Custom extractor to catch more class names
            return content.match(/[\w-/:]+(?<!:)/g) || [];
          },
          extensions: ['html', 'js', 'jsx', 'ts', 'tsx']
        }
      ],
    }),
  ],

  // Optimization settings
  optimizeDeps: {
    include: ['react', 'react-dom'], // Pre-bundle specific dependencies
    exclude: ['js-big-decimal'],     // Exclude any unnecessary or problematic dependencies
  },

  // Build settings
  build: {
    target: 'esnext',               // Target the latest JavaScript syntax for modern browsers
    minify: 'esbuild',              // Use esbuild for faster minification
    sourcemap: false,               // Disable sourcemaps in production for better performance
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          if (id.includes('src/components')) {
            return 'components'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js'
      }
    },
    chunkSizeWarningLimit: 500 // in kB
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