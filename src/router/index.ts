import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    redirect: { name: 'dashboard' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: 'ESP32 Dashboard',
      subtitle: 'System Monitor and Statistics'
    }
  },
  {
    path: '/cards',
    name: 'cards',
    component: () => import('@/views/CardsView.vue'),
    meta: {
      title: 'Cards Management',
      subtitle: 'Manage Access Cards'
    }
  },
  {
    path: '/card-reads',
    name: 'card-reads',
    component: () => import('@/views/CardReadsView.vue'),
    meta: {
      title: 'Card Reads',
      subtitle: 'View Card Read History'
    }
  },
  {
    path: '/wifi',
    name: 'wifi',
    component: () => import('@/views/WifiView.vue'),
    meta: {
      title: 'WiFi Settings',
      subtitle: 'Configure Network Settings'
    }
  },
  {
    path: '/config',
    name: 'config',
    component: () => import('@/views/ConfigView.vue'),
    meta: {
      title: 'Configuration',
      subtitle: 'System Configuration'
    }
  },
  {
    path: '/firmware-update',
    name: 'firmware-update',
    component: {
      render: () => 'firmware-update'
    },
    meta: {
      title: 'Firmware Update',
      subtitle: 'Update Device Firmware'
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
