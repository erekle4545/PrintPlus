import { defineConfig,loadEnv  } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [
            react(),
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.jsx'],
                refresh: true,
            }),
        ],
        define: {
            'process.env':env
        }
    }
});
// export default defineConfig(({ mode }) => {
//     const env = loadEnv(mode, process.cwd(), '');
//     return {
//         define: {
//             'process.env.SOME_KEY': JSON.stringify(env.SOME_KEY)
//         },
//         plugins: [react()],
//     }
// })
