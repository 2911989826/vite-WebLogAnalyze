import { createRouter, createWebHistory } from 'vue-router';
import Home from '../view/Home.vue';

// 在这里定义您的路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  // 更多路由...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;