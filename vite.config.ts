import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { presetIcons } from '@unocss/preset-icons'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  plugins: [
    commonjs(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: () => false
        }
      }
    }),
    UnoCSS({
      presets: [
        presetIcons({
          scale: 1.2,
          warn: true,
        }),
      ],
    }),
  ],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url))
      },
      output: {
        format: 'es',
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        manualChunks: {
          'vendor': ['vue', 'vue-router']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router'],
    esbuildOptions: {
      target: 'es2015'
    }
  }
})