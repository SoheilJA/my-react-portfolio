import {defineConfig} from "vite";
import vue from '@vitejs/plugin-vue'
import tailwindcss from "@tailwindcss/vite";

const target = 'https://soheil-portfolio.soheil-ja.ir.workers.dev'
export default defineConfig({
    plugins: [vue(), tailwindcss()],
    server: {
        proxy: {
            '/api': {target, changeOrigin: true},
            '/img': {target, changeOrigin: true},
        },
    },
    build: {
        chunkSizeWarningLimit: 700,
    },
})