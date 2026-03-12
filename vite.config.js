import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    root: '.',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'pages/about.html'),
                blog: resolve(__dirname, 'pages/blog.html'),
                projects: resolve(__dirname, 'pages/projects.html'),
                contact: resolve(__dirname, 'pages/contact.html'),
                post: resolve(__dirname, 'blog/post.html'),
            }
        }
    },
    server: {
        open: '/'
    }
})
