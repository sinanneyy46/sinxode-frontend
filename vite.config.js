import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
        '/gh-api': {
          target: 'https://api.github.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gh-api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const token = env.VITE_GITHUB_TOKEN || env.GITHUB_TOKEN
              if (token) {
                proxyReq.setHeader('Authorization', `Bearer ${token}`)
              }
              proxyReq.setHeader('Accept', 'application/vnd.github+json')
              proxyReq.setHeader('User-Agent', 'Sinxode-Portfolio')
            })
          },
        },
      },
    },
  }
})
