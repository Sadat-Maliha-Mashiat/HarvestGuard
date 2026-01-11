import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    root: '.', // Ensure root is current working directory
    server: {
        port: 3000,
        open: '/index.html', // Open the new root index
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'), // New root index
                cropHealth: resolve(__dirname, 'src/features/crop-health/index.html'),
                farmManagement: resolve(__dirname, 'src/features/farm-management/index.html'),
                weather: resolve(__dirname, 'src/features/weather/index.html'),
                riskForecast: resolve(__dirname, 'src/features/risk-forecast/index.html'),
                riskMap: resolve(__dirname, 'src/features/risk-map/index.html'),
            },
        },
    },
})
