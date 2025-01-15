import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from 'vue-router';
import { isAuthorized } from '@/api/login';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      public: true
    }
  },
  {
    path: '/',
    name: 'landing',
    redirect: isAuthorized() ? { name: 'dashboard' } : { name: 'login' }
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
    component: () => import('@/views/FirmwareUpdateView.vue'),
    meta: {
      title: 'Firmware Update',
      subtitle: 'Update Device Firmware'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Page Not Found',
      subtitle: '404 Error',
      public: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, _, next) => {
  const auth = isAuthorized();

  if (to.name === 'login' && auth) {
    next({ name: 'dashboard' });
  } else if (!to.meta.public && !auth) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
