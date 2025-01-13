<template>
  <div class="font-sans antialiased p-8 max-w-7xl mx-auto">
    <NavBar :active-route="currentRoute">
      <template #header>
        <h1 class="text-3xl font-bold">{{ route.meta.title }}</h1>
        <p class="text-blue-100">{{ route.meta.subtitle }}</p>
      </template>
    </NavBar>
      <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const route = useRoute();
const currentRoute = computed(() => route.name  as string || "");
</script>
