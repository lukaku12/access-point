<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const route = useRoute();
const currentRoute = computed(() => route.name as string || "");
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="font-sans antialiased p-8 max-w-7xl mx-auto">
      <!-- Navbar stays at top -->
      <NavBar :active-route="currentRoute"/>

      <!-- Content area - vertically centered on large screens -->
      <div class="lg:min-h-[calc(100vh-200px)] lg:flex lg:items-center">
        <Transition name="fade" mode="out-in">
          <router-view class="w-full" />
        </Transition>
      </div>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>