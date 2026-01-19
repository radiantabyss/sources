import { defineConfig } from 'vite';
import fs from 'fs-extra';
import { resolve } from 'path';

function copyNeutralino() {
    return {
        name: 'copy-neutralino',
        closeBundle() {
            if ( process.env.NODE_ENV === 'development' ) {
                return;
            }

            fs.copy(resolve(__dirname, 'neutralino.js'), resolve(__dirname, 'front/neutralino.js'));
        }
    }
}

export default defineConfig(({ mode }) => ({
    plugins: [
        copyNeutralino(),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'app/main.js'),
            name: 'neutralino-app',
            fileName: 'neutralino-app',
            formats: ['es']
        },
        outDir: 'front',
        emptyOutDir: mode == 'production',
        sourcemap: mode !== 'production',
    },
    define: {
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'app'),
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    }
}));
