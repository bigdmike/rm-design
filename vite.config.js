import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const githubPagesBase = repositoryName ? `/${repositoryName}/` : '/'
const supportedBrowsers = ['chrome111', 'edge111', 'firefox128', 'safari16.4', 'ios16.4']

export default defineConfig({
  base: process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS ? githubPagesBase : '/'),
  plugins: [
    vue(),
    tailwindcss()
  ],
  build: {
    target: supportedBrowsers,
    cssTarget: supportedBrowsers,
  },
})
