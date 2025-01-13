import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    redirect: { name: 'dashboard' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
