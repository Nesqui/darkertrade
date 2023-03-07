import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "./assets/scss/main.scss";
import router from "./router";
import { ViteSSG } from "vite-ssg";
import generatedRoutes from "~pages";
import { setupLayouts } from "virtual:generated-layouts";
import { initApi } from './hooks';
import { createPinia } from 'pinia'

const routes = setupLayouts(generatedRoutes);
initApi()
// createApp(App)
// .use(ElementPlus)
// .use(router)
// .mount('#app')

ViteSSG(App, { routes }, ({ app, router, routes, isClient, initialState }) => {
  const pinia = createPinia()
  app.use(pinia)
  app.use(ElementPlus)
  app.use(router)
});
