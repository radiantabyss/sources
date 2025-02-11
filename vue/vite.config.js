import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: 'ra-front',
        port: 8080,
    },
    plugins: [
        vue(),
    ],
    optimizeDeps: {
        include: ['dropzone', 'smooth-dnd', 'vue3-smooth-dnd'],
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./app', import.meta.url)),
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    }
})
