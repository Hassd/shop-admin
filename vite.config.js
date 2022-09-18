import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import WindiCSS from 'vite-plugin-windicss'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    WindiCSS(),
    vue()
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src")
    }
  },
  server: {
    // host设置为true才可以使用network的形式，以ip访问项目
    host: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
    // 跨域设置允许
    cors: true,
    // 如果端口已占用直接退出
    strictPort: true,
    // 接口代理
    proxy: {
      '/api': {
        target: 'http://ceshi13.dishait.cn/',
        // 允许跨域
        changeOrigin: true,
        // 重写地址
        rewrite: (path) => path.replace('/api/', '/')
      }
    }

  },
  build: {
    // 在生产环境移除console.log
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
    },
  }
})
