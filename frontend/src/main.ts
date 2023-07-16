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
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// declare global {
//   interface Window {
//       ym:any;
//   }
// }

const routes = setupLayouts(generatedRoutes);
initApi()
// createApp(App)
// .use(ElementPlus)
// .use(router)
// .mount('#app')

ViteSSG(App, { routes }, ({ app, router, routes, isClient, initialState }) => {
  const pinia = createPinia()
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  app.use(pinia)
  app.use(ElementPlus)
  app.use(router)
});
