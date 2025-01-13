import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    redirect: { name: 'dashboard' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
