import { rmSync } from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron, { onstart } from 'vite-plugin-electron'
import pkg from './package.json'

rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true }) // v14.14.0

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      'styles': path.join(__dirname, 'src/assets/styles'),
    },
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main/index.ts',
        vite: {
          build: {
            // For debug
            sourcemap: true,
            outDir: 'dist/electron/main',
          },
          plugins: [process.env.VSCODE_DEBUG ? onstart() : null],
        },
      },
      preload: {
        input: {
          // You can configure multiple preload scripts here
          index: path.join(__dirname, 'electron/preload/index.ts'),
        },
        vite: {
          build: {
            // For debug
            sourcemap: 'inline',
            outDir: 'dist/electron/preload',
          }
        },
      },
      // Enables use of Node.js API in the Electron-Renderer
      // https://github.com/electron-vite/vite-plugin-electron/tree/main/packages/electron-renderer#electron-renderervite-serve
      renderer: {},
    }),
  ],
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT,
  },
  build: {
    minify: false
  }
})
