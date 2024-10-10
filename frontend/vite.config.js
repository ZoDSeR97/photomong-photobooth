import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/get_photo/': {
        target: 'http://3.26.21.10:8000',
        changeOrigin: true,
      }
    }
  }
})