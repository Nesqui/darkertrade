import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    include: [/\.vue$/, /\.md$/],
  }),
  Layouts(),
  Pages({
    extensions: ['vue', 'md'],
  })],
  build: {
    chunkSizeWarningLimit: 1600,
  },
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
  },
})
