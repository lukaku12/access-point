import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { presetIcons } from '@unocss/preset-icons'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

export default defineConfig({
  plugins: [
    commonjs({
      requireReturnsDefault: 'auto',
      transformMixedEsModules: true
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
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
    minify: false, // Disable minification for compatibility
    sourcemap: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url))
      },
      output: {
        format: 'iife', // Changed to immediately invoked function
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
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