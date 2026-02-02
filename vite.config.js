import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer (run with ANALYZE=true npm run build)
    process.env.ANALYZE && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean),
  
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for debugging
    sourcemap: false, // Set to true for debugging production issues
    
    // Customize chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          // React and related libraries
          'react-vendor': ['react', 'react-dom'],
          
          // Animation libraries
          'animation-vendor': ['framer-motion', 'gsap'],
          
          // UI libraries
          'ui-vendor': ['lucide-react'],
        },
        
        // Asset file naming for better caching
        assetFileNames: (assetInfo) => {
          // Images get their own folder with hash for cache busting
          if (/\.(webp|png|jpg|jpeg|gif|svg)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          
          // Fonts get their own folder
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          
          // CSS gets its own folder
          if (/\.css$/i.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          
          // Everything else
          return 'assets/[name]-[hash][extname]'
        },
        
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'gsap',
      'lucide-react',
      '@supabase/supabase-js'
    ],
  },
  
  // Server configuration for development
  server: {
    port: 5173,
    host: true, // Listen on all addresses
    
    // Configure headers for better caching during development
    headers: {
      'Cache-Control': 'public, max-age=0',
    },
  },
  
  // Preview server configuration (for npm run preview)
  preview: {
    port: 4173,
    host: true,
  },
  
  // Ensure images are treated as static assets
  assetsInclude: ['**/*.webp', '**/*.png', '**/*.jpg', '**/*.jpeg'],
})