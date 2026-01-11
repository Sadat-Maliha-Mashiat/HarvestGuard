import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    root: '.', // Default root
    server: {
        port: 3000,
        open: '/src/features/crop-health/index.html', // Open this specific page on start
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'public/index.html'),
                cropHealth: resolve(__dirname, 'src/features/crop-health/index.html'),
                // Add other HTML pages here if you want Vite to build them
            },
        },
    },
})
