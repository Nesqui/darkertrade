import { createRouter, createWebHistory, createMemoryHistory, useRouter } from "vue-router";
import App from "../App.vue";
import routes from '~pages'

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes
  // routes: [
    // {
    //   path: "/",
    //   name: "home",
    //   component: App,
    // },
    // {
    //   path: "/wts",
    //   name: "wts",
    //   component: () => import("~pages/WTS.vue"),
    // },
    // {
    //   path: "/wtb",
    //   name: "WTB",
    //   component: () => import("~pages/WTB.vue"),
    // },
    // {
    //   path: "/user/:nickname",
    //   component: () => import("~/pages/user/[nickname].vue"),
    //   children: [{
    //     path: "items",
    //     name: "my-items",
    //     component: () => import("~/pages/user/[nickname]/Items.vue"),
    //     children: [{
    //       path: ":id",
    //       name: "userItem",
    //       component: () => import("~/pages/user/[nickname]/items/[id].vue"),
    //     }]
    //   }]
    // },
    // {
    //   path: "/user/:nickname/items",
    //   name: "my-items",
    //   component: () => import("~/pages/user/[nickname]/Items.vue"),
    // },
    // {
    //   path: "/user/:nickname/items/:id",
    //   name: "userItem",
    //   component: () => import("~/pages/user/[nickname]/items/[id].vue"),
    // },
  // ],
});

export default router;
