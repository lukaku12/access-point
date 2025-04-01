<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const route = useRoute();
const hideNavbar = computed(
  () => route.name === 'login' || route.name === 'not-found'
);
const currentRoute = computed(() => (route.name as string) || '');
</script>

<template>
  <div
    :class="{
      'bg-gray-50 dark:bg-gray-900 transition-colors duration-200': !hideNavbar,
      'overflow-y-hidden': hideNavbar
    }"
    class="h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
  >
    <div class="font-sans antialiased p-8 max-w-[90rem] mx-auto h-full">
      <!-- Navbar stays at top -->
      <NavBar v-if="!hideNavbar" :active-route="currentRoute" />

      <!-- Content area - vertically centered on large screens -->
      <div :class="{ 'lg:flex lg:items-center': !hideNavbar }">
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" class="w-full" />
          </Transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
