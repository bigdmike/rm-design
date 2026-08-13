import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const githubPagesBase = repositoryName ? `/${repositoryName}/` : '/'

export default defineConfig({
  base: process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS ? githubPagesBase : '/'),
  plugins: [
    vue(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    host: "0.0.0.0", // 允許從外部訪問
    // proxy: {
    //   "/admin-api": {
    //     target: "https://api.shark-factory.com.tw",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/admin-api/, ""),
    //   },
    // },
  },
})
