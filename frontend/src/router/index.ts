import { createRouter, createWebHistory, createMemoryHistory, useRouter } from "vue-router";
import App from "../App.vue";

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: App,
    },
    {
      path: "/wts",
      name: "wts",
      component: () => import("~pages/WTS.vue"),
    },
    {
      path: "/wtb",
      name: "WTB",
      component: () => import("~pages/WTB.vue"),
    },
  ],
});

export default router;
