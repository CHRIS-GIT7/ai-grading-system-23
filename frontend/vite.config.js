// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0', // Important for Docker
    proxy: {
      '/api': {
        target: 'http://backend:4000', // Use the internal Docker service name
        changeOrigin: true,
        secure: false,
      },
    },
  },
});