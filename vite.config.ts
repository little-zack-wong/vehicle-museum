import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base 设为相对路径，兼容 GitHub Pages 子路径部署（/vehicle-museum/）
export default defineConfig({
  plugins: [react()],
  base: './',
})
