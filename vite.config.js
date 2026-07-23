import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

let basePath = '/';
try {
    const envContent = readFileSync('.env', 'utf8');
    const match = envContent.match(/^VITE_BASE_PATH=(.+)$/m);
    if (match) basePath = match[1].trim();
} catch {}

export default defineConfig({
    base: basePath,
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
