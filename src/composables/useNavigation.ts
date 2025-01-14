import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { RouteComponent } from 'vue-router';

export interface NavigationRoute {
  name: string;
  path: string;
  icon?: string;
  showInNav?: boolean;
}

function isValidComponent(component: any): component is RouteComponent {
  return typeof component === 'object' || typeof component === 'function';
}

export function useNavigation() {
  const router = useRouter();

  const navigationRoutes = computed(() => {
    return router.options.routes
      .filter((route) => {
        // Check if route has a component and is not just a redirect
        const hasComponent = isValidComponent(route.component);
        const isNotRedirect = !route.redirect;
        return (
          route.meta?.showInNav !== false &&
          route.name &&
          route.path &&
          hasComponent &&
          isNotRedirect
        );
      })
      .map(
        (route): NavigationRoute => ({
          name: String(route.name),
          path: route.path,
          icon: route.meta?.icon as string | undefined,
          showInNav: route.meta?.showInNav as boolean | undefined
        })
      );
  });

  return {
    navigationRoutes
  };
}
