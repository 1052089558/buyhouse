import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layout/index.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Layout,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

// router.beforeEach((to, from, next) => {
//   console.log(to, from);
//   let token = localStorage.token;
//   if (token) {
//     // 是否有该路径
//     if (to.matched.length > 0 || from.path !== "/") {
//       next();
//     } else {
//       // 防止页面刷新
//       if (from.path == "/" && to.matched.length <= 0) {
//         next(to.path);
//       } else {
//         next("/404");
//       }
//     }
//   } else {
//     // 去登录页
//     if (to.path == "/login") {
//       next();
//     } else {
//       next("/login");
//     }
//   }
// });
export default router;
