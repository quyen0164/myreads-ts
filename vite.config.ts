import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // KEYWORD: proxy (Proxy Server)
      // LOGIC: Trình duyệt chặn request từ cổng 5173 sang cổng 3001 vì lý do bảo mật (CORS).
      // Vite sẽ đóng vai trò "người vận chuyển". Khi bạn gọi fetch('/api/books'), 
      // Vite sẽ tự động giấu đi và gửi ngầm request này tới http://localhost:3001/api/books.
      // Nhờ vậy, trình duyệt tưởng bạn đang gọi cùng cổng 5173, nên không bị chặn.
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true, 
        // changeOrigin: true -> Tự động đổi header 'Host' của request thành localhost:3001.
      },
    },
  },
})