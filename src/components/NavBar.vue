<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { onClickOutside } from '@vueuse/core';
import BaseModal from '@/components/base/BaseModal.vue';
import { useTheme } from '@/composables/useTheme';
import { logout } from '@/api/login';
import router from '@/router';

interface NavLink {
  name: string;
  path: string;
  icon: string;
}

const dashboardNavLinks: NavLink[] = [
  { name: 'Dashboard', path: '/dashboard', icon: 'i-heroicons-home-solid' },
  { name: 'Cards', path: '/cards', icon: 'i-heroicons-credit-card-solid' },
  {
    name: 'Card Reads',
    path: '/card-reads',
    icon: 'i-heroicons-document-text-solid'
  },
  { name: 'Wifi', path: '/wifi', icon: 'i-heroicons-wifi-solid' },
  { name: 'Config', path: '/config', icon: 'i-heroicons-cog-6-tooth-solid' },
  {
    name: 'Firmware Update',
    path: '/firmware-update',
    icon: 'i-heroicons-cloud-arrow-down-solid'
  }
];

defineProps<{
  activeRoute: string;
}>();

const route = useRoute();

// Add computed property for current route
const currentRoute = computed(() => route.path);

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

const showLogoutModal = ref(false);

const handleLogout = () => {
  showLogoutModal.value = true;
};

const confirmLogout = () => {
  // Add your actual logout logic here
  logout();
  setTimeout(() => {
    router.push({ name: 'landing' });
  }, 500);
  console.log('Logout confirmed');
  showLogoutModal.value = false;
};

const { isDark, toggleTheme } = useTheme();
const isAnimating = ref(false);

const handleThemeToggle = async () => {
  isAnimating.value = true;
  toggleTheme();
  // Reset animation flag after transition
  setTimeout(() => {
    isAnimating.value = false;
  }, 500);
};

// Add this function to format the text
const formatDisplayText = (text: string) => {
  return text.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};
</script>

<template>
  <nav
    ref="navRef"
    class="bg-blue-700 text-white rounded-lg mb-6 shadow-md relative dark:bg-gray-800"
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
      <div class="flex items-center gap-2">
        <button
          @click="handleThemeToggle"
          class="relative w-10 h-10 rounded-md hover:bg-blue-600 transition-all flex items-center justify-center overflow-hidden"
          aria-label="Toggle theme"
          :disabled="isAnimating"
        >
          <div
            class="absolute inset-0 flex items-center justify-center transition-transform duration-500"
            :class="[isDark ? 'translate-y-full' : 'translate-y-0']"
          >
            <div class="i-heroicons-moon-solid w-6 h-6"></div>
          </div>
          <div
            class="absolute inset-0 flex items-center justify-center transition-transform duration-500"
            :class="[isDark ? 'translate-y-0' : '-translate-y-full']"
          >
            <div class="i-heroicons-sun-solid w-6 h-6"></div>
          </div>
        </button>
        <button
          @click="handleLogout"
          class="p-2 rounded-md hover:bg-blue-600 transition-colors"
          aria-label="Logout"
        >
          <div class="i-heroicons-arrow-right-on-rectangle-solid w-6 h-6"></div>
        </button>
      </div>
    </div>

    <!-- Desktop Navigation -->
    <div class="hidden lg:flex justify-between items-center p-3">
      <div class="flex gap-2">
        <router-link
          v-for="link in dashboardNavLinks"
          :key="link.path"
          :to="link.path"
          :class="[
            'px-4 py-2 rounded-md transition-all flex items-center gap-2',
            currentRoute === link.path
              ? 'bg-white text-blue-700'
              : 'hover:bg-blue-600'
          ]"
        >
          <div :class="[link.icon, 'text-lg']"></div>
          <span class="text-sm font-medium">
            {{ formatDisplayText(link.name) }}
          </span>
        </router-link>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="handleThemeToggle"
          class="relative w-10 h-10 rounded-md hover:bg-blue-600 transition-all flex items-center justify-center overflow-hidden"
          aria-label="Toggle theme"
          :disabled="isAnimating"
        >
          <div
            class="absolute inset-0 flex items-center justify-center transition-transform duration-500"
            :class="[isDark ? 'translate-y-full' : 'translate-y-0']"
          >
            <div class="i-heroicons-moon-solid w-6 h-6"></div>
          </div>
          <div
            class="absolute inset-0 flex items-center justify-center transition-transform duration-500"
            :class="[isDark ? 'translate-y-0' : '-translate-y-full']"
          >
            <div class="i-heroicons-sun-solid w-6 h-6"></div>
          </div>
        </button>
        <button
          @click="handleLogout"
          class="px-4 py-2 rounded-md hover:bg-blue-600 transition-all flex items-center gap-2"
          aria-label="Logout"
        >
          <div class="i-heroicons-arrow-right-on-rectangle-solid text-lg"></div>
          <span class="text-sm font-medium">Logout</span>
        </button>
      </div>
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
        class="lg:hidden absolute left-0 right-0 top-[100%] bg-blue-700 dark:bg-gray-800 rounded-b-lg shadow-lg z-50 border-t border-blue-600 dark:border-gray-700"
      >
        <div class="p-3 flex flex-col gap-2">
          <router-link
            v-for="link in dashboardNavLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'px-4 py-3 rounded-md transition-all flex items-center gap-3 justify-center',
              currentRoute === link.path
                ? 'bg-white text-blue-700'
                : 'hover:bg-blue-600'
            ]"
            @click="isMenuOpen = false"
          >
            <div :class="[link.icon, 'text-lg']"></div>
            <span class="font-medium">
              {{ formatDisplayText(link.name) }}
            </span>
          </router-link>
        </div>
      </div>
    </Transition>
  </nav>

  <!-- Logout Confirmation Modal -->
  <BaseModal
    v-model:show="showLogoutModal"
    title="Confirm Logout"
    confirm-text="Logout"
    @close="showLogoutModal = false"
    @confirm="confirmLogout"
  >
    <p>Are you sure you want to logout?</p>
  </BaseModal>
</template>

<style scoped>
button:disabled {
  pointer-events: none;
}
</style>
