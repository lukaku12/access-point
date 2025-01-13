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
    component: {
      render: () => 'cards'
    },
    meta: {
      title: 'Cards Management',
      subtitle: 'Manage Access Cards'
    }
  },
  {
    path: '/card-reads',
    name: 'card-reads',
    component: {
      render: () => 'card-reads'
    },
    meta: {
      title: 'Card Reads',
      subtitle: 'View Card Read History'
    }
  },
  {
    path: '/wifi',
    name: 'wifi',
    component: {
      render: () => 'wifi'
    },
    meta: {
      title: 'WiFi Settings',
      subtitle: 'Configure Network Settings'
    }
  },
  {
    path: '/config',
    name: 'config',
    component: {
      render: () => 'config'
    },
    meta: {
      title: 'Configuration',
      subtitle: 'System Configuration'
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
