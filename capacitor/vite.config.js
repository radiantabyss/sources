import { defineConfig } from 'vite';
import { resolve } from 'path';

// es, not iife: an iife inlines the lazily imported route files and runs them at load, before
// the actions they point at are loaded.
export default defineConfig(({ mode }) => ({
    build: {
        lib: {
            entry: resolve(__dirname, 'app/main.js'),
            fileName: () => 'capacitor-app.js',
            formats: ['es'],
        },
        rollupOptions: {
            output: {
                chunkFileNames: 'capacitor-app/[name]-[hash].js',
            },
        },
        outDir: 'www',
        emptyOutDir: false,
        sourcemap: mode !== 'production',
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'app'),
        },
    },
}));
