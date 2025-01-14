<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { onClickOutside } from '@vueuse/core';

interface NavLink {
  name: string;
  path: string;
  icon: string;
}

const dashboardNavLinks: NavLink[] = [
  { name: 'dashboard', path: '/dashboard', icon: 'i-heroicons-home-solid' },
  { name: 'cards', path: '/cards', icon: 'i-heroicons-credit-card-solid' },
  {
    name: 'card-reads',
    path: '/card-reads',
    icon: 'i-heroicons-document-text-solid'
  },
  { name: 'wifi', path: '/wifi', icon: 'i-heroicons-wifi-solid' },
  { name: 'config', path: '/config', icon: 'i-heroicons-cog-6-tooth-solid' },
  {
    name: 'firmware-update',
    path: '/firmware-update',
    icon: 'i-heroicons-cloud-arrow-down-solid'
  }
];

defineProps<{
  activeRoute: string;
}>();

const route = useRoute();

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Close menu when route changes
watch(
  () => route.path,
  () => {
    isMenuOpen.value = false;
  }
);

// Close menu when clicking outside
const navRef = ref<HTMLElement | null>(null);
onClickOutside(navRef, () => {
  isMenuOpen.value = false;
});
</script>

<template>
  <nav
    ref="navRef"
    class="bg-blue-700 text-white rounded-lg mb-6 shadow-md relative"
  >
    <!-- Mobile Menu Button -->
    <div class="flex items-center justify-between p-3 lg:hidden">
      <button
        @click="toggleMenu"
        class="p-2 rounded-md hover:bg-blue-600 transition-colors"
        aria-label="Toggle menu"
      >
        <div v-if="!isMenuOpen" class="i-heroicons-bars-3-solid w-6 h-6"></div>
        <div v-else class="i-heroicons-x-mark-solid w-6 h-6"></div>
      </button>
      <span class="font-medium">Menu</span>
    </div>

    <!-- Desktop Navigation -->
    <div class="hidden lg:flex justify-center gap-2 p-3">
      <router-link
        v-for="link in dashboardNavLinks"
        :key="link.path"
        :to="link.path"
        :class="[
          'px-4 py-2 rounded-md transition-all flex items-center gap-2',
          activeRoute === link.name
            ? 'bg-white text-blue-700'
            : 'hover:bg-blue-600'
        ]"
      >
        <div :class="[link.icon, 'text-lg']"></div>
        <span class="text-sm font-medium">
          {{ link.name.charAt(0).toUpperCase() + link.name.slice(1) }}
        </span>
      </router-link>
    </div>

    <!-- Mobile Navigation -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-show="isMenuOpen"
        class="lg:hidden absolute left-0 right-0 top-[100%] bg-blue-700 rounded-b-lg shadow-lg z-50 border-t border-blue-600"
      >
        <div class="p-3 flex flex-col gap-2">
          <router-link
            v-for="link in dashboardNavLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'px-4 py-3 rounded-md transition-all flex items-center gap-3 justify-center',
              activeRoute === link.name
                ? 'bg-white text-blue-700'
                : 'hover:bg-blue-600'
            ]"
            @click="isMenuOpen = false"
          >
            <div :class="[link.icon, 'text-lg']"></div>
            <span class="font-medium">
              {{ link.name.charAt(0).toUpperCase() + link.name.slice(1) }}
            </span>
          </router-link>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
/* Remove unused styles */
</style>
